import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createNotification } from '@/lib/notifications'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { senderId, recipientId, content } = await request.json()

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error

    // Get sender info for notification
    const { data: sender } = await supabase
      .from('users')
      .select('name')
      .eq('id', senderId)
      .single()

    // Send notification to recipient
    if (sender) {
      await createNotification({
        userId: recipientId,
        title: 'New Message',
        message: `New message from ${sender.name}`,
        type: 'message',
        priority: 'medium',
        entityType: 'message',
        entityId: data[0].id,
        actionUrl: '/messages'
      })
    }

    return NextResponse.json({ success: true, message: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id(id, name, role),
        recipient:users!recipient_id(id, name, role),
        parent_message:messages!parent_message_id(*)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ messages: data || [] })
  } catch (error) {
    return NextResponse.json({ messages: [] })
  }
}