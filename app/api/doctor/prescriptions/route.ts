import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createNotification } from '@/lib/notifications'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorUserId = searchParams.get('doctorId')

    if (!doctorUserId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 })
    }

    // Get the doctor record from the user ID
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorUserId)
      .single()

    if (doctorError || !doctor) {
      return NextResponse.json({ prescriptions: [] })
    }

    const { data: prescriptions, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patients!inner(
          patient_id,
          users!inner(name)
        )
      `)
      .eq('doctor_id', doctor.id)
      .order('issued_at', { ascending: false })

    if (error) throw error

    const formattedPrescriptions = prescriptions?.map(prescription => ({
      id: prescription.id,
      patientName: prescription.patients.users.name,
      patientId: prescription.patients.patient_id,
      medicationName: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions,
      refills: prescription.refills,
      status: prescription.status,
      issuedAt: prescription.issued_at
    })) || []

    return NextResponse.json({ prescriptions: formattedPrescriptions })

  } catch (error) {
    console.error('Error fetching prescriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorId, patientId, medicationName, dosage, frequency, duration, instructions, refills } = body

    // Get the doctor record from the user ID
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError || !doctor) {
      console.error('Doctor not found:', doctorError)
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        doctor_id: doctor.id,
        patient_id: patientId,
        medication_name: medicationName,
        dosage,
        frequency,
        duration,
        instructions,
        refills: refills || 0,
        status: 'active'
      })
      .select()

    if (error) throw error

    // Get patient info for notification
    const { data: patient } = await supabase
      .from('patients')
      .select('users!inner(id, name)')
      .eq('id', patientId)
      .single()

    // Send notification to patient
    if (patient?.users) {
      await createNotification({
        userId: patient.users.id,
        title: 'New Prescription Issued',
        message: `Dr. has prescribed ${medicationName} for you`,
        type: 'prescription',
        priority: 'medium',
        entityType: 'prescription',
        entityId: data[0].id,
        actionUrl: '/patient/prescriptions'
      })
    }

    return NextResponse.json({ 
      message: 'Prescription created successfully',
      prescription: data[0]
    })

  } catch (error) {
    console.error('Error creating prescription:', error)
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 })
  }
}