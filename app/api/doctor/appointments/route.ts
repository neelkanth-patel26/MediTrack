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

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients!inner(
          patient_id,
          users!inner(name, email, phone)
        )
      `)
      .eq('doctor_id', doctorData.id)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (error) throw error

    const formattedAppointments = appointments?.map(apt => ({
      id: apt.id,
      patient: apt.patients.users.name,
      patientId: apt.patients.patient_id,
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, status, notes, doctorId } = body

    // Update appointment status
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select(`
        *,
        patients!inner(
          id,
          patient_id,
          user_id,
          users!inner(name, email, phone)
        )
      `)
      .single()

    if (appointmentError) throw appointmentError

    // If confirming appointment, add patient to doctor's patient list
    if (status === 'confirmed' && doctorId) {
      // Get doctor's internal ID
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', doctorId)
        .single()

      if (doctorError) throw doctorError

      // Check if patient is already in doctor's patient list
      const { data: existingRelation, error: checkError } = await supabase
        .from('doctor_patients')
        .select('id')
        .eq('doctor_id', doctorData.id)
        .eq('patient_id', appointmentData.patients.id)
        .single()

      // If not already in the list, add them
      if (checkError && checkError.code === 'PGRST116') { // No rows returned
        const { error: insertError } = await supabase
          .from('doctor_patients')
          .insert({
            doctor_id: doctorData.id,
            patient_id: appointmentData.patients.id,
            created_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error adding patient to doctor list:', insertError)
          // Don't fail the appointment update if this fails
        }
      }
    }

    return NextResponse.json({ 
      message: 'Appointment updated successfully',
      appointment: appointmentData
    })

  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}