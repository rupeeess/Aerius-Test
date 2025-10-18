# ClickUp OAuth Authentication Application

## Overview
A fullstack JavaScript application that implements ClickUp OAuth 2.0 authentication and stores user profile data in a Supabase database. Users can log in with their ClickUp account and view their profile information.

## Recent Changes
- **October 18, 2025**: Initial implementation
  - Created data schema for user profiles with ClickUp OAuth data
  - Built login page with ClickUp OAuth button
  - Implemented profile dashboard showing user information
  - Created ClickUp OAuth flow (authorization and callback)
  - Integrated Supabase for data persistence
  - Added session management
  - Implemented dark/light theme toggle

## Tech Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS for styling
- Dark/Light theme support

### Backend
- Express.js
- ClickUp OAuth 2.0
- Supabase PostgreSQL database
- Express-session for session management
- Axios for API calls

## Project Architecture

### Database Schema
- **users** table:
  - `id` (UUID, primary key)
  - `clickup_id` (text, unique) - ClickUp user ID
  - `username` (text) - ClickUp username
  - `email` (text) - User email
  - `profile_picture` (text) - Profile picture URL
  - `access_token` (text) - OAuth access token
  - `user_data` (jsonb) - Full ClickUp user object
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

### API Routes
- `GET /api/auth/clickup` - Initiates OAuth flow
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/user/profile` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Pages
- `/` - Login page (redirects to /profile if authenticated)
- `/callback` - OAuth callback handler page
- `/profile` - User profile dashboard (protected)

## Environment Variables
- `CLICKUP_CLIENT_ID` - ClickUp OAuth app client ID
- `CLICKUP_CLIENT_SECRET` - ClickUp OAuth app client secret
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SESSION_SECRET` - Session encryption secret

## Design System
- **Primary Color**: ClickUp-inspired blue (HSL: 213 94% 68%)
- **Font**: Inter (primary), JetBrains Mono (monospace)
- **Theme**: Dark mode default with light mode support
- **Layout**: Card-based design with clean, tech-focused aesthetics

## User Preferences
None specified yet.

## Setup Instructions

### Database Setup
The Supabase database table needs to be created with the following SQL:

```sql
CREATE TABLE users (
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

CREATE INDEX idx_users_clickup_id ON users(clickup_id);
```

### ClickUp OAuth App Setup
1. Go to https://app.clickup.com/settings/apps
2. Create a new OAuth app
3. Set the redirect URI to match your deployment URL + `/api/auth/callback`
4. Copy the Client ID and Client Secret to Replit Secrets

## Features
- ✅ ClickUp OAuth 2.0 authentication
- ✅ User profile storage in Supabase
- ✅ Session management
- ✅ Profile dashboard with user information
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ Logout functionality
