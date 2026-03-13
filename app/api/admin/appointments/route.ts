import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients!inner(
          patient_id,
          users!inner(name, email, phone)
        ),
        doctors!inner(
          users!inner(name),
          specialization
        )
      `)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (error) throw error

    const formattedAppointments = appointments?.map(apt => ({
      id: apt.id,
      patient: apt.patients.users.name,
      patientId: apt.patients.patient_id,
      doctor: apt.doctors.users.name,
      specialty: apt.doctors.specialization,
      date: apt.appointment_date,
      time: apt.appointment_time,
      duration: `${apt.duration} min`,
      type: apt.appointment_type,
      condition: apt.condition || apt.reason,
      status: apt.status,
      notes: apt.notes,
      phone: apt.patients.users.phone,
      email: apt.patients.users.email,
      location: apt.location
    })) || []

    return NextResponse.json({ appointments: formattedAppointments })

  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { doctorId, patientId, appointmentDate, appointmentTime, duration, appointmentType, condition, notes } = await request.json()

    if (!doctorId || !patientId || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get admin user ID (assuming first admin user for requested_by)
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single()

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        doctor_id: doctorId,
        patient_id: patientId,
        requested_by: adminUser?.id || doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        duration: parseInt(duration) || 30,
        appointment_type: appointmentType || 'consultation',
        condition: condition || '',
        reason: condition || '',
        notes: notes || '',
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ appointment, message: 'Appointment scheduled successfully' })

  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}