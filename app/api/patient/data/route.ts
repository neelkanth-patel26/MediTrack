import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if user is demo user
    const isDemoUser = searchParams.get('isDemoUser') === 'true'
    
    if (isDemoUser) {
      // Return demo data
      return NextResponse.json({
        prescriptions: [
          { id: '1', medication_name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', status: 'active', refills: 2, issued_at: '2024-01-15T00:00:00Z' },
          { id: '2', medication_name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'active', refills: 1, issued_at: '2024-01-08T00:00:00Z' }
        ],
        appointments: [
          { id: '1', appointment_type: 'Cardiology Check-up', doctor_name: 'Dr. Urmi Thakkar', appointment_date: '2024-01-20', appointment_time: '10:30:00', status: 'confirmed' },
          { id: '2', appointment_type: 'Lab Tests', doctor_name: 'Dr. Rajesh Kumar', appointment_date: '2024-01-22', appointment_time: '14:00:00', status: 'pending' }
        ],
        vitals: [
          { id: '1', blood_pressure_systolic: 120, blood_pressure_diastolic: 80, heart_rate: 72, temperature: 36.5, weight: 70.2, recorded_at: '2024-01-18T00:00:00Z' }
        ]
      })
    }

    // Get patient ID from user
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!patient) {
      return NextResponse.json({ prescriptions: [], appointments: [], vitals: [] })
    }

    // Fetch prescriptions
    const { data: prescriptions } = await supabase
      .from('prescriptions')
      .select(`
        id, medication_name, dosage, frequency, status, refills, issued_at,
        doctors!inner(users!inner(name))
      `)
      .eq('patient_id', patient.id)
      .order('issued_at', { ascending: false })

    // Fetch appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select(`
        id, appointment_type, appointment_date, appointment_time, status,
        doctors!inner(users!inner(name))
      `)
      .eq('patient_id', patient.id)
      .neq('status', 'cancelled')
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .order('appointment_date', { ascending: true })

    // Transform appointments to include doctor_name
    const transformedAppointments = appointments?.map(apt => ({
      ...apt,
      doctor_name: apt.doctors?.users?.name || 'Unknown Doctor'
    })) || []

    // Fetch vitals
    const { data: vitals } = await supabase
      .from('vitals')
      .select('id, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, temperature, weight, recorded_at')
      .eq('patient_id', patient.id)
      .order('recorded_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      prescriptions: prescriptions || [],
      appointments: transformedAppointments,
      vitals: vitals || []
    })
  } catch (error) {
    console.error('Patient data fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch patient data' }, { status: 500 })
  }
}