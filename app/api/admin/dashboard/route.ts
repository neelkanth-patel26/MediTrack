import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get active doctors count
    const { count: activeDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true })

    // Get today's appointments
    const today = new Date().toISOString().split('T')[0]
    const { data: todayAppointments, count: todayAppointmentsCount } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_time,
        status,
        appointment_type,
        patients!inner(users!inner(name)),
        doctors!inner(users!inner(name), specialization)
      `, { count: 'exact' })
      .eq('appointment_date', today)
      .order('appointment_time', { ascending: true })

    // Get system alerts
    const { data: systemAlerts, count: systemAlertsCount } = await supabase
      .from('system_alerts')
      .select('*', { count: 'exact' })
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get recent activity from activity_logs
    const { data: recentActivity } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        entity_type,
        created_at,
        users!inner(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get all appointments for revenue calculation
    const { data: allAppointments } = await supabase
      .from('appointments')
      .select(`
        id,
        status,
        doctors!inner(consultation_fee)
      `)
      .eq('status', 'completed')

    // Calculate total revenue and earnings
    const totalRevenue = allAppointments?.reduce((sum, apt) => sum + (apt.doctors?.consultation_fee || 0), 0) || 0
    const totalDoctorEarnings = totalRevenue * 0.8
    const totalAdminCut = totalRevenue * 0.2

    // Get total patients count
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })

    // Format appointments data
    const formattedAppointments = todayAppointments?.map(apt => ({
      id: apt.id,
      patient: apt.patients?.users?.name || 'Unknown Patient',
      doctor: apt.doctors?.users?.name || 'Unknown Doctor',
      specialty: apt.doctors?.specialization || 'General',
      time: apt.appointment_time,
      status: apt.status,
      type: apt.appointment_type
    })) || []

    // Format recent activity
    const formattedActivity = recentActivity?.map(activity => ({
      user: activity.users?.name || 'Unknown User',
      action: activity.action,
      time: new Date(activity.created_at).toLocaleString(),
      status: activity.entity_type === 'appointment' ? 'info' : 'success'
    })) || []

    // Format system alerts
    const formattedAlerts = systemAlerts?.map(alert => ({
      id: alert.id,
      type: alert.alert_type,
      message: alert.message,
      severity: alert.severity,
      time: new Date(alert.created_at).toLocaleString()
    })) || []

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeDoctors: activeDoctors || 0,
        todayAppointments: todayAppointmentsCount || 0,
        systemAlerts: systemAlertsCount || 0,
        totalPatients: totalPatients || 0,
        totalRevenue: Math.round(totalRevenue),
        totalDoctorEarnings: Math.round(totalDoctorEarnings),
        totalAdminCut: Math.round(totalAdminCut),
        completedAppointments: allAppointments?.length || 0
      },
      appointments: formattedAppointments,
      recentActivity: formattedActivity,
      systemAlerts: formattedAlerts
    })

  } catch (error) {
    console.error('Error fetching admin dashboard data:', error)
    return NextResponse.json({
      stats: {
        totalUsers: 0,
        activeDoctors: 0,
        todayAppointments: 0,
        systemAlerts: 0,
        totalPatients: 0,
        totalRevenue: 0,
        totalDoctorEarnings: 0,
        totalAdminCut: 0,
        completedAppointments: 0
      },
      appointments: [],
      recentActivity: [],
      systemAlerts: []
    })
  }
}