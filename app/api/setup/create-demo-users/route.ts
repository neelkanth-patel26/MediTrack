import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Demo users to create
const DEMO_USERS = [
  {
    email: 'patient@meditrack.com',
    password: 'patient123',
    name: 'John Patient',
    role: 'patient' as const,
  },
  {
    email: 'dr.smith@meditrack.com',
    password: 'doctor123',
    name: 'Dr. Smith',
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

export async function POST() {
  try {
    // Check if service role key is available
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase service role key not configured. Please set SUPABASE_SERVICE_ROLE_KEY in environment variables.' },
        { status: 500 }
      )
    }

    // Create admin client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })

    console.log('[v0] Starting demo user setup with admin client')

    const results = {
      success: [],
      errors: [],
    }

    for (const user of DEMO_USERS) {
      try {
        console.log(`[v0] Creating user: ${user.email}`)

        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        })

        if (authError) {
          console.error(`[v0] Auth error for ${user.email}:`, authError)
          results.errors.push({
            email: user.email,
            error: authError.message,
          })
          continue
        }

        if (!authData.user) {
          results.errors.push({
            email: user.email,
            error: 'No user returned from auth creation',
          })
          continue
        }

        console.log(`[v0] Auth user created: ${authData.user.id}`)

        // Create user profile (using admin client to bypass RLS)
        const { error: profileError } = await supabaseAdmin
          .from('users')
          .insert([
            {
              id: authData.user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              specialization: user.specialization || null,
            },
          ])

        if (profileError) {
          console.error(`[v0] Profile error for ${user.email}:`, profileError)
          results.errors.push({
            email: user.email,
            error: `Profile creation failed: ${profileError.message}`,
          })
          continue
        }

        console.log(`[v0] User profile created for ${user.email}`)

        // Create doctor profile if role is doctor
        if (user.role === 'doctor') {
          const { error: doctorError } = await supabaseAdmin
            .from('doctors')
            .insert([
              {
                user_id: authData.user.id,
                license_number: `LIC-2024-${Math.random().toString().slice(2, 6)}`,
                specialization: user.specialization,
              },
            ])

          if (doctorError) {
            console.error(`[v0] Doctor profile error for ${user.email}:`, doctorError)
            results.errors.push({
              email: user.email,
              error: `Doctor profile creation failed: ${doctorError.message}`,
            })
          } else {
            console.log(`[v0] Doctor profile created for ${user.email}`)
          }
        }

        // Create patient profile if role is patient
        if (user.role === 'patient') {
          const { error: patientError } = await supabaseAdmin
            .from('patients')
            .insert([
              {
                user_id: authData.user.id,
                blood_type: 'O+',
              },
            ])

          if (patientError) {
            console.error(`[v0] Patient profile error for ${user.email}:`, patientError)
            results.errors.push({
              email: user.email,
              error: `Patient profile creation failed: ${patientError.message}`,
            })
          } else {
            console.log(`[v0] Patient profile created for ${user.email}`)
          }
        }

        results.success.push(user.email)
        console.log(`[v0] Successfully created user: ${user.email}`)
      } catch (error) {
        console.error(`[v0] Unexpected error for ${user.email}:`, error)
        results.errors.push({
          email: user.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    console.log('[v0] Demo user setup complete', results)

    return NextResponse.json({
      message: 'Demo user setup completed',
      success: results.success,
      errors: results.errors,
    })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to setup demo users',
      },
      { status: 500 }
    )
  }
}
