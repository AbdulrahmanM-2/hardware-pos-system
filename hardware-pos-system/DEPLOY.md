# GitHub Deployment Guide

## 📋 Prerequisites
- GitHub account
- Git installed on your computer

## 🚀 Step-by-Step Deployment

### 1. Create a New GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **+** icon in the top right → **New repository**
3. Fill in the details:
   - **Repository name**: `hardware-pos-system` (or your preferred name)
   - **Description**: Hardware Building Materials POS System
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **Create repository**

### 2. Initialize Git and Push to GitHub

Open terminal in the `hardware-pos-system` folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Hardware POS System"

# Add your GitHub repository as remote
# Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual values
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to GitHub Pages (Option A)

#### Using GitHub Actions (Automatic - Recommended)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow is already configured in `.github/workflows/deploy.yml`
5. Every time you push to `main`, it will automatically deploy!
6. Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME`

#### Manual Deployment (Option B)

If you prefer manual control:

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add these to package.json scripts section:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist",
"homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME"

# Deploy
npm run deploy
```

### 4. Deploy to Vercel (Alternative - Easier)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **Add New** → **Project**
4. Select your `hardware-pos-system` repository
5. Vercel auto-detects the settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **Deploy**
7. Done! Your site is live with a custom URL

**Advantages of Vercel:**
- Faster deployment
- Free custom domain
- Automatic HTTPS
- Preview deployments for PRs
- Better performance

### 5. Deploy to Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/login with GitHub
3. Click **Add new site** → **Import an existing project**
4. Select GitHub → Choose your repository
5. Configure settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy site**
7. Done! Custom URL provided

### 6. Custom Domain (Optional)

#### For GitHub Pages:
1. Buy a domain (Namecheap, GoDaddy, etc.)
2. Add a `CNAME` file to your project root with your domain
3. In GitHub Settings → Pages, add your custom domain
4. Configure DNS records at your domain registrar

#### For Vercel/Netlify:
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## 🔄 Updating Your Deployment

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

- **GitHub Pages**: Automatically rebuilds (if using Actions)
- **Vercel/Netlify**: Automatically rebuilds on every push

## 🐛 Troubleshooting

### Build fails on GitHub Actions
- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Site shows blank page
- Check browser console for errors
- Verify `base` in `vite.config.js` is set correctly
- For GitHub Pages, it should be `base: '/YOUR-REPO-NAME/'`

### Assets not loading
- Ensure all imports use relative paths
- Check `vite.config.js` base URL setting

## 📊 Monitoring

- **GitHub**: Check Actions tab for deployment status
- **Vercel**: Dashboard shows deployments, analytics, logs
- **Netlify**: Dashboard shows deploys, analytics, forms

## 🎉 You're Live!

Your POS system is now deployed and accessible worldwide!

**Next Steps:**
- Add backend integration for data persistence
- Set up analytics (Google Analytics, Plausible)
- Add custom domain
- Enable error tracking (Sentry)
- Set up monitoring (UptimeRobot)
