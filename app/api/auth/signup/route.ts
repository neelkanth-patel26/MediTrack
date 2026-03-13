import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, specialization } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ success: false, message: 'Database not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      return NextResponse.json({ success: false, message: authError.message })
    }

    if (!authData.user) {
      return NextResponse.json({ success: false, message: 'Failed to create user' })
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        name,
        email,
        role,
        specialization: specialization || null
      }])

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return NextResponse.json({ success: false, message: 'Failed to create profile' })
    }

    // Create role-specific record
    if (role === 'patient') {
      // Generate unique patient ID
      const { data: lastPatient } = await supabase
        .from('patients')
        .select('patient_id')
        .order('created_at', { ascending: false })
        .limit(1)

      const lastId = lastPatient?.[0]?.patient_id || 'P000'
      const nextPatientId = `P${String(parseInt(lastId.slice(1)) + 1).padStart(3, '0')}`

      const { error: patientError } = await supabase
        .from('patients')
        .insert([{
          user_id: authData.user.id,
          patient_id: nextPatientId
        }])

      if (patientError) {
        console.error('Patient creation error:', patientError)
      }
    } else if (role === 'doctor') {
      // Generate unique doctor ID
      const { data: lastDoctor } = await supabase
        .from('doctors')
        .select('doctor_id')
        .order('created_at', { ascending: false })
        .limit(1)

      const lastId = lastDoctor?.[0]?.doctor_id || 'D000'
      const nextDoctorId = `D${String(parseInt(lastId.slice(1)) + 1).padStart(3, '0')}`

      const { error: doctorError } = await supabase
        .from('doctors')
        .insert([{
          user_id: authData.user.id,
          doctor_id: nextDoctorId,
          specialization: specialization || null,
          bio: `${specialization || 'General'} practitioner`,
          availability: 'Mon-Fri 9AM-5PM',
          consultation_fee: 150.00,
          years_experience: 1
        }])

      if (doctorError) {
        console.error('Doctor creation error:', doctorError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: authData.user.id,
        name,
        email,
        role,
        specialization
      }
    })
  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' })
  }
}