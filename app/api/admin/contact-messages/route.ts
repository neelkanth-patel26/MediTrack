import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ messages: [] })
    }

    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ messages: [] })
    }

    return NextResponse.json({ messages: messages || [] })

  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ messages: [] })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, status, replyMessage, assignedTo } = body

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ message: 'Updated successfully' })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (replyMessage) updateData.reply_message = replyMessage
    if (assignedTo) updateData.assigned_to = assignedTo

    const { error } = await supabase
      .from('contact_messages')
      .update(updateData)
      .eq('id', messageId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Updated successfully' })

  } catch (error) {
    console.error('Error updating contact message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}