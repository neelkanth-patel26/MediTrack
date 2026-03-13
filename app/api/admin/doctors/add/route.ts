import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, specialization, phone } = body

    if (!firstName || !lastName || !email || !specialization) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const name = `${firstName} ${lastName}`

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'TempPassword123!',
      email_confirm: true,
      user_metadata: {
        name,
        role: 'doctor'
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        role: 'doctor',
        specialization,
        phone: phone || null,
        is_active: true
      })

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    const { error: doctorError } = await supabase
      .from('doctors')
      .insert({
        user_id: authData.user.id,
        specialization,
        consultation_fee: 100.00,
        years_experience: 0,
        availability: 'Available by appointment'
      })

    if (doctorError) {
      return NextResponse.json({ error: doctorError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Doctor added successfully',
      userId: authData.user.id
    })
  } catch (error) {
    console.error('Error adding doctor:', error)
    return NextResponse.json(
      { error: 'Failed to add doctor' },
      { status: 500 }
    )
  }
}
