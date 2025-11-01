# Quick Setup Instructions

## ✅ Step 1: Create `.env.local` File

Create a file named `.env.local` in the root directory with these contents:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xwohxmigixrrlcpspsqs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2h4bWlnaXhycmxjcHNwc3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDQ5MjksImV4cCI6MjA3NzU4MDkyOX0.TZTBhL7vTtZCkBHNNtaiFDF8BFHX6i6UTwh59E-qmmM
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS=5
```

⚠️ **Important**: Replace `your_service_role_key_here` with your actual service role key from Supabase Dashboard → Settings → API → service_role key

## ✅ Step 2: Set Up Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xwohxmigixrrlcpspsqs
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `supabase/schema.sql`
5. Click **Run** (or press Ctrl+Enter)

## ✅ Step 3: Add Sample Data (Optional)

1. In the SQL Editor, create a new query
2. Copy and paste the contents of `supabase/seed.sql`
3. Click **Run**

This will create:
- 2 approved software houses
- 3 sample job posts

## ✅ Step 4: Install Dependencies & Run

```bash
npm install
npm run dev
```

Then visit: http://localhost:3000

## 🔍 Verify Setup

1. **Landing Page** (`http://localhost:3000`) - Should show job listings
2. **Software House Dashboard** (`http://localhost:3000/softwarehouse`) - Should allow registration
3. **Admin Panel** (`http://localhost:3000/admin`) - Should show pending houses and jobs

---

## 🚨 Troubleshooting

### If jobs don't show up:
- Check that sample data was inserted correctly
- Verify RLS policies are set up (they should be from schema.sql)
- Check browser console for errors

### If you get Supabase connection errors:
- Verify `.env.local` file exists and has correct values
- Restart the dev server after creating `.env.local`
- Check that your Supabase project is active

### To check your database:
- Go to Supabase Dashboard → Table Editor
- You should see `software_houses` and `job_posts` tables
- Check that data exists in both tables
