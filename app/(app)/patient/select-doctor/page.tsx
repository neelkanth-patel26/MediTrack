'use client'

import { useState, useMemo } from 'react'
import { useTheme } from '@/lib/theme-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Star, MapPin, Phone, Calendar } from 'lucide-react'

const MOCK_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.9,
    reviews: 342,
    experience: '15+ years',
    location: 'Manhattan, NY',
    phone: '+1 (555) 123-4567',
    nextAvailable: '2024-01-30',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Specialist in heart disease, hypertension management, and preventive cardiology.',
    languages: ['English', 'Spanish'],
    insurance: ['Blue Cross', 'United', 'Aetna'],
    consultationFee: '$150'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'General Medicine',
    rating: 4.8,
    reviews: 521,
    experience: '12+ years',
    location: 'Midtown, NY',
    phone: '+1 (555) 234-5678',
    nextAvailable: '2024-01-28',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    bio: 'Primary care physician with expertise in preventive medicine and chronic disease management.',
    languages: ['English', 'Mandarin'],
    insurance: ['All Major Insurances'],
    consultationFee: '$120'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Endocrinology',
    rating: 4.7,
    reviews: 289,
    experience: '10+ years',
    location: 'Brooklyn, NY',
    phone: '+1 (555) 345-6789',
    nextAvailable: '2024-02-01',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    bio: 'Expert in diabetes management, thyroid disorders, and metabolic health.',
    languages: ['English', 'Portuguese'],
    insurance: ['Blue Cross', 'Cigna', 'Oxford'],
    consultationFee: '$140'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    rating: 4.9,
    reviews: 198,
    experience: '18+ years',
    location: 'Upper West Side, NY',
    phone: '+1 (555) 456-7890',
    nextAvailable: '2024-02-02',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    bio: 'Specialist in neurological disorders, headaches, and neurodegeneration.',
    languages: ['English', 'French'],
    insurance: ['Blue Cross', 'United', 'Aetna'],
    consultationFee: '$160'
  },
  {
    id: '5',
    name: 'Dr. Linda Martinez',
    specialty: 'Pulmonology',
    rating: 4.6,
    reviews: 267,
    experience: '14+ years',
    location: 'Queens, NY',
    phone: '+1 (555) 567-8901',
    nextAvailable: '2024-01-29',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
    bio: 'Respiratory specialist with expertise in asthma, COPD, and sleep disorders.',
    languages: ['English', 'Spanish'],
    insurance: ['All Major Insurances'],
    consultationFee: '$130'
  },
  {
    id: '6',
    name: 'Dr. Robert Anderson',
    specialty: 'Orthopedics',
    rating: 4.8,
    reviews: 412,
    experience: '16+ years',
    location: 'Midtown, NY',
    phone: '+1 (555) 678-9012',
    nextAvailable: '2024-01-31',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    bio: 'Orthopedic surgeon specializing in joint and spine treatments.',
    languages: ['English'],
    insurance: ['Blue Cross', 'United', 'Cigna'],
    consultationFee: '$155'
  },
]

export default function SelectDoctorPage() {
  const { getColorClasses } = useTheme()
  const colorClasses = getColorClasses()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

  const specialties = Array.from(new Set(MOCK_DOCTORS.map(d => d.specialty)))

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.bio.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty
      return matchesSearch && matchesSpecialty
    })
  }, [searchTerm, selectedSpecialty])

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctor(doctorId)
  }

  const handleConfirmSelection = () => {
    if (selectedDoctor && typeof window !== 'undefined') {
      localStorage.setItem('patient_selected_doctor', selectedDoctor)
      alert('Doctor selected successfully!')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Doctor</h1>
          <p className="text-lg text-muted-foreground">Connect with recommended healthcare providers</p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Search Bar */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 bg-card border-border"
              />
            </div>
          </div>

          {/* Specialty Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedSpecialty || ''}
              onChange={(e) => setSelectedSpecialty(e.target.value || null)}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-medium"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDoctors.map((doctor) => (
            <Card 
              key={doctor.id} 
              className={`p-6 cursor-pointer border-2 transition-all ${
                selectedDoctor === doctor.id 
                  ? `border-primary bg-gradient-to-br ${colorClasses.primary.replace('from-', 'from-').split(' ')[0]}-50/10` 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelectDoctor(doctor.id)}
            >
              {/* Doctor Image */}
              <div className="mb-4">
                <img 
                  src={doctor.image || "/placeholder.svg"} 
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-primary/20"
                />
              </div>

              {/* Doctor Info */}
              <h3 className="text-lg font-semibold text-center mb-1">{doctor.name}</h3>
              <p className="text-sm text-center text-muted-foreground mb-3">{doctor.specialty}</p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium ml-2">{doctor.rating} ({doctor.reviews})</span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm mb-4 border-t border-border pt-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{doctor.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{doctor.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Next: {doctor.nextAvailable}</span>
                </div>
              </div>

              {/* Fee and Selection */}
              <div className="border-t border-border pt-4">
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">Consultation: </span>
                  <span className="font-semibold">{doctor.consultationFee}</span>
                </div>
                <Button
                  className={`w-full ${
                    selectedDoctor === doctor.id 
                      ? `bg-gradient-to-r ${colorClasses.primary} text-white` 
                      : 'bg-muted text-foreground hover:bg-muted-foreground/20'
                  }`}
                  onClick={() => handleSelectDoctor(doctor.id)}
                >
                  {selectedDoctor === doctor.id ? '✓ Selected' : 'Select'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Confirmation Button */}
        {selectedDoctor && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
            <div className="max-w-6xl mx-auto flex gap-4">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setSelectedDoctor(null)}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 bg-gradient-to-r ${colorClasses.primary} text-white hover:opacity-90`}
                onClick={handleConfirmSelection}
              >
                Confirm Selection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
