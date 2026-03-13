import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: appointments, count } = await supabase
      .from('appointments')
      .select('id, status', { count: 'exact' })
      .eq('doctor_id', params.id)
      .eq('status', 'completed')

    const { data: doctor } = await supabase
      .from('doctors')
      .select('consultation_fee')
      .eq('id', params.id)
      .single()

    const completed = count || 0
    const totalEarnings = completed * (doctor?.consultation_fee || 0)

    return NextResponse.json({ completed, totalEarnings })
  } catch (error) {
    return NextResponse.json({ completed: 0, totalEarnings: 0 })
  }
}
