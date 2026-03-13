import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: activities, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        users!activity_logs_user_id_fkey (
          name,
          role
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      timestamp: activity.created_at,
      user: activity.users?.name || 'Unknown User',
      userType: activity.users?.role || 'unknown',
      action: activity.action,
      details: activity.details ? JSON.stringify(activity.details) : 'No details',
      category: activity.entity_type || 'general',
      severity: 'info',
      ipAddress: activity.ip_address || 'N/A'
    }))

    return NextResponse.json({ activities: formattedActivities })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
