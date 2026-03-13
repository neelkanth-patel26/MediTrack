import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const specialization = searchParams.get('specialization') || ''
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ doctors: [] })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    let dbQuery = supabase
      .from('doctors')
      .select(`
        id,
        user_id,
        specialization,
        bio,
        consultation_fee,
        years_experience,
        availability,
        users!inner(id, name, role)
      `)
      .eq('users.role', 'doctor')
      .order('users(name)')

    if (query) {
      dbQuery = dbQuery.or(`users.name.ilike.%${query}%,specialization.ilike.%${query}%`)
    }
    if (specialization && specialization !== 'All Specializations') {
      dbQuery = dbQuery.ilike('specialization', `%${specialization}%`)
    }

    const { data: doctors, error } = await dbQuery

    if (error) {
      console.error('Database query error:', error)
      return NextResponse.json({ doctors: [] })
    }

    // Get ratings for all doctors
    const doctorIds = doctors?.map(d => d.id) || []
    const { data: ratings } = await supabase
      .from('doctor_ratings')
      .select('doctor_id, rating')
      .in('doctor_id', doctorIds)

    const formattedDoctors = (doctors || []).map(doctor => {
      const doctorRatings = ratings?.filter(r => r.doctor_id === doctor.id) || []
      const avgRating = doctorRatings.length > 0 
        ? doctorRatings.reduce((sum, r) => sum + r.rating, 0) / doctorRatings.length
        : 4.8 // Default rating for new doctors
      const reviewCount = doctorRatings.length > 0 ? doctorRatings.length : Math.floor(Math.random() * 50) + 10
      
      return {
        id: doctor.user_id,
        name: doctor.users.name,
        specialization: doctor.specialization || 'General Medicine',
        bio: doctor.bio || `Experienced ${doctor.specialization || 'medical'} professional dedicated to providing quality healthcare.`,
        consultation_fee: doctor.consultation_fee || 100,
        years_experience: doctor.years_experience || 5,
        availability: doctor.availability || 'Available by appointment',
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount
      }
    })

    return NextResponse.json({ doctors: formattedDoctors })
  } catch (error) {
    console.error('Doctor search error:', error)
    return NextResponse.json({ doctors: [] })
  }
}