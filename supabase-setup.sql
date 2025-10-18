-- ClickUp OAuth User Profiles Table
-- Run this SQL in your Supabase SQL Editor to create the database schema

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clickup_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  profile_picture TEXT,
  access_token TEXT NOT NULL,
  user_data JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_clickup_id ON users(clickup_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows the anon key (used by backend) to access all rows
-- This is safe because your backend is the only thing using the anon key
CREATE POLICY "Allow backend access" ON users
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
