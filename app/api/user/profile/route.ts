import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role, specialization, phone, avatar_url')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('User fetch error:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If user is a doctor, get additional doctor profile data
    if (user.role === 'doctor') {
      const { data: doctorProfile, error: doctorError } = await supabase
        .from('doctors')
        .select('specialization, years_experience, consultation_fee, availability, bio')
        .eq('user_id', userId)
        .single()

      if (!doctorError && doctorProfile) {
        // Merge doctor profile data with user data
        user.years_experience = doctorProfile.years_experience || 0
        user.consultation_fee = doctorProfile.consultation_fee || 0
        user.availability = doctorProfile.availability || ''
        user.bio = doctorProfile.bio || `Experienced ${doctorProfile.specialization || 'medical'} professional dedicated to providing quality healthcare.`
        // Override specialization from doctors table if available
        if (doctorProfile.specialization) {
          user.specialization = doctorProfile.specialization
        }
      } else {
        // Set default values if no doctor profile exists
        user.years_experience = 0
        user.consultation_fee = 0
        user.availability = ''
        user.bio = 'Experienced medical professional dedicated to providing quality healthcare.'
      }
    }

    // If user is a patient, get additional patient profile data
    if (user.role === 'patient') {
      const { data: patientProfile, error: patientError } = await supabase
        .from('patients')
        .select('gender, blood_type, allergies, date_of_birth')
        .eq('user_id', userId)
        .single()

      if (!patientError && patientProfile) {
        // Merge patient profile data with user data
        user.gender = patientProfile.gender || ''
        user.blood_type = patientProfile.blood_type || ''
        user.allergies = patientProfile.allergies || ''
        user.date_of_birth = patientProfile.date_of_birth || ''
      } else {
        // Set default values if no patient profile exists
        user.gender = ''
        user.blood_type = ''
        user.allergies = ''
        user.date_of_birth = ''
      }
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}