# Vercel Deployment Checklist

Quick checklist to deploy your app to Vercel.

## ✅ Pre-Deployment Checklist

- [ ] Code is committed and pushed to GitHub
- [ ] `.env.local` file exists locally with all variables
- [ ] Supabase project is set up and running
- [ ] Database schema is applied in Supabase
- [ ] Local build works: `npm run build`

## ✅ Deployment Steps

### Via Vercel Dashboard:

1. [ ] Go to [vercel.com](https://vercel.com) and sign in
2. [ ] Click **"Add New..."** → **"Project"**
3. [ ] Import your GitHub repository
4. [ ] Add environment variables:
   - [ ] `NEXT_PUBLIC_SUPABASE_URL`
   - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - [ ] `SUPABASE_SERVICE_ROLE_KEY`
   - [ ] `NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS`
5. [ ] Click **"Deploy"**
6. [ ] Wait for build to complete

### Via CLI:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS

# Deploy to production
vercel --prod
```

## ✅ Post-Deployment Verification

- [ ] Landing page loads (`/`)
- [ ] Software house page loads (`/softwarehouse`)
- [ ] Admin page loads (`/admin`)
- [ ] No console errors (F12 → Console tab)
- [ ] Supabase connection works
- [ ] Jobs display correctly

## 🔧 Environment Variables Format

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS=5
```

## 📚 Full Instructions

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed step-by-step guide.

