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
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Check if patient record exists
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single()

    console.log('Patient lookup result:', { patientData, patientError })

    return NextResponse.json({ 
      patientExists: !!patientData,
      patientData,
      error: patientError?.message
    })

  } catch (error) {
    console.error('Test patient error:', error)
    return NextResponse.json({ error: 'Failed to test patient' }, { status: 500 })
  }
}