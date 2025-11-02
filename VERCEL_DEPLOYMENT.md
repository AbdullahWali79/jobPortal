# Vercel Deployment Guide

Step-by-step instructions to deploy your InternHub Portal to Vercel.

## Prerequisites

✅ Your project is on GitHub (recommended) or GitLab/Bitbucket  
✅ You have a Vercel account (sign up at [vercel.com](https://vercel.com) - free)  
✅ Your Supabase project is set up and running  
✅ Your `.env.local` file has all the required variables

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Your Code to GitHub

1. Make sure your code is committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Verify your repository is public or you have Vercel connected to your private repo

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository (`jobPortal`)
5. Click **"Import"**

### Step 3: Configure Project Settings

1. **Framework Preset**: Vercel should auto-detect Next.js (verify it says "Next.js")
2. **Root Directory**: Leave as `./` (unless your Next.js app is in a subfolder)
3. **Build Command**: `npm run build` (should be auto-filled)
4. **Output Directory**: `.next` (should be auto-filled)
5. **Install Command**: `npm install` (should be auto-filled)

### Step 4: Add Environment Variables

**This is critical!** Add all environment variables from your `.env.local`:

1. In the project configuration page, scroll down to **"Environment Variables"**
2. Click **"Add"** for each variable:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```
   - Value: Your Supabase project URL
   - Environments: ✅ Production ✅ Preview ✅ Development

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   - Value: Your Supabase anon key
   - Environments: ✅ Production ✅ Preview ✅ Development

   ```
   SUPABASE_SERVICE_ROLE_KEY
   ```
   - Value: Your Supabase service role key (keep this secret!)
   - Environments: ✅ Production ✅ Preview ✅ Development

   ```
   NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS
   ```
   - Value: `5` (or your preferred number)
   - Environments: ✅ Production ✅ Preview ✅ Development

3. Click **"Add"** after each variable

### Step 5: Deploy

1. Click **"Deploy"** button at the bottom
2. Wait for the build to complete (usually 1-3 minutes)
3. Vercel will show you a deployment URL (e.g., `your-project.vercel.app`)

### Step 6: Verify Deployment

1. Click on your deployment URL to test the site
2. Check:
   - ✅ Landing page loads (`/`)
   - ✅ Software house page loads (`/softwarehouse`)
   - ✅ Admin page loads (`/admin`)
   - ✅ No console errors (press F12 to check)

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Or use npx (no installation needed):
```bash
npx vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

### Step 3: Deploy

From your project root directory:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account/team
- **Link to existing project?** → No (first time)
- **What's your project's name?** → `internhub-portal` (or your choice)
- **In which directory is your code located?** → `./` (press Enter)
- **Want to override the settings?** → No (first time)

### Step 4: Add Environment Variables

After the first deployment, add environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS
```

For each variable, enter:
- **Value**: Paste your actual value
- **Which environments?** → Select Production, Preview, and Development (press Space to select all, then Enter)

### Step 5: Deploy to Production

```bash
vercel --prod
```

## Post-Deployment Steps

### 1. Set Up Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

### 2. Configure Supabase CORS (If Needed)

If you encounter CORS errors, add your Vercel URL to Supabase:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Add your Vercel domain to allowed origins (if required)

### 3. Set Up Supabase Edge Function (Auto-Expire Jobs)

Your app has an auto-expire function. Set it up:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Deploy the function:
   ```bash
   supabase functions deploy expire-jobs
   ```

4. Set up a cron job (see Supabase documentation for scheduling)

### 4. Monitor Your Deployment

- **Build Logs**: Check Vercel Dashboard → **Deployments** → Click on a deployment
- **Runtime Logs**: Check **Functions** tab in Vercel Dashboard
- **Analytics**: Enable in Vercel Dashboard (free tier available)

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check that all dependencies are in `package.json`
- Make sure `node_modules` is in `.gitignore`

**Error: "Environment variable not found"**
- Verify all environment variables are added in Vercel Dashboard
- Redeploy after adding variables

### Runtime Errors

**"Failed to connect to Supabase"**
- Double-check environment variables in Vercel Dashboard
- Verify Supabase project is active
- Check Supabase URL and keys are correct

**Blank pages or 404 errors**
- Check that Next.js app router structure is correct
- Verify `next.config.js` is properly configured
- Check build logs for errors

### Common Issues

**Environment variables not working:**
- After adding env vars, you MUST redeploy
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Service role key should NOT start with `NEXT_PUBLIC_`

**Database connection issues:**
- Ensure Supabase project is not paused
- Check RLS (Row Level Security) policies are set up correctly
- Verify database schema was run in Supabase SQL Editor

## Updating Your Deployment

### Automatic Deployments

Vercel automatically deploys when you push to your main branch:
1. Push changes to GitHub
2. Vercel detects the push
3. Builds and deploys automatically

### Manual Deployment

```bash
vercel --prod
```

### Preview Deployments

Every pull request automatically gets a preview URL:
- Perfect for testing changes before merging
- Share with team members for review

## Quick Reference

**Environment Variables Needed:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS
```

**Vercel Dashboard:** https://vercel.com/dashboard  
**Vercel CLI Docs:** https://vercel.com/docs/cli  
**Next.js on Vercel:** https://vercel.com/docs/frameworks/nextjs

---

🎉 **Congratulations!** Your InternHub Portal is now live on Vercel!

