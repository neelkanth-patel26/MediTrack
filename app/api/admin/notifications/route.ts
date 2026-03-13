import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, priority = 'medium', targetAudience = 'all' } = body

    // Get users based on target audience
    let query = supabase.from('users').select('id')
    
    if (targetAudience !== 'all') {
      query = query.eq('role', targetAudience)
    }

    const { data: users, error: usersError } = await query

    if (usersError) throw usersError

    // Create notifications for all target users
    const notifications = users.map(user => ({
      user_id: user.id,
      title,
      message,
      type: 'admin',
      priority
    }))

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select()

    if (error) throw error

    return NextResponse.json({ 
      message: `Notification sent to ${users.length} users`,
      count: users.length
    })

  } catch (error) {
    console.error('Error sending admin notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}