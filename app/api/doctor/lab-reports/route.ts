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

    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    const { data: labReports, error } = await supabase
      .from('lab_reports')
      .select(`
        *,
        patients!inner(
          patient_id,
          users!inner(name)
        )
      `)
      .eq('doctor_id', doctorData.id)
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
      createdAt: report.created_at
    })) || []

    return NextResponse.json({ labReports: formattedReports })

  } catch (error) {
    console.error('Error fetching lab reports:', error)
    return NextResponse.json({ error: 'Failed to fetch lab reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorId, patientId, testName, category, testDate, labName, technicianName, resultsSummary, notes, reportUrl } = body

    if (!doctorId || !patientId || !testName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get doctor's internal ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    const { data, error } = await supabase
      .from('lab_reports')
      .insert({
        doctor_id: doctorData.id,
        patient_id: patientId, // This is already the internal patient ID from the form
        report_type: category || 'general',
        test_name: testName,
        test_results: resultsSummary ? { summary: resultsSummary, notes } : null,
        lab_name: labName,
        technician_name: technicianName,
        test_date: testDate || new Date().toISOString().split('T')[0],
        report_url: reportUrl,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      message: 'Lab report created successfully',
      report: data
    })

  } catch (error) {
    console.error('Error creating lab report:', error)
    return NextResponse.json({ error: 'Failed to create lab report' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportId, status, doctorNotes } = body

    const { data, error } = await supabase
      .from('lab_reports')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()

    if (error) throw error

    return NextResponse.json({ 
      message: 'Lab report updated successfully',
      report: data[0]
    })

  } catch (error) {
    console.error('Error updating lab report:', error)
    return NextResponse.json({ error: 'Failed to update lab report' }, { status: 500 })
  }
}