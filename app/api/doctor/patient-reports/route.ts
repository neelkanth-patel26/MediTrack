import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const doctorId = searchParams.get('doctorId')

    if (!patientId || !doctorId) {
      return NextResponse.json({ error: 'Patient ID and Doctor ID are required' }, { status: 400 })
    }

    // Get doctor's internal ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    // Get patient reports for this specific patient (both doctor-created and patient-uploaded)
    const { data: labReports, error } = await supabase
      .from('lab_reports')
      .select(`
        *,
        patients!inner(
          patient_id,
          users!inner(name)
        )
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const formattedReports = labReports?.map(report => ({
      id: report.id,
      patientName: report.patients.users.name,
      patientId: report.patients.patient_id,
      reportType: report.report_type,
      testName: report.test_name,
      testResults: report.test_results,
      referenceRanges: report.reference_ranges,
      abnormalFlags: report.abnormal_flags,
      labName: report.lab_name,
      technicianName: report.technician_name,
      status: report.status,
      testDate: report.test_date,
      reportUrl: report.report_url,
      createdAt: report.created_at,
      uploadedBy: report.doctor_id === doctorData.id ? 'doctor' : 'patient'
    })) || []

    return NextResponse.json({ 
      success: true, 
      reports: formattedReports 
    })

  } catch (error) {
    console.error('Error fetching patient reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}