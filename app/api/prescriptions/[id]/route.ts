import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctors (
          user_id,
          users (name)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 })
    }

    return NextResponse.json({ prescription })

  } catch (error) {
    console.error('Error fetching prescription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}