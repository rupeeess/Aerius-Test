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

-- Enable Row Level Security (optional, recommended for production)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role to do everything (your backend uses service/anon key)
CREATE POLICY "Enable all access for service role" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
