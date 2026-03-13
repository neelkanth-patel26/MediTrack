import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get patient record
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (patientError || !patient) {
      return NextResponse.json({ prescriptions: [] })
    }

    // Get prescriptions with doctor information
    const { data: prescriptions, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctors!inner(
          user_id,
          users!inner(name, specialization)
        )
      `)
      .eq('patient_id', patient.id)
      .order('issued_at', { ascending: false })

    if (error) throw error

    const formattedPrescriptions = prescriptions?.map(prescription => ({
      id: prescription.id,
      medicationName: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions,
      refills: prescription.refills,
      status: prescription.status,
      issuedAt: prescription.issued_at,
      doctorName: prescription.doctors.users.name,
      doctorSpecialization: prescription.doctors.users.specialization
    })) || []

    return NextResponse.json({ prescriptions: formattedPrescriptions })

  } catch (error) {
    console.error('Error fetching prescriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 })
  }
}