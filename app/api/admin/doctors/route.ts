import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data: doctors, error } = await supabase
      .from('doctors')
      .select(`
        id,
        doctor_id,
        license_number,
        specialization,
        bio,
        availability,
        consultation_fee,
        years_experience,
        education,
        certifications,
        created_at,
        user_id,
        users!inner(id, name, email, phone, is_active)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const formattedDoctors = doctors?.map(doctor => ({
      id: doctor.id,
      userId: doctor.user_id,
      name: doctor.users.name,
      email: doctor.users.email,
      phone: doctor.users.phone,
      specialization: doctor.specialization,
      doctor_id: doctor.doctor_id,
      license_number: doctor.license_number,
      years_experience: doctor.years_experience,
      consultation_fee: doctor.consultation_fee,
      availability: doctor.availability,
      bio: doctor.bio,
      education: doctor.education,
      certifications: doctor.certifications,
      is_active: doctor.users.is_active,
      created_at: doctor.created_at
    })) || []

    return NextResponse.json({ doctors: formattedDoctors })

  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 })
  }
}