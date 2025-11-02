-- Fix RLS Policy to allow reading pending houses
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xwohxmigixrrlcpspsqs/sql

-- Drop existing policy if it exists (optional, won't error if doesn't exist)
DROP POLICY IF EXISTS "Allow public read for pending houses" ON software_houses;

-- Create new policy to allow reading pending/rejected houses
CREATE POLICY "Allow public read for pending houses" ON software_houses
  FOR SELECT USING (status IN ('pending', 'rejected'));

-- Allow admin to read ALL job posts (not just active ones)
DROP POLICY IF EXISTS "Allow public read for all jobs" ON job_posts;
CREATE POLICY "Allow public read for all jobs" ON job_posts
  FOR SELECT USING (true);

-- Verify the policies were created
SELECT * FROM pg_policies WHERE tablename = 'software_houses';
SELECT * FROM pg_policies WHERE tablename = 'job_posts';

