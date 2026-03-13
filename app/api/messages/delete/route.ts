import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: NextRequest) {
  try {
    const { messageId } = await request.json()

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    console.log('Attempting to delete message:', messageId)

    const { data, error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .select()

    if (error) {
      console.error('Delete error:', error)
      throw error
    }

    console.log('Delete successful:', data)
    return NextResponse.json({ message: 'Message deleted successfully', data })

  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}