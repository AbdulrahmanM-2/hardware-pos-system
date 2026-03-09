import React, { useState, useEffect } from 'react';
import Login from './Login';
import HardwarePOS from './HardwarePOS';
import { supabase, isSupabaseConfigured, signIn, signOut, getSession, getUserProfile } from './supabaseClient';

export default function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [demoMode, setDemoMode] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    // Listen for auth changes (if Supabase configured)
    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  const checkSession = async () => {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured - demo mode available');
        setDemoMode(true);
        setLoading(false);
        return;
      }

      // Check for existing session
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await getUserProfile(userId);
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogin = async (email, password, rememberMe) => {
    // Demo mode - bypass Supabase
    if (!isSupabaseConfigured() || demoMode) {
      if (email === 'admin@buildpro.com' && password === 'demo123') {
        const demoUser = {
          id: 'demo-user',
          email: 'admin@buildpro.com',
          demo: true,
        };
        const demoProfile = {
          id: 'demo-user',
          email: 'admin@buildpro.com',
          name: 'Demo Admin',
          role: 'admin',
          active: true,
        };
        setUser(demoUser);
        setUserProfile(demoProfile);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('demoProfile', JSON.stringify(demoProfile));
        return;
      } else {
        throw new Error('Invalid credentials. Try: admin@buildpro.com / demo123');
      }
    }

    // Real Supabase login
    const { data, error } = await signIn(email, password);
    if (error) throw error;

    if (data?.user) {
      setUser(data.user);
      await loadUserProfile(data.user.id);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
    }
  };

  const handleLogout = async () => {
    if (demoMode || !isSupabaseConfigured()) {
      // Demo mode logout
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('demoUser');
      localStorage.removeItem('demoProfile');
      return;
    }

    // Real logout
    await signOut();
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('rememberMe');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-yellow-500 text-zinc-900 p-4 rotate-45 transform mb-6 animate-pulse">
            <div className="-rotate-45 text-4xl font-black">BP</div>
          </div>
          <p className="text-zinc-400 font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} language={language} />;
  }

  // Show POS if authenticated
  return (
    <HardwarePOS 
      user={user} 
      userProfile={userProfile} 
      onLogout={handleLogout}
      language={language}
      setLanguage={setLanguage}
      demoMode={demoMode || !isSupabaseConfigured()}
    />
  );
}
