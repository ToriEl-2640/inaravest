# InaraVest: Vercel Deployment Guide

## ✅ Step 1: Update Vercel CLI

Vercel is asking you to update. Run this command:

```bash
npm install -g vercel@latest
```

Or update globally:

```bash
npm update -g vercel
```

---

## ✅ Step 2: Login to Vercel

```bash
vercel login
```

You'll be asked:
- **Email**: Use your GitHub email
- Browser will open for authentication
- Confirm authorization

---

## ✅ Step 3: Link Your GitHub Repository

```bash
vercel link
```

When prompted:
- **Set up and deploy "..."?** → Type `y` and press Enter
- **Which scope should contain your project?** → Select your username
- **Link to existing project?** → Type `n` (No - this is new)
- **What's your project's name?** → `inaravest` (press Enter for default)
- **In which directory is your code located?** → `./client` (IMPORTANT!)
- **Want to modify vercel.json?** → Type `n`

---

## ✅ Step 4: Create vercel.json Configuration

Create a file **vercel.json** in your **client/** directory:

```bash
touch client/vercel.json
```

Add this content:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

---

## ✅ Step 5: Set Environment Variables

```bash
vercel env pull
```

This creates **.env.local** in your **client/** directory.

Add these variables to **client/.env.local**:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SOLANA_NETWORK=devnet
```

(You can update these later once you set up Supabase)

---

## ✅ Step 6: Deploy to Vercel

```bash
vercel --prod
```

Vercel will:
1. Build your app
2. Optimize for production
3. Deploy to CDN
4. Give you a live URL

---

## ✅ Step 7: Get Your Live URL

After deployment, you'll see:

```
✅ Production: https://inaravest.vercel.app
📝 Commit: abc123def456
🔍 Inspect: https://vercel.com/...
```

**Your app is now LIVE!** 🎉

---

## 🔗 What Happened

- ✅ Your `client/` folder was deployed
- ✅ Vite built your React app
- ✅ Vercel hosted it on their CDN
- ✅ App is accessible worldwide
- ✅ Auto-updates on GitHub push (if connected)

---

## 📊 Verify Deployment

Visit your URL and check:
- [ ] Homepage loads with hero section
- [ ] Navbar shows correctly
- [ ] "Explore Registries" page works
- [ ] "Create Registry" form appears
- [ ] Mobile responsive works (F12 → mobile icon)

---

## 🔄 Future Updates

Every time you push to GitHub:
```bash
git add .
git commit -m "Update app features"
git push origin main
```

Vercel automatically redeploys! ✨

---

## ⚙️ Environment Variables for Production

Once you set up Supabase & Solana:

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SOLANA_NETWORK=mainnet-beta` (for production)
   - `VITE_PAYSTACK_PUBLIC_KEY` (if using)

4. Redeploy:
```bash
vercel --prod
```

---

## ✅ If Deployment Fails

**Error: "Build failed"**
```bash
# Check build locally
cd client
npm run build
```

If it fails locally, fix the error first, then:
```bash
vercel --prod
```

**Error: "Timeout"**
```bash
# Increase build timeout
vercel env add VERCEL_BUILD_TIMEOUT 900
vercel --prod
```

---

## 🎯 Next Steps

### Option 1: Connect Backend (Supabase)
1. Create Supabase project
2. Set up database
3. Update env variables
4. Connect forms to backend
5. Redeploy

### Option 2: Add Solana Integration
1. Create Solana Program
2. Integrate wallet connection
3. Add Solana Pay QR codes
4. Test on devnet
5. Redeploy

### Option 3: Add Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Vercel auto-provisions SSL

---

## 📈 Monitor Your Deployment

**Vercel Dashboard**: https://vercel.com/dashboard

Features:
- Real-time analytics
- Build logs
- Error tracking
- Performance monitoring
- Rollback to previous versions

---

**Your app is deployed! Next: Connect Supabase backend.** 🚀
