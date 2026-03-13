// Demo user credentials (for reference)
export const DEMO_USERS = [
  {
    email: 'patient@meditrack.com',
    password: 'patient123',
    name: 'Nick Patel',
    role: 'patient' as const,
  },
  {
    email: 'dr.smith@meditrack.com',
    password: 'doctor123',
    name: 'Dr. Urmi Thakkar',
    role: 'doctor' as const,
    specialization: 'Cardiology',
  },
  {
    email: 'admin@meditrack.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
]

// Demo user creation is now handled via API route at /api/setup/create-demo-users
// This uses the Supabase service role key on the server side to bypass RLS policies
