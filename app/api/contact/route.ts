import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: contactMessage, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone: phone || null,
        subject: 'Contact Form Submission',
        message,
        category: 'general',
        priority: 'medium',
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      message: 'Message sent successfully',
      id: contactMessage.id 
    })

  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}