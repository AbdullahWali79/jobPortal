# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Default Job Post Display Days
NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS=5

# Admin Password (Optional - defaults to 'admin123' if not set)
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
```

## How to Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Important Notes

- The `service_role` key has admin access - **NEVER** commit this to version control
- The `.env.local` file is already in `.gitignore` and won't be committed
- For Vercel deployment, add these variables in the Vercel dashboard under **Settings** → **Environment Variables**
- **Admin Password**: The default password is `admin123`. Change it by setting `NEXT_PUBLIC_ADMIN_PASSWORD` in Vercel. For production, use a strong password!

