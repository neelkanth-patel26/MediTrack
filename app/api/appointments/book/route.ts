import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received appointment booking request:', body)
    
    const { doctorId, patientId, appointmentDate, appointmentTime, appointmentType, condition, reason } = body

    if (!doctorId || !patientId || !appointmentDate || !appointmentTime) {
      console.log('Missing required fields:', { doctorId, patientId, appointmentDate, appointmentTime })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate date and time
    const now = new Date()
    const selectedDate = new Date(appointmentDate)
    const [hours, minutes] = appointmentTime.split(':').map(Number)
    selectedDate.setHours(hours, minutes, 0, 0)

    // Check if date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDateOnly = new Date(appointmentDate)
    selectedDateOnly.setHours(0, 0, 0, 0)
    
    if (selectedDateOnly < today) {
      return NextResponse.json({ error: 'Cannot book appointments in the past' }, { status: 400 })
    }

    // Check if same day and less than 3 hours in advance
    if (selectedDateOnly.getTime() === today.getTime()) {
      const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000)
      if (selectedDate < threeHoursFromNow) {
        return NextResponse.json({ 
          error: 'Same-day appointments must be booked at least 3 hours in advance' 
        }, { status: 400 })
      }
    }

    console.log('Looking up doctor with user_id:', doctorId)
    // Get doctor's internal ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) {
      console.error('Doctor lookup error:', doctorError)
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }
    console.log('Found doctor:', doctorData)

    console.log('Looking up patient with user_id:', patientId)
    // Get patient's internal ID, create if doesn't exist
    let { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', patientId)
      .single()

    if (patientError && patientError.code === 'PGRST116') {
      console.log('Patient not found, creating new patient record')
      // Patient doesn't exist, create one
      const { data: newPatientData, error: createPatientError } = await supabase
        .from('patients')
        .insert({
          user_id: patientId
        })
        .select('id')
        .single()
      
      if (createPatientError) {
        console.error('Failed to create patient:', createPatientError)
        return NextResponse.json({ error: 'Failed to create patient record' }, { status: 500 })
      }
      patientData = newPatientData
    } else if (patientError) {
      console.error('Patient lookup error:', patientError)
      return NextResponse.json({ error: 'Patient lookup failed' }, { status: 404 })
    }
    console.log('Found/created patient:', patientData)

    // Check for appointment conflicts (3-hour gap)
    const { data: existingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('patient_id', patientData.id)
      .eq('appointment_date', appointmentDate)
      .neq('status', 'cancelled')

    if (!appointmentsError && existingAppointments && existingAppointments.length > 0) {
      const [newHours, newMinutes] = appointmentTime.split(':').map(Number)
      const newDateTime = new Date(appointmentDate)
      newDateTime.setHours(newHours, newMinutes, 0, 0)

      for (const apt of existingAppointments) {
        const aptTime = apt.appointment_time.split(':').map(Number)
        const aptDateTime = new Date(appointmentDate)
        aptDateTime.setHours(aptTime[0], aptTime[1], 0, 0)
        
        const timeDiffMs = Math.abs(newDateTime.getTime() - aptDateTime.getTime())
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60)
        
        if (timeDiffHours < 3) {
          return NextResponse.json({ 
            error: `You have another appointment at ${apt.appointment_time.slice(0,5)}. Please maintain at least 3 hours gap between appointments.` 
          }, { status: 400 })
        }
      }
    }

    const appointmentData = {
      doctor_id: doctorData.id,
      patient_id: patientData.id,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      appointment_type: appointmentType || 'consultation',
      condition,
      reason,
      status: 'pending'
    }
    console.log('Creating appointment with data:', appointmentData)

    // Create appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()

    if (error) {
      console.error('Appointment creation error:', error)
      return NextResponse.json({ error: 'Failed to create appointment: ' + error.message }, { status: 500 })
    }

    console.log('Appointment created successfully:', data)
    return NextResponse.json({ 
      message: 'Appointment booked successfully',
      appointment: data[0]
    })

  } catch (error) {
    console.error('Error booking appointment:', error)
    return NextResponse.json({ error: 'Failed to book appointment: ' + (error as Error).message }, { status: 500 })
  }
}