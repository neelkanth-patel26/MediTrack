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

    // Get doctor's internal ID and consultation fee
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id, consultation_fee')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    // Get total patients count
    const { count: totalPatients, error: patientsError } = await supabase
      .from('doctor_patients')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctorData.id)

    if (patientsError) throw patientsError

    // Get all appointments (excluding cancelled)
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorData.id)
      .neq('status', 'cancelled')

    if (appointmentsError) throw appointmentsError

    const totalAppointments = appointments?.length || 0
    const completedAppointments = appointments?.filter(apt => apt.status === 'completed').length || 0
    
    // Calculate revenue
    const consultationFee = doctorData.consultation_fee || 100 // Default fee if not set
    const totalRevenue = completedAppointments * consultationFee
    const adminCut = totalRevenue * 0.20 // 20% for admin
    const doctorEarnings = totalRevenue - adminCut

    return NextResponse.json({
      totalPatients: totalPatients || 0,
      totalAppointments,
      completedAppointments,
      totalRevenue,
      doctorEarnings,
      adminCut,
      consultationFee
    })

  } catch (error) {
    console.error('Error fetching doctor stats:', error)
    return NextResponse.json({ error: 'Failed to fetch doctor stats' }, { status: 500 })
  }
}