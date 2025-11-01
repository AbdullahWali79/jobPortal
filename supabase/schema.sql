-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Software Houses Table
CREATE TABLE IF NOT EXISTS software_houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  display_phone VARCHAR(50) NOT NULL,
  website VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Posts Table
CREATE TABLE IF NOT EXISTS job_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  software_house_id UUID NOT NULL REFERENCES software_houses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  youtube_url TEXT,
  contact_info VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'hidden')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_software_houses_status ON software_houses(status);
CREATE INDEX IF NOT EXISTS idx_job_posts_software_house_id ON job_posts(software_house_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_status ON job_posts(status);
CREATE INDEX IF NOT EXISTS idx_job_posts_expires_at ON job_posts(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE software_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;

-- Policies for software_houses (allow public read for approved houses, insert for registration)
CREATE POLICY "Allow public read for approved houses" ON software_houses
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow public insert for registration" ON software_houses
  FOR INSERT WITH CHECK (true);

-- Policies for job_posts (allow public read for active, non-expired jobs)
CREATE POLICY "Allow public read for active jobs" ON job_posts
  FOR SELECT USING (status = 'active' AND expires_at > NOW());

-- Allow software houses to insert their own job posts (in a real app, you'd use auth)
CREATE POLICY "Allow job post insert" ON job_posts
  FOR INSERT WITH CHECK (true);

-- Allow software houses to update their own job posts
CREATE POLICY "Allow job post update" ON job_posts
  FOR UPDATE USING (true);

-- Allow software houses to delete their own job posts
CREATE POLICY "Allow job post delete" ON job_posts
  FOR DELETE USING (true);

