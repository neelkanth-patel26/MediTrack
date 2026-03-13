# MediTrack+ Supabase Setup Guide

## Overview
MediTrack+ is now integrated with Supabase for real authentication and database management. This guide walks you through setting up and using the application.

## Prerequisites
- Supabase project created at [supabase.com](https://supabase.com)
- Environment variables configured in your Vercel project

## Environment Variables Required

Add these to your Vercel project's environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

You can find these in your Supabase project settings under "API" section.

## Database Schema

The following tables have been created in your Supabase database:

### Tables
1. **users** - Main user profiles
   - id (UUID, primary key, references auth.users)
   - name (TEXT)
   - email (TEXT, unique)
   - role (TEXT: admin, doctor, patient)
   - specialization (TEXT, optional)
   - created_at, updated_at (TIMESTAMP)

2. **patients** - Patient-specific data
   - id (UUID, primary key)
   - user_id (UUID, foreign key to users)
   - date_of_birth (DATE)
   - blood_type (TEXT)
   - allergies (TEXT)
   - medical_history (TEXT)
   - created_at, updated_at (TIMESTAMP)

3. **doctors** - Doctor-specific data
   - id (UUID, primary key)
   - user_id (UUID, foreign key to users)
   - license_number (TEXT, unique)
   - specialization (TEXT)
   - bio (TEXT)
   - availability (TEXT)
   - created_at, updated_at (TIMESTAMP)

4. **prescriptions** - Medicine prescriptions
   - id (UUID, primary key)
   - doctor_id, patient_id (foreign keys)
   - medication_name, dosage, frequency, duration (TEXT)
   - notes (TEXT)
   - issued_at, created_at (TIMESTAMP)

5. **vitals** - Patient vital signs
   - id (UUID, primary key)
   - patient_id (UUID, foreign key)
   - blood_pressure, heart_rate, temperature, weight, height
   - recorded_at, created_at (TIMESTAMP)

6. **messages** - Doctor-patient communication
   - id (UUID, primary key)
   - sender_id, recipient_id (foreign keys to users)
   - content (TEXT)
   - read (BOOLEAN)
   - created_at (TIMESTAMP)

7. **appointments** - Medical appointments
   - id (UUID, primary key)
   - doctor_id, patient_id (foreign keys)
   - scheduled_at (TIMESTAMP)
   - status (scheduled, completed, cancelled)
   - notes (TEXT)
   - created_at (TIMESTAMP)

8. **lab_reports** - Laboratory test reports
   - id (UUID, primary key)
   - patient_id, doctor_id (foreign keys)
   - report_type (TEXT)
   - report_data (JSONB)
   - status (pending, completed, reviewed)
   - created_at, updated_at (TIMESTAMP)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:
- Users can only view/update their own profiles
- Patients can see their own data
- Doctors can see their patients' data
- Users can only view their own messages
- Doctors can only see their prescriptions

## Getting Started

### Step 1: Ensure Environment Variables Are Set
Make sure your Supabase URL and anon key are in Vercel environment variables.

### Step 2: Create Demo Users
1. Visit `/setup` page in your application
2. Click "Create Demo Users" button
3. This will create three demo accounts:
   - **Patient**: patient@meditrack.com / patient123
   - **Doctor**: dr.smith@meditrack.com / doctor123
   - **Admin**: admin@meditrack.com / admin123

### Step 3: Login
1. Go to `/login` page
2. Click on one of the demo account buttons or enter credentials manually
3. You'll be redirected to the respective dashboard

## Demo Credentials

After setup, use these to test:

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@meditrack.com | patient123 |
| Doctor | dr.smith@meditrack.com | doctor123 |
| Admin | admin@meditrack.com | admin123 |

## Features Integrated

✅ **Authentication**
- Supabase Auth (email/password)
- Mock authentication fallback for development
- Session persistence

✅ **User Management**
- Multi-role support (Patient, Doctor, Admin)
- Profile management per role
- Specialization for doctors

✅ **Patient Features**
- Health dashboard
- Vitals tracking
- Prescription management
- Lab reports
- Doctor messaging
- Appointment scheduling

✅ **Doctor Features**
- Patient management
- Diagnosis assistant
- Prescription issuance
- Report management
- Patient messaging
- Appointment management

✅ **Admin Features**
- User management (doctors & patients)
- Activity logging
- System announcements
- Analytics & reports

## Troubleshooting

### "Invalid credentials" error
- Make sure demo users have been created via `/setup` page
- Check that your Supabase connection is working
- Verify environment variables are correctly set

### Cannot create demo users
- Ensure Supabase environment variables are in place
- Check browser console for specific error messages
- Verify Supabase project is active and accessible

### RLS preventing data access
- Make sure you're logged in with the correct user
- Check RLS policies in Supabase dashboard
- Verify user has appropriate permissions

## Additional Notes

- The application falls back to mock authentication if Supabase connection fails, allowing for local testing
- All sensitive operations use server-side authentication
- Dark mode is fully supported throughout the application
- The UI is responsive and mobile-friendly

## Support

For Supabase-specific issues, visit [Supabase Documentation](https://supabase.com/docs)
For MediTrack+ issues, check the application logs and error messages
