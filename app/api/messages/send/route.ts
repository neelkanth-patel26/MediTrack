import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { senderId, recipientId, content, parentMessageId, messageType } = await request.json()

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        message_type: messageType || 'general',
        parent_message_id: parentMessageId || null,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, message: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}