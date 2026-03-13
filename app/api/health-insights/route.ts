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
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get patient ID
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!patient) {
      return NextResponse.json({ insights: [] })
    }

    const insights = []

    // Check recent vitals for blood pressure trends
    const { data: recentVitals } = await supabase
      .from('vitals')
      .select('*')
      .eq('patient_id', patient.id)
      .order('recorded_at', { ascending: false })
      .limit(5)

    if (recentVitals && recentVitals.length > 0) {
      const normalBP = recentVitals.filter(v => 
        v.blood_pressure_systolic <= 120 && v.blood_pressure_diastolic <= 80
      )
      
      if (normalBP.length >= 3) {
        insights.push({
          type: 'positive',
          title: 'Blood Pressure Stable',
          message: `Your blood pressure has been in normal range for ${normalBP.length} recent readings.`
        })
      }
    }

    // Check prescription adherence
    const { data: prescriptions } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patient.id)
      .eq('status', 'active')

    if (prescriptions && prescriptions.length > 0) {
      insights.push({
        type: 'info',
        title: 'Active Medications',
        message: `You have ${prescriptions.length} active prescription${prescriptions.length > 1 ? 's' : ''}. Remember to take them as prescribed.`
      })
    }

    // Check upcoming appointments
    const { data: upcomingAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patient.id)
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .order('appointment_date', { ascending: true })
      .limit(1)

    if (upcomingAppointments && upcomingAppointments.length > 0) {
      const nextAppt = upcomingAppointments[0]
      const apptDate = new Date(nextAppt.appointment_date)
      const daysDiff = Math.ceil((apptDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= 7) {
        insights.push({
          type: 'reminder',
          title: 'Upcoming Appointment',
          message: `You have an appointment scheduled in ${daysDiff} day${daysDiff > 1 ? 's' : ''}.`
        })
      }
    }

    return NextResponse.json({ insights })

  } catch (error) {
    console.error('Error fetching health insights:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}