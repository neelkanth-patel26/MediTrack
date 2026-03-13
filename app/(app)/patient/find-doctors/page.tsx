'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Search, Stethoscope, Clock, DollarSign, Star, MessageSquare, Calendar, MapPin, Grid3X3, List, Filter, SlidersHorizontal, Award, Users } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'
import { SuccessDialog } from '@/components/ui/success-dialog'
import { useRouter } from 'next/navigation'

interface Doctor {
  id: string
  name: string
  specialization: string
  bio: string
  consultation_fee: number
  years_experience: number
  availability: string
  rating: number
  reviewCount: number
}

export default function FindDoctorsPage() {
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const router = useRouter()
  const colorValues = getColorValues()
  
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minExperience: '',
    maxFee: '',
    availability: ''
  })
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [appointmentDialog, setAppointmentDialog] = useState(false)
  const [successDialog, setSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    reason: '',
    type: 'consultation'
  })
  const [validationError, setValidationError] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [messageSubject, setMessageSubject] = useState('')

  const specializations = [
    'All Specializations',
    'Cardiology',
    'Dermatology',
    'Internal Medicine',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Psychiatry',
    'Radiology'
  ]

  const searchDoctors = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (selectedSpecialization && selectedSpecialization !== 'All Specializations') {
        params.append('specialization', selectedSpecialization)
      }
      // Add timestamp to prevent caching
      params.append('t', Date.now().toString())

      const response = await fetch(`/api/doctors/search?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()
      console.log('Doctors search result:', data)
      setDoctors(data.doctors || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateDateTime = (date: string, time: string): string | null => {
    const now = new Date()
    const selectedDate = new Date(date)
    const [hours, minutes] = time.split(':').map(Number)
    selectedDate.setHours(hours, minutes, 0, 0)

    // Check if date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDateOnly = new Date(date)
    selectedDateOnly.setHours(0, 0, 0, 0)
    
    if (selectedDateOnly < today) {
      return 'Cannot book appointments in the past'
    }

    // Check if same day and less than 3 hours in advance
    if (selectedDateOnly.getTime() === today.getTime()) {
      const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000)
      if (selectedDate < threeHoursFromNow) {
        return 'Same-day appointments must be booked at least 3 hours in advance'
      }
    }

    return null
  }

  const checkAppointmentConflict = async (date: string, time: string): Promise<string | null> => {
    if (!user) return null
    
    try {
      const response = await fetch(`/api/patient/data?userId=${user.id}`)
      const data = await response.json()
      const existingAppointments = data.appointments || []
      
      const [newHours, newMinutes] = time.split(':').map(Number)
      const newDateTime = new Date(date)
      newDateTime.setHours(newHours, newMinutes, 0, 0)
      
      for (const apt of existingAppointments) {
        if (apt.appointment_date === date && apt.status !== 'cancelled') {
          const aptTime = apt.appointment_time.split(':').map(Number)
          const aptDateTime = new Date(date)
          aptDateTime.setHours(aptTime[0], aptTime[1], 0, 0)
          
          const timeDiffMs = Math.abs(newDateTime.getTime() - aptDateTime.getTime())
          const timeDiffHours = timeDiffMs / (1000 * 60 * 60)
          
          if (timeDiffHours < 3) {
            return `You have another appointment at ${apt.appointment_time.slice(0,5)}. Please maintain at least 3 hours gap between appointments.`
          }
        }
      }
    } catch (error) {
      console.error('Error checking appointment conflicts:', error)
    }
    
    return null
  }

  const bookAppointment = async () => {
    if (!selectedDoctor || !appointmentData.date || !appointmentData.time || !appointmentData.reason || isLoading) {
      console.log('Missing appointment data:', {
        selectedDoctor: !!selectedDoctor,
        date: appointmentData.date,
        time: appointmentData.time,
        reason: appointmentData.reason,
        isLoading
      })
      return
    }

    // Validate date and time
    const validationErr = validateDateTime(appointmentData.date, appointmentData.time)
    if (validationErr) {
      setValidationError(validationErr)
      return
    }

    // Check for appointment conflicts
    const conflictErr = await checkAppointmentConflict(appointmentData.date, appointmentData.time)
    if (conflictErr) {
      setValidationError(conflictErr)
      return
    }
    
    setValidationError('')

    console.log('Booking appointment for doctor:', selectedDoctor.id, 'patient:', user?.id)

    setIsLoading(true)
    try {
      const requestBody = {
        doctorId: selectedDoctor.id,
        patientId: user?.id,
        appointmentDate: appointmentData.date,
        appointmentTime: appointmentData.time,
        reason: appointmentData.reason,
        appointmentType: appointmentData.type,
        condition: appointmentData.type
      }
      
      console.log('Sending appointment request:', requestBody)

      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const responseData = await response.json()
      console.log('Appointment response:', responseData)

      if (response.ok) {
        setAppointmentData({ date: '', time: '', reason: '', type: 'consultation' })
        setValidationError('')
        setAppointmentDialog(false)
        setSelectedDoctor(null)
        setSuccessDialog(true)
      } else {
        console.error('Appointment booking failed:', responseData)
        setValidationError(responseData.error || 'Failed to book appointment')
      }
    } catch (error) {
      console.error('Book appointment error:', error)
      setErrorMessage('Failed to book appointment. Please try again.')
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = (doctor: Doctor) => {
    const message = `Hello, my name is ${user?.name || 'Patient'}. I would like to talk with you about a consultation. I found your profile and I'm interested in scheduling an appointment or discussing my health concerns with you.`
    
    // Use Next.js router for navigation
    const params = new URLSearchParams({
      doctorId: doctor.id,
      doctorName: doctor.name,
      message: message
    })
    
    router.push(`/patient/messages?${params.toString()}`)
  }

  useEffect(() => {
    searchDoctors()
  }, [selectedSpecialization])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-6 shadow-xl" style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }}>
          <Stethoscope className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-3 px-4">
          Find Your Doctor
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-6">
          Connect with experienced healthcare professionals and get the care you deserve
        </p>
        <div className="hidden sm:flex items-center justify-center gap-8 mt-8 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" style={{ color: colorValues.primary }} />
            <span>Verified Doctors</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: colorValues.primary }} />
            <span>Trusted by 10k+ Patients</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" style={{ color: colorValues.primary }} />
            <span>24/7 Available</span>
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <Card className="p-4 sm:p-8 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl">
        <div className="space-y-4 sm:space-y-6">
          {/* Main Search Row */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by name, specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 flex-1 sm:h-14 text-base sm:text-lg border-slate-200 dark:border-slate-600 focus:border-primary/50 rounded-xl shadow-sm"
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
              <div className="flex-1 w-full">
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger className="w-full lg:w-72 h-12 sm:h-14 rounded-xl border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={searchDoctors}
                disabled={isLoading}
                style={{ backgroundColor: colorValues.primary }}
                className="w-full lg:w-auto h-12 sm:h-14 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Search className="h-5 w-5 lg:mr-2" />}
                <span className="lg:inline">Search</span>
              </Button>
            </div>
          </div>

          {/* View Controls and Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-4 rounded-lg transition-all duration-200 ${showFilters ? 'text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-700'} text-sm`}
                style={showFilters ? { backgroundColor: colorValues.primary } : {}}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              {(filters.minExperience && filters.minExperience !== 'none') || (filters.maxFee && filters.maxFee !== 'none') || (filters.availability && filters.availability !== 'none') ? (
                <span className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full whitespace-nowrap">
                  Filters active
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`h-8 px-3 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'text-white shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                style={viewMode === 'list' ? { backgroundColor: colorValues.primary } : {}}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`h-8 px-3 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'text-white shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                style={viewMode === 'grid' ? { backgroundColor: colorValues.primary } : {}}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Award className="h-4 w-4" style={{ color: colorValues.primary }} />
                  Minimum Experience
                </Label>
                <Select value={filters.minExperience} onValueChange={(value) => setFilters({...filters, minExperience: value})}>
                  <SelectTrigger className="h-11 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Any experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any experience</SelectItem>
                    <SelectItem value="1">1+ years</SelectItem>
                    <SelectItem value="3">3+ years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" style={{ color: colorValues.primary }} />
                  Maximum Fee
                </Label>
                <Select value={filters.maxFee} onValueChange={(value) => setFilters({...filters, maxFee: value})}>
                  <SelectTrigger className="h-11 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any price</SelectItem>
                    <SelectItem value="50">Under $50</SelectItem>
                    <SelectItem value="100">Under $100</SelectItem>
                    <SelectItem value="200">Under $200</SelectItem>
                    <SelectItem value="300">Under $300</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: colorValues.primary }} />
                  Availability
                </Label>
                <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                  <SelectTrigger className="h-11 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Any availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any availability</SelectItem>
                    <SelectItem value="Available Today">Available Today</SelectItem>
                    <SelectItem value="Available This Week">Available This Week</SelectItem>
                    <SelectItem value="Available Next Week">Available Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid gap-6'}>
        {isLoading && (
          <div className="grid gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {doctors.length === 0 && !isLoading && (
          <Card className="p-8 text-center">
            <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </Card>
        )}

        {doctors.filter(doctor => {
          // Apply filters
          if (filters.minExperience && filters.minExperience !== 'none' && doctor.years_experience < parseInt(filters.minExperience)) return false
          if (filters.maxFee && filters.maxFee !== 'none' && doctor.consultation_fee > parseInt(filters.maxFee)) return false
          if (filters.availability && filters.availability !== 'none' && doctor.availability !== filters.availability) return false
          return true
        }).map((doctor) => (
          <Card key={doctor.id} className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm overflow-hidden ${viewMode === 'grid' ? 'h-fit' : ''}`}>
            <div className={`p-8 ${viewMode === 'grid' ? 'space-y-6' : 'flex flex-col lg:flex-row gap-8'}`}>
              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 shrink-0" style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }}>
                      <Stethoscope className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200 truncate ${viewMode === 'grid' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>{doctor.name}</h3>
                      <Badge variant="outline" className="mt-1 px-3 py-0.5 text-xs font-medium" style={{ borderColor: colorValues.primary, color: colorValues.primary }}>
                        {doctor.specialization}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg w-fit">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 ml-1">{doctor.rating}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline ml-1">({doctor.reviewCount} rev.)</span>
                  </div>
                </div>

                <p className={`text-slate-600 dark:text-slate-300 leading-relaxed mb-6 ${viewMode === 'grid' ? 'text-sm line-clamp-3' : 'text-base'}`}>{doctor.bio}</p>

                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <Clock className="h-5 w-5" style={{ color: colorValues.primary }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{doctor.years_experience} Years</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <DollarSign className="h-5 w-5" style={{ color: colorValues.primary }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">${doctor.consultation_fee}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Consultation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <MapPin className="h-5 w-5" style={{ color: colorValues.primary }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{doctor.availability}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Availability</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={`flex gap-3 ${viewMode === 'grid' ? 'flex-col' : 'flex-col lg:w-56'}`}>
                <Dialog open={appointmentDialog} onOpenChange={setAppointmentDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full h-12 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }}
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg bg-background/95 border border-border/30 shadow-xl rounded-xl" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader className="pb-6 border-b border-border/10">
                      <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                          <Calendar className="h-5 w-5" style={{ color: colorValues.primary }} />
                        </div>
                        <div>
                          <div>Book Appointment</div>
                          <div className="text-sm font-normal text-muted-foreground mt-1">
                            with {selectedDoctor?.name}
                          </div>
                        </div>
                      </DialogTitle>
                      <div className="flex items-center gap-4 mt-4 p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">{selectedDoctor?.specialization}</span>
                          <span className="text-muted-foreground mx-2">•</span>
                          <span className="font-medium" style={{ color: colorValues.primary }}>${selectedDoctor?.consultation_fee}</span>
                          <span className="text-muted-foreground ml-1">consultation</span>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-6 pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" style={{ color: colorValues.primary }} />
                            Preferred Date
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={appointmentData.date}
                            onChange={(e) => {
                              setAppointmentData({...appointmentData, date: e.target.value})
                              setValidationError('')
                            }}
                            className="h-12 border-border/50 focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" style={{ color: colorValues.primary }} />
                            Preferred Time
                          </Label>
                          <Input
                            id="time"
                            type="time"
                            value={appointmentData.time}
                            onChange={(e) => {
                              setAppointmentData({...appointmentData, time: e.target.value})
                              setValidationError('')
                            }}
                            className="h-12 border-border/50 focus:border-primary/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium">Appointment Type</Label>
                        <Select value={appointmentData.type} onValueChange={(value) => setAppointmentData({...appointmentData, type: value})}>
                          <SelectTrigger className="h-12 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">General Consultation</SelectItem>
                            <SelectItem value="follow_up">Follow-up Visit</SelectItem>
                            <SelectItem value="emergency">Emergency Consultation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-medium">Reason for Visit</Label>
                        <Textarea
                          id="reason"
                          placeholder="Please describe your symptoms, concerns, or reason for this appointment..."
                          value={appointmentData.reason}
                          onChange={(e) => setAppointmentData({...appointmentData, reason: e.target.value})}
                          rows={4}
                          className="resize-none border-border/50 focus:border-primary/50"
                        />
                      </div>
                      {validationError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <div className="flex gap-2">
                            <svg className="w-4 h-4 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-red-800 dark:text-red-200">{validationError}</p>
                          </div>
                        </div>
                      )}
                      {appointmentData.date && appointmentData.date === new Date().toISOString().split('T')[0] && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex gap-2">
                            <svg className="w-4 h-4 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.732-1.333-2.464 0L4.35 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="text-xs text-amber-800 dark:text-amber-200">
                              <p className="font-medium mb-1">Same-Day Appointment Warning</p>
                              <p>Due to sudden demand, there is a higher chance the doctor may not see or cancel this appointment. MediTrack+ is not responsible for same-day appointment cancellations.</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex gap-2">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-xs text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">Booking Requirements</p>
                            <p>• Cannot book appointments in the past<br/>• Same-day appointments require 3 hours advance notice<br/>• Maintain 3-hour gap between appointments on same day<br/>• Subject to doctor availability</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="flex gap-2">
                          <svg className="w-4 h-4 text-orange-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.732-1.333-2.464 0L4.35 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div className="text-xs text-orange-800 dark:text-orange-200">
                            <p className="font-medium mb-1">Punctuality Policy</p>
                            <p>If you are unable to reach the doctor on time, your appointment will be cancelled. You will need to book a new appointment.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4 border-t border-border/10">
                        <Button 
                          variant="outline" 
                          className="flex-1 h-12 border-border/50" 
                          onClick={() => {
                            setAppointmentDialog(false)
                            setAppointmentData({ date: '', time: '', reason: '', type: 'consultation' })
                            setValidationError('')
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={bookAppointment}
                          disabled={!appointmentData.date || !appointmentData.time || !appointmentData.reason || isLoading}
                          style={{ backgroundColor: colorValues.primary }}
                          className="text-white flex-1 h-12 font-medium shadow-lg"
                        >
                          {isLoading ? 'Booking...' : 'Confirm Appointment'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 rounded-xl"
                  style={{ borderColor: colorValues.primary, color: colorValues.primary }}
                  onClick={() => sendMessage(doctor)}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <SuccessDialog
        open={successDialog}
        onOpenChange={setSuccessDialog}
        title="Appointment Booked Successfully!"
        message="Your appointment request has been submitted. You will receive a confirmation email once the doctor approves your appointment."
      />

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md bg-background/95 border border-red-200 dark:border-red-800 shadow-xl rounded-xl">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Booking Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
            <Button 
              onClick={() => setShowErrorDialog(false)}
              style={{ backgroundColor: colorValues.primary }}
              className="text-white"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}