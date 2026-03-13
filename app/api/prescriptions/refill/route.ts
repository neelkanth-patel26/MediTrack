import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prescriptionId, patientId } = body

    if (!prescriptionId || !patientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: prescription, error: prescriptionError } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('id', prescriptionId)
      .eq('patient_id', patientId)
      .single()

    if (prescriptionError || !prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      )
    }

    if (prescription.refills <= 0) {
      return NextResponse.json(
        { error: 'No refills remaining for this prescription' },
        { status: 400 }
      )
    }

    const { error: insertError } = await supabase
      .from('prescription_refill_requests')
      .insert({
        prescription_id: prescriptionId,
        patient_id: patientId,
        doctor_id: prescription.doctor_id,
        status: 'pending',
        requested_at: new Date().toISOString()
      })

    if (insertError) throw insertError

    return NextResponse.json({
      success: true,
      message: 'Refill request submitted successfully'
    })
  } catch (error) {
    console.error('Error processing refill request:', error)
    return NextResponse.json(
      { error: 'Failed to process refill request' },
      { status: 500 }
    )
  }
}
