# Troubleshooting Guide - Blank Pages Issue

## If `/admin` or `/softwarehouse` pages are blank:

### Step 1: Check Browser Console
1. Open the page that's blank
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Look for any red error messages
5. Share the error message if you see one

### Step 2: Verify Environment Variables
Check if `.env.local` file exists and has correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xwohxmigixrrlcpspsqs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** After creating or updating `.env.local`:
- Stop the dev server (Ctrl+C)
- Restart with `npm run dev`

### Step 3: Check Database Setup
The pages need database tables to exist. 

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/xwohxmigixrrlcpspsqs
2. Open **SQL Editor**
3. Check if tables exist:
   - `software_houses`
   - `job_posts`

If tables don't exist:
- Run `supabase/schema.sql` in SQL Editor

### Step 4: Check RLS Policies
Row Level Security might be blocking access:

1. In Supabase Dashboard → **Authentication** → **Policies**
2. Make sure policies are set up (they should be created by schema.sql)

### Step 5: Common Errors

#### Error: "relation does not exist"
- **Solution:** Run `supabase/schema.sql` in Supabase SQL Editor

#### Error: "new row violates row-level security policy"
- **Solution:** Check RLS policies in Supabase Dashboard
- Make sure you ran the complete schema.sql

#### Error: "Invalid API key" or "Failed to load"
- **Solution:** 
  1. Verify `.env.local` has correct credentials
  2. Restart dev server
  3. Check browser console for specific error

#### Blank page with no console errors
- **Solution:** 
  1. Check if page shows loading spinner (might be slow connection)
  2. Wait a few seconds
  3. Check Network tab in DevTools to see if API calls are failing

### Step 6: Test Connection
Test if Supabase connection works:

1. Open browser console (F12)
2. Type: `window.location.reload()`
3. Check console for any Supabase errors

### Step 7: Verify Server is Running
Make sure the dev server is still running:
- Terminal should show: `✓ Ready in X seconds`
- If not, restart with `npm run dev`

---

## Quick Fix Checklist

- [ ] `.env.local` file exists in root directory
- [ ] Environment variables are correct
- [ ] Dev server restarted after creating `.env.local`
- [ ] Database tables created (ran schema.sql)
- [ ] RLS policies exist
- [ ] Browser console checked for errors
- [ ] Network tab checked for failed requests

---

## Still Not Working?

1. **Check the error message** shown on the page (should now be visible)
2. **Check browser console** for detailed errors
3. **Check Network tab** in DevTools to see if API calls are failing
4. **Share the error message** and I can help fix it

The pages now show error messages if something goes wrong, so you'll know exactly what the issue is!

