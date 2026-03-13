import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { recipientId, senderId } = await request.json()

    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('recipient_id', recipientId)
      .eq('sender_id', senderId)
      .eq('is_read', false)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 })
  }
}