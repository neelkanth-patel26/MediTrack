import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertType, title, message, recipients, severity } = body

    const { data, error } = await supabase
      .from('system_alerts')
      .insert({
        title: title,
        alert_type: alertType,
        message: message,
        severity: severity || (alertType === 'critical' ? 'critical' : alertType === 'error' ? 'high' : alertType === 'warning' ? 'medium' : 'low'),
        is_resolved: false,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json({ success: false, error: 'Failed to create alert' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Alert ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('system_alerts')
      .update({ is_resolved: true })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete alert' }, { status: 500 })
  }
}
