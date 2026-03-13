import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select(`
        *,
        users!patients_user_id_fkey (
          id,
          name,
          email,
          phone,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const formattedPatients = patients.map(patient => ({
      id: patient.id,
      userId: patient.user_id,
      patientId: patient.patient_id,
      name: patient.users?.name || 'Unknown',
      email: patient.users?.email || 'N/A',
      phone: patient.users?.phone || 'N/A',
      dateOfBirth: patient.date_of_birth,
      gender: patient.gender,
      bloodType: patient.blood_type,
      allergies: patient.allergies,
      medicalHistory: patient.medical_history,
      emergencyContactName: patient.emergency_contact_name,
      emergencyContactPhone: patient.emergency_contact_phone,
      insuranceProvider: patient.insurance_provider,
      insuranceNumber: patient.insurance_number,
      address: patient.address,
      createdAt: patient.created_at
    }))

    return NextResponse.json({ patients: formattedPatients })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
}
