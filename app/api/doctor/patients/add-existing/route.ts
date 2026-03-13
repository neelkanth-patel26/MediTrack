import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, doctorId } = body

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get doctor's internal ID
    const { data: doctorData } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (!doctorData) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    // Check if user exists
    const { data: userData } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', patientId)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if patient record exists, create if not
    let { data: patientData } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', patientId)
      .single()

    if (!patientData) {
      // Create patient record
      const { data: newPatient, error: createError } = await supabase
        .from('patients')
        .insert({
          user_id: patientId,
          patient_id: `P${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
        })
        .select('id')
        .single()

      if (createError) {
        console.error('Error creating patient:', createError)
        return NextResponse.json({ error: 'Failed to create patient record' }, { status: 500 })
      }
      
      patientData = newPatient
    }

    // Check if already linked
    const { data: existing } = await supabase
      .from('doctor_patients')
      .select('id')
      .eq('doctor_id', doctorData.id)
      .eq('patient_id', patientData.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Patient already in your list' }, { status: 400 })
    }

    // Link patient to doctor
    const { error } = await supabase
      .from('doctor_patients')
      .insert({
        doctor_id: doctorData.id,
        patient_id: patientData.id
      })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to add patient' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Patient added successfully' })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}