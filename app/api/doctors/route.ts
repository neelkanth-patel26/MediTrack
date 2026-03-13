import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, specialization')
      .eq('role', 'doctor')
      .order('name')

    if (error) throw error

    return NextResponse.json({ doctors: data || [] })
  } catch (error) {
    return NextResponse.json({ doctors: [] })
  }
}