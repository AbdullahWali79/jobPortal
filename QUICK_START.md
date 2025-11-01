# Quick Start Guide

Follow these steps to get InternHub Portal running locally:

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run `supabase/schema.sql`
4. (Optional) Run `supabase/seed.sql` for sample data
5. Copy your credentials from **Settings** → **API**

## 3. Create `.env.local`

Copy the environment variables from `ENV_SETUP.md` and fill in your Supabase credentials.

## 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 5. Test the Application

### Landing Page
- View jobs at `/`
- Search and filter jobs
- Click "Contact Now" on job cards

### Software House Registration
- Go to `/softwarehouse`
- Fill in registration form
- Submit for approval
- (You'll need admin to approve)

### Admin Panel
- Go to `/admin`
- Approve/reject software houses
- Manage job posts
- Configure default display days

## 6. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## Next Steps

- Set up Supabase Edge Function for auto-expiring jobs (see README.md)
- Configure cron job to run expire function daily
- Add authentication for production use
- Customize colors and branding

---

For detailed instructions, see [README.md](./README.md)

