import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    const now = new Date()
    let startDate = new Date()
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const [doctorsRes, patientsRes, appointmentsRes, diagnosesRes, prescriptionsRes, alertsRes] = await Promise.all([
      supabase.from('doctors').select('*', { count: 'exact' }),
      supabase.from('patients').select('*', { count: 'exact' }),
      supabase.from('appointments').select('*', { count: 'exact' }).gte('created_at', startDate.toISOString()),
      supabase.from('ai_diagnoses').select('*', { count: 'exact' }).gte('created_at', startDate.toISOString()),
      supabase.from('prescriptions').select('*', { count: 'exact' }).gte('created_at', startDate.toISOString()),
      supabase.from('system_alerts').select('*', { count: 'exact' }).eq('is_active', true)
    ])

    const { data: usersData } = await supabase
      .from('users')
      .select('role, created_at')
      .gte('created_at', new Date(now.getFullYear(), 0, 1).toISOString())
      .order('created_at', { ascending: true })

    const monthlyGrowth: any = {}
    usersData?.forEach(user => {
      const month = new Date(user.created_at).toLocaleString('default', { month: 'short' })
      if (!monthlyGrowth[month]) {
        monthlyGrowth[month] = { month, doctors: 0, patients: 0 }
      }
      if (user.role === 'doctor') monthlyGrowth[month].doctors++
      if (user.role === 'patient') monthlyGrowth[month].patients++
    })

    let doctorCount = 0, patientCount = 0
    const userGrowthData = Object.values(monthlyGrowth).map((m: any) => {
      doctorCount += m.doctors
      patientCount += m.patients
      return { month: m.month, doctors: doctorCount, patients: patientCount }
    })

    const { data: activityLogs } = await supabase
      .from('activity_logs')
      .select('action, created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    const weeklyActivity: any = {}
    activityLogs?.forEach(log => {
      const weekNum = Math.floor((now.getTime() - new Date(log.created_at).getTime()) / (7 * 24 * 60 * 60 * 1000))
      const week = `Week ${4 - weekNum}`
      if (!weeklyActivity[week]) {
        weeklyActivity[week] = { week, logins: 0, diagnoses: 0, prescriptions: 0 }
      }
      if (log.action.includes('login')) weeklyActivity[week].logins++
      if (log.action.includes('diagnosis')) weeklyActivity[week].diagnoses++
      if (log.action.includes('prescription')) weeklyActivity[week].prescriptions++
    })

    const activityData = Object.values(weeklyActivity)

    const { data: diagnosesData } = await supabase
      .from('ai_diagnoses')
      .select('diagnosis')

    const diagnosisCounts: any = {}
    diagnosesData?.forEach(d => {
      if (d.diagnosis) {
        diagnosisCounts[d.diagnosis] = (diagnosisCounts[d.diagnosis] || 0) + 1
      }
    })

    const topDiagnoses = Object.entries(diagnosisCounts)
      .map(([diagnosis, count]) => ({ condition: diagnosis, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5)
      .map((item: any) => ({
        ...item,
        percentage: Math.round((item.count / (diagnosesData?.length || 1)) * 100)
      }))

    const { data: doctors } = await supabase
      .from('doctors')
      .select(`
        id,
        user_id,
        users!inner(full_name)
      `)

    const doctorPerformance = await Promise.all(
      (doctors || []).slice(0, 5).map(async (doctor) => {
        const [apptRes, patientRes, diagnosesRes] = await Promise.all([
          supabase.from('appointments').select('*', { count: 'exact' }).eq('doctor_id', doctor.user_id),
          supabase.from('appointments').select('patient_id').eq('doctor_id', doctor.user_id),
          supabase.from('ai_diagnoses').select('*').eq('doctor_id', doctor.user_id)
        ])

        const uniquePatients = new Set(patientRes.data?.map(a => a.patient_id)).size
        const totalDiagnoses = diagnosesRes.data?.length || 0

        // Calculate earnings from diagnoses
        const earnings = diagnosesRes.data?.reduce((sum, diag) => sum + (diag.consultation_fee || 0), 0) || 0

        return {
          name: doctor.users.full_name,
          patients: uniquePatients,
          appointments: apptRes.count || 0,
          diagnoses: totalDiagnoses,
          earnings: earnings
        }
      })
    )

    const { data: patientsData } = await supabase
      .from('patients')
      .select('date_of_birth, gender')

    const ageDistribution = { '18-30': 0, '31-45': 0, '46-60': 0, '60+': 0 }
    const genderDistribution = { male: 0, female: 0, other: 0 }

    patientsData?.forEach(patient => {
      const age = Math.floor((now.getTime() - new Date(patient.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      if (age >= 18 && age <= 30) ageDistribution['18-30']++
      else if (age >= 31 && age <= 45) ageDistribution['31-45']++
      else if (age >= 46 && age <= 60) ageDistribution['46-60']++
      else if (age > 60) ageDistribution['60+']++

      if (patient.gender) genderDistribution[patient.gender.toLowerCase() as keyof typeof genderDistribution]++
    })

    const totalPatients = patientsData?.length || 1
    const ageData = Object.entries(ageDistribution).map(([range, count]) => ({
      range,
      count,
      percentage: Math.round((count / totalPatients) * 100)
    }))

    const genderData = {
      female: { count: genderDistribution.female, percentage: Math.round((genderDistribution.female / totalPatients) * 100) },
      male: { count: genderDistribution.male, percentage: Math.round((genderDistribution.male / totalPatients) * 100) }
    }

    return NextResponse.json({
      stats: {
        totalUsers: (doctorsRes.count || 0) + (patientsRes.count || 0),
        totalDoctors: doctorsRes.count || 0,
        totalPatients: patientsRes.count || 0,
        appointments: appointmentsRes.count || 0,
        diagnoses: diagnosesRes.count || 0,
        prescriptions: prescriptionsRes.count || 0,
        criticalAlerts: alertsRes.count || 0
      },
      userGrowthData,
      activityData,
      topDiagnoses,
      doctorPerformance,
      demographics: {
        age: ageData,
        gender: genderData
      }
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
