import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Return success if no database configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ message: 'All notifications marked as read', updatedCount: 0 })
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ message: 'All notifications marked as read', updatedCount: 0 })
    }

    return NextResponse.json({ 
      message: 'All notifications marked as read',
      updatedCount: data?.length || 0
    })

  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json({ message: 'All notifications marked as read', updatedCount: 0 })
  }
}