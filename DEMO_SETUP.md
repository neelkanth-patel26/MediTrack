# MediTrack+ Demo User Setup Guide

## Overview
The MediTrack+ application uses Supabase for authentication and data storage. To create demo users for testing, you need to configure the Supabase service role key.

## Why Service Role Key?
The Supabase tables have Row Level Security (RLS) policies enabled to protect user data. Client-side operations cannot bypass these policies. The service role key allows server-side operations to bypass RLS, which is necessary for creating initial demo accounts.

## Setup Instructions

### 1. Get Your Supabase Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API** (in the left sidebar)
4. Copy the **Service Role Secret Key** (⚠️ Keep this secret - never expose it in client code)

### 2. Add to Vercel Environment Variables

1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Paste the service role key from step 1
   - **Environments:** Select all environments (Production, Preview, Development)

4. Redeploy your application for changes to take effect

### 3. Create Demo Users

1. Visit the `/setup` page in your application
2. You'll see instructions and a list of demo accounts to be created
3. Click "Create Demo Users" button
4. Wait for the setup to complete
5. You'll see success messages for each created user

### Demo Accounts

After successful setup, you can login with these credentials:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| patient@meditrack.com | patient123 | Patient | Test patient dashboard, health tracking |
| dr.smith@meditrack.com | doctor123 | Doctor | Test doctor dashboard, patient management |
| admin@meditrack.com | admin123 | Admin | Test admin dashboard, system management |

## Troubleshooting

### "Supabase service role key not configured"
- Make sure you've added `SUPABASE_SERVICE_ROLE_KEY` to your Vercel environment variables
- Wait for the deployment to complete after adding the variable
- The environment variable must be accessible on the server side (it's not prefixed with `NEXT_PUBLIC_`)

### "Email rate limit exceeded"
- Supabase limits rapid account creation via Auth API
- Wait a few minutes and try again
- Or create users manually in Supabase Auth dashboard

### "Row level security policy violation"
- This should not occur with the service role key
- Verify the key is correctly set in environment variables
- Check Supabase RLS policies allow inserts for the admin user

## Security Notes

- ⚠️ **Never commit the service role key to version control**
- Never expose it in client-side code (it's server-side only)
- Consider disabling demo user setup in production
- Regularly rotate your Supabase keys

## Data Initialization

When new demo users are created, the following data is set up:
- Auth user account (email + password)
- User profile in the `users` table
- Role-specific profiles (`doctor` or `patient` tables)
- Initial data for demo functionality

Demo accounts will not be automatically deleted, allowing for persistent testing.
