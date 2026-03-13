import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const reportType = formData.get('reportType') as string
    const testName = formData.get('testName') as string
    const testDate = formData.get('testDate') as string
    const labName = formData.get('labName') as string

    if (!file || !userId || !reportType || !testName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get patient ID from user ID
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'reports')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}_${file.name}`
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    const reportUrl = `/uploads/reports/${fileName}`

    // Save to database
    const { data, error } = await supabase
      .from('lab_reports')
      .insert({
        patient_id: patient.id,
        report_type: reportType,
        test_name: testName,
        test_date: testDate || new Date().toISOString().split('T')[0],
        lab_name: labName || 'Patient Upload',
        status: 'completed',
        report_url: reportUrl
      })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, report: data[0] })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload report' }, { status: 500 })
  }
}