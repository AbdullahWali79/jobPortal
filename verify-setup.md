# Verify Your Setup

## Quick Checklist

- [ ] Created `.env.local` file with your Supabase credentials
- [ ] Ran the database schema SQL in Supabase SQL Editor
- [ ] (Optional) Added sample data
- [ ] Installed dependencies (`npm install`)
- [ ] Started dev server (`npm run dev`)

## Test Your Connection

Once the dev server is running, test these endpoints:

1. **Home Page**: http://localhost:3000
   - Should display job listings (if sample data was added)
   - Search and filters should work

2. **Software House Dashboard**: http://localhost:3000/softwarehouse
   - Should show registration form
   - Try registering a new company

3. **Admin Panel**: http://localhost:3000/admin
   - Should show pending software houses
   - Should show job posts

## Common Issues

### "Invalid API key" error
- Check that `.env.local` exists in the root directory
- Verify the anon key is correct (starts with `eyJ...`)
- Restart the dev server after creating `.env.local`

### No jobs showing on homepage
- Run the seed data SQL (`supabase/seed.sql`)
- Check Supabase Dashboard → Table Editor → `job_posts` table
- Verify jobs have `status = 'active'` and `expires_at` is in the future

### "relation does not exist" error
- You haven't run the schema SQL yet
- Go to Supabase SQL Editor and run `supabase/schema.sql`

### RLS Policy errors
- The schema.sql includes RLS policies - make sure you ran it
- Check Supabase Dashboard → Authentication → Policies

## Need Help?

Check the browser console (F12) for detailed error messages.
Check the terminal where `npm run dev` is running for server errors.

