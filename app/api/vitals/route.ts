import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { userId, vitals } = await request.json()

    // Get patient ID
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('vitals')
      .insert([{
        patient_id: patient.id,
        blood_pressure_systolic: vitals.systolic,
        blood_pressure_diastolic: vitals.diastolic,
        heart_rate: vitals.heartRate,
        temperature: vitals.temperature,
        weight: vitals.weight,
        recorded_by: userId
      }])
      .select()

    if (error) {
      console.error('Vitals insert error:', error)
      return NextResponse.json({ error: 'Failed to save vitals' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}