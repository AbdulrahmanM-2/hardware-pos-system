import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login({ onLogin, language }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: 'BuildPro Hardware',
      subtitle: 'Point of Sale System',
      email: 'Email Address',
      password: 'Password',
      rememberMe: 'Remember me',
      login: 'Login',
      loggingIn: 'Logging in...',
      noAccount: 'No Supabase configured - using demo mode',
    },
    sw: {
      title: 'BuildPro Hardware',
      subtitle: 'Mfumo wa Mauzo',
      email: 'Barua Pepe',
      password: 'Neno la Siri',
      rememberMe: 'Nikumbuke',
      login: 'Ingia',
      loggingIn: 'Inaingia...',
      noAccount: 'Hakuna Supabase iliyowekwa - kutumia hali ya maonyesho',
    }
  };

  const t = translations[language] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password, rememberMe);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-yellow-500 text-zinc-900 p-4 rotate-45 transform mb-6">
            <div className="-rotate-45 text-4xl font-black">BP</div>
          </div>
          <h1 className="text-4xl font-black text-zinc-100 mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>
            {t.title}
          </h1>
          <p className="text-zinc-400 font-mono text-sm">{t.subtitle}</p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-800 border-l-4 border-yellow-500 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border-l-4 border-red-500 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2 text-zinc-300 uppercase">
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-zinc-100 focus:border-yellow-500 focus:outline-none"
                placeholder="admin@buildpro.com"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-2 text-zinc-300 uppercase">
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-zinc-100 focus:border-yellow-500 focus:outline-none"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-zinc-400 cursor-pointer">
                {t.rememberMe}
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 py-4 font-black text-xl uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn className="w-6 h-6" />
              {loading ? t.loggingIn : t.login}
            </button>
          </form>

          {/* Demo Mode Notice */}
          <div className="mt-6 p-4 bg-zinc-900 border-l-2 border-yellow-500">
            <p className="text-xs text-zinc-400 text-center">
              {t.noAccount}
            </p>
            <p className="text-xs text-zinc-500 text-center mt-1">
              Demo: admin@buildpro.com / demo123
            </p>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-zinc-600 text-xs mt-4 font-mono">
          v4.0.0 Enterprise Edition
        </p>
      </div>
    </div>
  );
}
