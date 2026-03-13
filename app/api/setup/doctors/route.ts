import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  return POST(request)
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Sample doctors to insert
    const doctorsData = [
      {
        name: 'Dr. Urmi Thakkar',
        email: 'urmi.thakkar@meditrack.com',
        role: 'doctor',
        specialization: 'Cardiology',
        bio: 'Board-certified cardiologist with extensive experience in cardiovascular medicine. Specializes in preventive cardiology, heart disease management, and cardiac interventions. Committed to providing comprehensive cardiac care.',
        consultation_fee: 150,
        years_experience: 15,
        availability: 'Available Today'
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@meditrack.com',
        role: 'doctor',
        specialization: 'Dermatology',
        bio: 'Board-certified dermatologist specializing in medical and cosmetic dermatology. Expert in skin cancer detection, acne treatment, and advanced dermatological procedures. Dedicated to helping patients achieve healthy skin.',
        consultation_fee: 120,
        years_experience: 12,
        availability: 'Available This Week'
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@meditrack.com',
        role: 'doctor',
        specialization: 'Internal Medicine',
        bio: 'Internal medicine physician with expertise in chronic disease management, preventive care, and adult primary care. Focused on comprehensive healthcare and patient wellness.',
        consultation_fee: 100,
        years_experience: 10,
        availability: 'Available Mon-Fri'
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@meditrack.com',
        role: 'doctor',
        specialization: 'Pediatrics',
        bio: 'Pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence. Specializes in child development, immunizations, and pediatric wellness care.',
        consultation_fee: 90,
        years_experience: 8,
        availability: 'Available Today'
      },
      {
        name: 'Dr. James Wilson',
        email: 'james.wilson@meditrack.com',
        role: 'doctor',
        specialization: 'Orthopedics',
        bio: 'Orthopedic surgeon specializing in sports medicine, joint replacement surgery, and musculoskeletal disorders. Expert in minimally invasive surgical techniques and rehabilitation.',
        consultation_fee: 180,
        years_experience: 20,
        availability: 'By Appointment Only'
      },
      {
        name: 'Dr. Lisa Park',
        email: 'lisa.park@meditrack.com',
        role: 'doctor',
        specialization: 'Neurology',
        bio: 'Neurologist with expertise in treating neurological disorders including epilepsy, stroke, and neurodegenerative diseases. Committed to advancing neurological care and patient outcomes.',
        consultation_fee: 200,
        years_experience: 14,
        availability: 'Available This Week'
      }
    ]

    const results = []

    for (const doctorData of doctorsData) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', doctorData.email)
        .single()

      let userId = existingUser?.id

      if (!existingUser) {
        // Create user
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            name: doctorData.name,
            email: doctorData.email,
            role: doctorData.role,
            specialization: doctorData.specialization,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single()

        if (userError) {
          console.error('Error creating user:', userError)
          continue
        }

        userId = newUser.id
      }

      // Check if doctor profile exists
      const { data: existingDoctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!existingDoctor) {
        // Create doctor profile
        const { error: doctorError } = await supabase
          .from('doctors')
          .insert({
            user_id: userId,
            specialization: doctorData.specialization,
            bio: doctorData.bio,
            consultation_fee: doctorData.consultation_fee,
            years_experience: doctorData.years_experience,
            availability: doctorData.availability,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (doctorError) {
          console.error('Error creating doctor profile:', doctorError)
          continue
        }
      }

      results.push({ name: doctorData.name, status: 'created/updated' })
    }

    // Create sample patients
    const patientsData = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        role: 'patient',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        bloodType: 'O+',
        allergies: 'Penicillin'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        role: 'patient',
        phone: '+1 (555) 234-5678',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        bloodType: 'A+',
        allergies: 'None'
      },
      {
        name: 'Mike Davis',
        email: 'mike.davis@email.com',
        role: 'patient',
        phone: '+1 (555) 345-6789',
        dateOfBirth: '1978-11-08',
        gender: 'male',
        bloodType: 'B+',
        allergies: 'Shellfish'
      },
      {
        name: 'Emma Wilson',
        email: 'emma.wilson@email.com',
        role: 'patient',
        phone: '+1 (555) 456-7890',
        dateOfBirth: '1992-05-14',
        gender: 'female',
        bloodType: 'AB+',
        allergies: 'Latex'
      },
      {
        name: 'David Brown',
        email: 'david.brown@email.com',
        role: 'patient',
        phone: '+1 (555) 567-8901',
        dateOfBirth: '1980-09-30',
        gender: 'male',
        bloodType: 'O-',
        allergies: 'Peanuts'
      }
    ]

    for (const patientData of patientsData) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', patientData.email)
        .single()

      let userId = existingUser?.id

      if (!existingUser) {
        // Create user
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            name: patientData.name,
            email: patientData.email,
            role: patientData.role,
            phone: patientData.phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single()

        if (userError) {
          console.error('Error creating patient user:', userError)
          continue
        }

        userId = newUser.id
      }

      // Check if patient profile exists
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!existingPatient) {
        // Create patient profile
        const { error: patientError } = await supabase
          .from('patients')
          .insert({
            user_id: userId,
            patient_id: `P${String(results.length + 1).padStart(3, '0')}`,
            date_of_birth: patientData.dateOfBirth,
            gender: patientData.gender,
            blood_type: patientData.bloodType,
            allergies: patientData.allergies,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (patientError) {
          console.error('Error creating patient profile:', patientError)
          continue
        }
      }

      results.push({ name: patientData.name, status: 'patient created/updated' })
    }

    // Add sample ratings for doctors
    const sampleRatings = [
      { doctorEmail: 'urmi.thakkar@meditrack.com', ratings: [5, 5, 4, 5, 4] },
      { doctorEmail: 'sarah.johnson@meditrack.com', ratings: [4, 5, 5, 4, 5] },
      { doctorEmail: 'michael.chen@meditrack.com', ratings: [4, 4, 5, 4, 4] },
      { doctorEmail: 'emily.rodriguez@meditrack.com', ratings: [5, 5, 5, 4, 5] },
      { doctorEmail: 'james.wilson@meditrack.com', ratings: [5, 4, 5, 5, 4] },
      { doctorEmail: 'lisa.park@meditrack.com', ratings: [4, 5, 4, 5, 5] }
    ]

    for (const ratingData of sampleRatings) {
      const { data: doctor } = await supabase
        .from('users')
        .select('id')
        .eq('email', ratingData.doctorEmail)
        .single()

      if (doctor) {
        const { data: doctorProfile } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', doctor.id)
          .single()

        if (doctorProfile) {
          for (let i = 0; i < ratingData.ratings.length; i++) {
            await supabase
              .from('doctor_ratings')
              .upsert({
                doctor_id: doctorProfile.id,
                patient_id: `patient-${i + 1}`,
                rating: ratingData.ratings[i]
              }, { onConflict: 'doctor_id,patient_id' })
          }
        }
      }
    }

    return NextResponse.json({ 
      message: 'Doctors setup completed',
      results 
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}