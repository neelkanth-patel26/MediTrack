import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 })
    }

    // Get doctor's internal ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    // Fetch patients linked to this doctor
    const { data: patients, error } = await supabase
      .from('doctor_patients')
      .select(`
        patients!inner(
          id,
          patient_id,
          date_of_birth,
          gender,
          blood_type,
          allergies,
          users!inner(id, name, email, phone)
        )
      `)
      .eq('doctor_id', doctorData.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const formattedPatients = patients?.map(dp => ({
      id: dp.patients.id, // Use actual patient record id
      userId: dp.patients.users.id,
      patientId: dp.patients.patient_id,
      name: dp.patients.users.name,
      email: dp.patients.users.email,
      phone: dp.patients.users.phone,
      dateOfBirth: dp.patients.date_of_birth,
      gender: dp.patients.gender,
      bloodType: dp.patients.blood_type,
      allergies: dp.patients.allergies
    })) || []

    return NextResponse.json({ patients: formattedPatients })

  } catch (error) {
    console.error('Error fetching doctor patients:', error)
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, dateOfBirth, gender, bloodType, allergies, doctorId } = body

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 })
    }

    // Get doctor's internal ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    // Create user first
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password: 'temp123!', // Temporary password
      email_confirm: true
    })

    if (userError) throw userError

    // Insert into users table
    const { error: userInsertError } = await supabase
      .from('users')
      .insert({
        id: userData.user.id,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        role: 'patient'
      })

    if (userInsertError) throw userInsertError

    // Generate patient ID
    const { data: lastPatient } = await supabase
      .from('patients')
      .select('patient_id')
      .order('created_at', { ascending: false })
      .limit(1)

    const lastId = lastPatient?.[0]?.patient_id || 'P000'
    const nextId = `P${String(parseInt(lastId.slice(1)) + 1).padStart(3, '0')}`

    // Insert into patients table
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .insert({
        user_id: userData.user.id,
        patient_id: nextId,
        date_of_birth: dateOfBirth,
        gender,
        blood_type: bloodType,
        allergies
      })
      .select()
      .single()

    if (patientError) throw patientError

    // Link patient to doctor
    const { error: linkError } = await supabase
      .from('doctor_patients')
      .insert({
        doctor_id: doctorData.id,
        patient_id: patientData.id,
        created_at: new Date().toISOString()
      })

    if (linkError) throw linkError

    return NextResponse.json({ 
      message: 'Patient created and linked successfully',
      patient: patientData
    })

  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
  }
}