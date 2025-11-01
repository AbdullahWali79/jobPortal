# InternHub Portal

A full-stack job and internship portal built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Landing Page**: Browse latest jobs and internships with search/filter functionality
- **Software House Dashboard**: Register your company, get approved, and post jobs
- **Admin Panel**: Approve/reject software houses, manage job posts, configure settings
- **Auto-Expiring Jobs**: Jobs automatically expire after a configurable number of days (default: 5)
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (Free tier)

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Vercel account (for deployment)

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to **SQL Editor** and run the schema:

```bash
# Copy and paste the contents of supabase/schema.sql into the SQL Editor
```

4. (Optional) Run the seed data:

```bash
# Copy and paste the contents of supabase/seed.sql into the SQL Editor
```

5. Get your Supabase credentials:
   - Go to **Settings** → **API**
   - Copy your **Project URL** and **anon/public key**
   - Copy your **service_role key** (keep this secret!)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS=5
```

### 4. Set Up Supabase Edge Function (Auto-Expire Jobs)

1. Install Supabase CLI (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Deploy the edge function:
   ```bash
   supabase functions deploy expire-jobs
   ```

5. Set up a cron job to run daily:
   - Go to Supabase Dashboard → **Database** → **Cron Jobs**
   - Add a new cron job:
     - **Name**: `expire-jobs-daily`
     - **Schedule**: `0 0 * * *` (runs at midnight UTC daily)
     - **Function**: `expire-jobs`

   Alternatively, you can use Supabase's pg_cron extension:
   ```sql
   SELECT cron.schedule(
     'expire-jobs-daily',
     '0 0 * * *',
     $$
     SELECT net.http_post(
       url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/expire-jobs',
       headers := jsonb_build_object(
         'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY',
         'Content-Type', 'application/json'
       )
     );
     $$
   );
   ```

### 5. Configure Next.js Image Domain (Optional)

If you're using external images, update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['source.unsplash.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables:
   - Go to your project on [vercel.com](https://vercel.com)
   - Navigate to **Settings** → **Environment Variables**
   - Add all variables from your `.env.local` file

### Option 2: Deploy via GitHub

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS`

4. Click **Deploy**

## 📁 Project Structure

```
├── app/
│   ├── admin/           # Admin panel page
│   ├── softwarehouse/   # Software house dashboard
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── JobCard.tsx      # Job listing card component
│   └── SearchBar.tsx    # Search and filter component
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── supabase/
│   ├── schema.sql       # Database schema
│   ├── seed.sql         # Sample data
│   └── functions/
│       └── expire-jobs/ # Edge function for auto-expiring jobs
├── types/
│   └── database.ts      # TypeScript types
└── README.md
```

## 🗄️ Database Schema

### `software_houses`
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `phone` (VARCHAR)
- `display_phone` (VARCHAR)
- `website` (VARCHAR)
- `status` (pending | approved | rejected)
- `created_at` (TIMESTAMP)

### `job_posts`
- `id` (UUID, Primary Key)
- `software_house_id` (UUID, Foreign Key)
- `title` (VARCHAR)
- `image_url` (TEXT)
- `youtube_url` (TEXT, nullable)
- `contact_info` (VARCHAR)
- `status` (active | expired | hidden)
- `created_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)

## 🎨 Design

- **Primary Colors**: Blue (#1D4ED8), Orange (#F97316)
- **Gradient Background**: White to light blue
- **Fonts**: Inter / Poppins
- **Components**: Rounded cards with hover effects, responsive grid layout

## 🔐 Security Notes

- The Supabase service role key should **NEVER** be exposed to the client
- Row Level Security (RLS) is enabled on all tables
- In production, implement proper authentication for admin and software house dashboards

## 🐛 Troubleshooting

### Images not loading
- Check if the image URLs are valid
- Update `next.config.js` with the image domains you're using

### Supabase connection errors
- Verify your environment variables are set correctly
- Check that your Supabase project is active
- Ensure RLS policies allow the operations you need

### Edge function not working
- Verify the function is deployed correctly
- Check the function logs in Supabase Dashboard
- Ensure the cron job is properly configured

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and Supabase
