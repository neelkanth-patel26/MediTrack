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

    // Get patient ID from user
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!patient) {
      return NextResponse.json({ reports: [] })
    }

    // Fetch lab reports for this patient
    const { data: reports, error } = await supabase
      .from('lab_reports')
      .select(`
        id,
        report_type,
        test_name,
        status,
        test_date,
        lab_name,
        technician_name,
        abnormal_flags,
        report_url,
        created_at,
        doctors(
          users(name)
        )
      `)
      .eq('patient_id', patient.id)
      .order('test_date', { ascending: false })

    if (error) throw error

    const formattedReports = reports?.map(report => ({
      id: report.id,
      report_type: report.report_type,
      test_name: report.test_name,
      status: report.status,
      test_date: report.test_date,
      lab_name: report.lab_name,
      technician_name: report.technician_name,
      abnormal_flags: report.abnormal_flags,
      report_url: report.report_url,
      doctor_name: report.doctors?.users?.name || null,
      created_at: report.created_at
    })) || []

    return NextResponse.json({ reports: formattedReports })

  } catch (error) {
    console.error('Error fetching patient reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}