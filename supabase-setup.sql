-- ClickUp OAuth User Profiles Table
-- Run this SQL in your Supabase SQL Editor to create the database schema

-- Drop existing table if you need to recreate it (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User Info
  clickup_user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  profile_picture TEXT,

  -- Authentication (access_token should be encrypted in production!)
  access_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMP,
  scopes_granted TEXT[], -- Array of granted scopes

  -- Primary Team/Workspace Info
  team_id TEXT,
  team_name TEXT,

  -- All Authorized Workspaces
  authorized_workspaces JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{"team_id": "123", "team_name": "My Team", "authorized_at": "timestamp"}]

  -- Full ClickUp user data (for reference)
  user_data JSONB,

  -- Metadata
  authorization_date TIMESTAMP DEFAULT NOW() NOT NULL,
  last_sync TIMESTAMP DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_clickup_user_id ON users(clickup_user_id);
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow backend access" ON users;

-- Create a policy that allows the anon key (used by backend) to access all rows
-- This is safe because your backend is the only thing using the anon key
CREATE POLICY "Allow backend access" ON users
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
