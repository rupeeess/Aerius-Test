# Setup Instructions

## Quick Start Guide

### 1. Set Up Supabase Database

Go to your Supabase project SQL Editor and run this:

```sql
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

CREATE INDEX IF NOT EXISTS idx_users_clickup_id ON users(clickup_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow backend access" ON users
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
```

### 2. Configure ClickUp OAuth App

1. Go to https://app.clickup.com/settings/apps
2. Click "Create an App"
3. Set the **Redirect URL** to:
   - Development: `https://[your-replit-url]/api/auth/callback`
   - Production: `https://[your-domain]/api/auth/callback`
4. Copy the **Client ID** and **Client Secret**
5. These are already in your Replit Secrets ✓

### 3. Verify Environment Variables

All required secrets are already configured in Replit:
- ✓ CLICKUP_CLIENT_ID
- ✓ CLICKUP_CLIENT_SECRET
- ✓ SUPABASE_URL
- ✓ SUPABASE_ANON_KEY
- ✓ SESSION_SECRET

### 4. Start the Application

The app will automatically start once you've completed step 1 (database setup).

## Testing the Application

1. Open your Replit URL
2. Click "Continue with ClickUp"
3. Authorize the application in ClickUp
4. You'll be redirected to your profile page
5. View your account information
6. Test the theme toggle (moon/sun icon)
7. Click "Logout" to end your session

## Troubleshooting

**"Failed to create user" error:**
- Make sure you ran the SQL in Supabase
- Verify your SUPABASE_URL and SUPABASE_ANON_KEY are correct

**OAuth redirect fails:**
- Check that your ClickUp app's redirect URL matches your deployment URL
- Format: `https://[your-url]/api/auth/callback`

**Can't see profile after login:**
- Check browser console for errors
- Verify session cookies are enabled
