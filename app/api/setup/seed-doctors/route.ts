import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    const doctorsData = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Dr. Urmi Thakkar',
        email: 'urmi.thakkar@meditrack.com',
        specialization: 'Cardiology',
        phone: '+1-555-0101',
        doctor_id: 'D001',
        license_number: 'MD12345',
        bio: 'Experienced cardiologist with 15+ years in practice specializing in heart disease prevention and treatment',
        availability: 'Mon-Fri 9AM-5PM',
        consultation_fee: 150.00,
        years_experience: 15,
        education: 'MD from AIIMS Delhi, Fellowship in Interventional Cardiology',
        certifications: 'Board Certified Cardiologist, FACC'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@meditrack.com',
        specialization: 'Internal Medicine',
        phone: '+1-555-0102',
        doctor_id: 'D002',
        license_number: 'MD12346',
        bio: 'General practitioner specializing in preventive care and chronic disease management',
        availability: 'Mon-Sat 8AM-6PM',
        consultation_fee: 120.00,
        years_experience: 12,
        education: 'MBBS from Grant Medical College, MD Internal Medicine',
        certifications: 'Board Certified Internal Medicine'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@meditrack.com',
        specialization: 'Dermatology',
        phone: '+1-555-0103',
        doctor_id: 'D003',
        license_number: 'MD12347',
        bio: 'Dermatologist with expertise in cosmetic procedures and skin cancer treatment',
        availability: 'Tue-Sat 10AM-4PM',
        consultation_fee: 180.00,
        years_experience: 10,
        education: 'MBBS from KEM Hospital, MD Dermatology',
        certifications: 'Board Certified Dermatologist, Cosmetic Surgery Certified'
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Dr. Amit Patel',
        email: 'amit.patel@meditrack.com',
        specialization: 'Orthopedics',
        phone: '+1-555-0104',
        doctor_id: 'D004',
        license_number: 'MD12348',
        bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement',
        availability: 'Mon-Thu 7AM-3PM',
        consultation_fee: 200.00,
        years_experience: 18,
        education: 'MBBS from Seth GS Medical College, MS Orthopedics',
        certifications: 'Board Certified Orthopedic Surgeon, Sports Medicine Fellowship'
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Dr. Neha Gupta',
        email: 'neha.gupta@meditrack.com',
        specialization: 'Pediatrics',
        phone: '+1-555-0105',
        doctor_id: 'D005',
        license_number: 'MD12349',
        bio: 'Pediatrician with focus on child development and preventive care',
        availability: 'Mon-Fri 8AM-5PM',
        consultation_fee: 130.00,
        years_experience: 8,
        education: 'MBBS from Lady Hardinge Medical College, MD Pediatrics',
        certifications: 'Board Certified Pediatrician'
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh@meditrack.com',
        specialization: 'Neurology',
        phone: '+1-555-0106',
        doctor_id: 'D006',
        license_number: 'MD12350',
        bio: 'Neurologist specializing in stroke treatment and neurological disorders',
        availability: 'Wed-Sun 9AM-4PM',
        consultation_fee: 220.00,
        years_experience: 20,
        education: 'MBBS from JIPMER, DM Neurology',
        certifications: 'Board Certified Neurologist, Stroke Specialist'
      }
    ]

    for (const doctor of doctorsData) {
      await supabase.from('users').upsert({
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        role: 'doctor',
        specialization: doctor.specialization,
        phone: doctor.phone,
        is_active: true
      })

      await supabase.from('doctors').upsert({
        user_id: doctor.id,
        doctor_id: doctor.doctor_id,
        license_number: doctor.license_number,
        specialization: doctor.specialization,
        bio: doctor.bio,
        availability: doctor.availability,
        consultation_fee: doctor.consultation_fee,
        years_experience: doctor.years_experience,
        education: doctor.education,
        certifications: doctor.certifications
      })
    }

    return NextResponse.json({ message: 'Doctors seeded successfully' })
  } catch (error) {
    console.error('Error seeding doctors:', error)
    return NextResponse.json({ error: 'Failed to seed doctors' }, { status: 500 })
  }
}