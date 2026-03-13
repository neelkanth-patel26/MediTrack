import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { messageId } = await request.json()

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    // Get current pin status
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('is_pinned')
      .eq('id', messageId)
      .single()

    if (fetchError) throw fetchError

    // Toggle pin status
    const { error } = await supabase
      .from('messages')
      .update({ is_pinned: !message.is_pinned })
      .eq('id', messageId)

    if (error) throw error

    return NextResponse.json({ 
      message: message.is_pinned ? 'Message unpinned' : 'Message pinned',
      pinned: !message.is_pinned
    })

  } catch (error) {
    console.error('Error toggling pin status:', error)
    return NextResponse.json({ error: 'Failed to update pin status' }, { status: 500 })
  }
}