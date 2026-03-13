import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select(`
        *,
        users!announcements_created_by_fkey (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const formattedAnnouncements = announcements.map(announcement => ({
      id: announcement.id,
      title: announcement.title,
      message: announcement.content,
      published: announcement.created_at,
      publishedBy: announcement.users?.name || 'Unknown',
      recipients: announcement.target_audience === 'all' ? 'All Users' : 
                  announcement.target_audience === 'doctors' ? 'Doctors' :
                  announcement.target_audience === 'patients' ? 'Patients' : 'Admin',
      status: announcement.is_active ? 'active' : 'inactive',
      priority: announcement.priority,
      category: announcement.announcement_type
    }))

    return NextResponse.json({ announcements: formattedAnnouncements })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, priority, audience } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get first admin user as creator
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single()

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        title,
        content,
        announcement_type: 'general',
        priority: priority || 'medium',
        target_audience: audience || 'all',
        is_active: true,
        created_by: adminUser?.id
      })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
