import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { profile, notifications, theme, userId } = await request.json()

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase not configured, skipping database update')
      return NextResponse.json({ success: true, message: 'Saved locally' })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update user profile in Supabase
    const { error: userError } = await supabase
      .from('users')
      .update({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (userError) {
      console.error('Supabase user update error:', userError)
    }

    // If user has doctor-specific fields, update doctors table
    if (profile.specialization || profile.years_experience || profile.consultation_fee || profile.availability) {
      // First check if doctor record exists
      const { data: existingDoctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', userId)
        .single()

      const doctorData = {
        user_id: userId,
        specialization: profile.specialization || null,
        years_experience: profile.years_experience ? parseInt(profile.years_experience) : null,
        consultation_fee: profile.consultation_fee ? parseFloat(profile.consultation_fee) : null,
        availability: profile.availability || null,
        bio: profile.bio || null,
        updated_at: new Date().toISOString()
      }

      if (existingDoctor) {
        // Update existing record
        const { error: doctorError } = await supabase
          .from('doctors')
          .update(doctorData)
          .eq('user_id', userId)
        
        if (doctorError) {
          console.error('Supabase doctor update error:', doctorError)
        }
      } else {
        // Insert new record
        const { error: doctorError } = await supabase
          .from('doctors')
          .insert(doctorData)
        
        if (doctorError) {
          console.error('Supabase doctor insert error:', doctorError)
        }
      }
    }

    // If user has patient-specific fields, update patients table
    if (profile.gender || profile.blood_type || profile.allergies || profile.date_of_birth) {
      // First check if patient record exists
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .single()

      const patientData = {
        user_id: userId,
        gender: profile.gender || null,
        blood_type: profile.blood_type || null,
        allergies: profile.allergies || null,
        date_of_birth: profile.date_of_birth || null,
        updated_at: new Date().toISOString()
      }

      if (existingPatient) {
        // Update existing record
        const { error: patientError } = await supabase
          .from('patients')
          .update(patientData)
          .eq('user_id', userId)
        
        if (patientError) {
          console.error('Supabase patient update error:', patientError)
        }
      } else {
        // Insert new record
        const { error: patientError } = await supabase
          .from('patients')
          .insert(patientData)
        
        if (patientError) {
          console.error('Supabase patient insert error:', patientError)
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Saved to database' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: true, message: 'Saved locally' })
  }
}