'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'

export function SendMessageDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  const handleSend = async () => {
    if (!message || !user) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          recipientId: 'demo-doctor-id',
          content: message,
          subject: subject || 'New Message',
          messageType
        })
      })

      if (response.ok) {
        alert('Message sent successfully!')
        setSubject('')
        setMessage('')
        setMessageType('general')
        setOpen(false)
      }
    } catch (error) {
      alert('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            Send Message to Doctor
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Send a secure message to your healthcare provider</p>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="messageType" className="text-sm font-medium">Message Type</Label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger className="h-11 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Question</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="appointment">Appointment Related</SelectItem>
                <SelectItem value="prescription">Prescription Question</SelectItem>
                <SelectItem value="lab_result">Lab Results</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
            <Input 
              id="subject" 
              placeholder="Brief description of your message" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-11 border-border/50 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Please describe your question or concern in detail..." 
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-border/50 focus:border-primary/50 resize-none"
            />
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex gap-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Response Time</p>
                <p>Your doctor typically responds within 24-48 hours. For urgent matters, please call the office directly.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border/10">
          <Button 
            variant="outline" 
            className="flex-1 h-11 border-border/50" 
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: colorValues.primary }} 
            className="text-white flex-1 h-11 shadow-lg"
            onClick={handleSend}
            disabled={!message || isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function BookAppointmentDialog({ children, doctorId, onSuccess }: { children: React.ReactNode, doctorId?: string, onSuccess?: () => void }) {
  console.log('BookAppointmentDialog rendered with doctorId:', doctorId)
  const [open, setOpen] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || '')
  const [formData, setFormData] = useState({
    appointmentType: '',
    date: '',
    time: '',
    reason: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  useEffect(() => {
    if (open && !doctorId) {
      fetchDoctors()
    }
  }, [open, doctorId])

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors')
      const data = await response.json()
      setDoctors(data.doctors || [])
    } catch (error) {
      console.error('Failed to fetch doctors:', error)
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

  const handleBook = async () => {
    const finalDoctorId = doctorId || selectedDoctorId
    if (!formData.date || !formData.time || !formData.reason || !user || !finalDoctorId) {
      console.log('Missing required fields:', { 
        date: formData.date, 
        time: formData.time, 
        reason: formData.reason, 
        user: !!user, 
        doctorId: finalDoctorId 
      })
      setValidationError('Please fill in all required fields')
      return
    }

    // Validate date and time
    const validationErr = validateDateTime(formData.date, formData.time)
    if (validationErr) {
      setValidationError(validationErr)
      return
    }

    // Check for appointment conflicts
    const conflictErr = await checkAppointmentConflict(formData.date, formData.time)
    if (conflictErr) {
      setValidationError(conflictErr)
      return
    }
    
    setValidationError('')
    
    setIsLoading(true)
    try {
      const requestBody = {
        doctorId: finalDoctorId,
        patientId: user.id,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
        appointmentType: formData.appointmentType || 'consultation',
        condition: formData.appointmentType,
        reason: formData.reason
      }
      
      console.log('Booking appointment with data:', requestBody)
      
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const responseData = await response.json()
      console.log('Appointment booking response:', responseData)

      if (response.ok) {
        setFormData({ appointmentType: '', date: '', time: '', reason: '' })
        setValidationError('')
        setOpen(false)
        setShowSuccessDialog(true)
        onSuccess?.()
      } else {
        console.error('Appointment booking failed:', responseData)
        setErrorMessage(responseData.error || 'Failed to book appointment')
        setShowErrorDialog(true)
      }
    } catch (error) {
      console.error('Appointment booking error:', error)
      setErrorMessage('Failed to book appointment. Please try again.')
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-background/95 border border-border/30 shadow-xl rounded-xl">
          <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Book New Appointment
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Schedule an appointment with your healthcare provider</p>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {!doctorId && (
            <div className="space-y-2">
              <Label htmlFor="doctor" className="text-sm font-medium">Select Doctor</Label>
              <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger className="h-11 border-border/50">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization || 'General Practice'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Appointment Type</Label>
            <Select value={formData.appointmentType} onValueChange={(value) => setFormData({...formData, appointmentType: value})}>
              <SelectTrigger className="h-11 border-border/50">
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">General Consultation</SelectItem>
                <SelectItem value="followup">Follow-up Visit</SelectItem>
                <SelectItem value="checkup">Routine Check-up</SelectItem>
                <SelectItem value="urgent">Urgent Care</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Preferred Date
              </Label>
              <Input 
                id="date" 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => {
                  setFormData({...formData, date: e.target.value})
                  setValidationError('')
                }}
                className="h-11 border-border/50 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Preferred Time
              </Label>
              <Input 
                id="time" 
                type="time" 
                value={formData.time}
                onChange={(e) => {
                  setFormData({...formData, time: e.target.value})
                  setValidationError('')
                }}
                className="h-11 border-border/50 focus:border-primary/50"
              />
            </div>
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
          {formData.date && formData.date === new Date().toISOString().split('T')[0] && (
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
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">Reason for Visit</Label>
            <Textarea 
              id="reason" 
              placeholder="Please describe your symptoms, concerns, or reason for this appointment..." 
              rows={4}
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="border-border/50 focus:border-primary/50 resize-none"
            />
          </div>
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
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border/10">
          <Button 
            variant="outline" 
            className="flex-1 h-11 border-border/50" 
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: colorValues.primary }} 
            className="text-white flex-1 h-11 shadow-lg"
            onClick={handleBook}
            disabled={!formData.date || !formData.time || !formData.reason || (!doctorId && !selectedDoctorId) || isLoading}
          >
            {isLoading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md bg-background/95 border border-green-200 dark:border-green-800 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Success</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Success!</h3>
          <p className="text-lg font-semibold mb-2">Appointment Booked Successfully</p>
          <p className="text-sm text-muted-foreground">Your appointment has been scheduled. You will receive a confirmation email shortly.</p>
        </div>
      </DialogContent>
    </Dialog>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
      <DialogContent className="sm:max-w-md bg-background/95 border border-red-200 dark:border-red-800 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Error</DialogTitle>
        </DialogHeader>
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
    </>
  )
}

export function AddVitalDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [vitals, setVitals] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    weight: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  const handleSave = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          vitals: {
            systolic: vitals.systolic ? parseInt(vitals.systolic) : null,
            diastolic: vitals.diastolic ? parseInt(vitals.diastolic) : null,
            heartRate: vitals.heartRate ? parseInt(vitals.heartRate) : null,
            temperature: vitals.temperature ? parseFloat(vitals.temperature) : null,
            weight: vitals.weight ? parseFloat(vitals.weight) : null
          }
        })
      })

      if (response.ok) {
        alert('Vitals saved successfully!')
        setVitals({ systolic: '', diastolic: '', heartRate: '', temperature: '', weight: '' })
        setOpen(false)
        window.location.reload() // Refresh to show new data
      }
    } catch (error) {
      alert('Failed to save vitals')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Add Vital Signs
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Record your current health measurements</p>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systolic" className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Systolic BP
              </Label>
              <div className="relative">
                <Input 
                  id="systolic" 
                  placeholder="120" 
                  type="number"
                  value={vitals.systolic}
                  onChange={(e) => setVitals({...vitals, systolic: e.target.value})}
                  className="h-11 border-border/50 focus:border-primary/50 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">mmHg</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diastolic" className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Diastolic BP
              </Label>
              <div className="relative">
                <Input 
                  id="diastolic" 
                  placeholder="80" 
                  type="number"
                  value={vitals.diastolic}
                  onChange={(e) => setVitals({...vitals, diastolic: e.target.value})}
                  className="h-11 border-border/50 focus:border-primary/50 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">mmHg</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate" className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Heart Rate
              </Label>
              <div className="relative">
                <Input 
                  id="heartRate" 
                  placeholder="72" 
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                  className="h-11 border-border/50 focus:border-primary/50 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">bpm</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Temperature
              </Label>
              <div className="relative">
                <Input 
                  id="temperature" 
                  placeholder="36.5" 
                  type="number" 
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                  className="h-11 border-border/50 focus:border-primary/50 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">°C</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Weight
            </Label>
            <div className="relative">
              <Input 
                id="weight" 
                placeholder="70" 
                type="number"
                value={vitals.weight}
                onChange={(e) => setVitals({...vitals, weight: e.target.value})}
                className="h-11 border-border/50 focus:border-primary/50 pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kg</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-border/10">
            <Button 
              variant="outline" 
              className="flex-1 h-11 border-border/50" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white flex-1 h-11 shadow-lg"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Vitals'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ViewDetailsDialog({ children, title, data }: { 
  children: React.ReactNode
  title: string
  data: any
}) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  const fetchNotifications = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/notifications?userId=${user.id}`)
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true)
    try {
      const response = await fetch('/api/patient/announcements')
      if (response.ok) {
        const result = await response.json()
        setAnnouncements(result.announcements || [])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead', userId: user?.id })
      })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      case 'prescription':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
      case 'lab_result':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      default:
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-orange-500'
      case 'low': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const formatTime = (timeString: string) => {
    const now = new Date()
    const time = new Date(timeString)
    const diffMs = now.getTime() - time.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  React.useEffect(() => {
    if (open) {
      fetchNotifications()
      fetchAnnouncements()
    }
  }, [open, user?.id])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-7.5-7.5H2.5" />
              </svg>
            </div>
            Notifications
          </DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">{notifications.filter(n => !n.read).length} unread notifications</p>
            {notifications.some(n => !n.read) && (
              <button className="text-xs" style={{ color: colorValues.primary }} onClick={markAllAsRead}>Mark all read</button>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-3 pt-4 max-h-96 overflow-y-auto">
          {/* Announcements Section */}
          {announcements.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Announcements
              </h3>
              <div className="space-y-2">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className={`p-3 rounded-lg border ${
                    announcement.priority === 'high' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                    announcement.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                    'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold text-sm ${
                        announcement.priority === 'high' ? 'text-red-900 dark:text-red-100' :
                        announcement.priority === 'medium' ? 'text-yellow-900 dark:text-yellow-100' :
                        'text-blue-900 dark:text-blue-100'
                      }`}>{announcement.title}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        announcement.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {announcement.priority}
                      </div>
                    </div>
                    <p className={`text-xs mb-2 ${
                      announcement.priority === 'high' ? 'text-red-800 dark:text-red-200' :
                      announcement.priority === 'medium' ? 'text-yellow-800 dark:text-yellow-200' :
                      'text-blue-800 dark:text-blue-200'
                    }`}>{announcement.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                      <span className="capitalize">{announcement.target_audience}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Notifications Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Notifications</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colorValues.primary }}></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg border transition-colors hover:bg-muted/30 ${
                  notification.read ? 'border-border/30 bg-muted/10' : 'border-border/50 bg-background'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                      notification.read ? 'bg-muted' : 'bg-primary/10'
                    }`}>
                      <div className={getPriorityColor(notification.priority)}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium truncate ${
                          notification.read ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className={`text-xs mt-1 line-clamp-2 ${
                        notification.read ? 'text-muted-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2">{formatTime(notification.time)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-border/10">
          <button 
            className="flex-1 h-11 px-4 text-sm font-medium rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function RefillRequestDialog({ children, prescriptions, onRefillSuccess }: { children: React.ReactNode, prescriptions?: any[], onRefillSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [requestedRefills, setRequestedRefills] = useState<Set<string>>(new Set())
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  const handleRequestRefill = async () => {
    if (!selectedPrescription || !user) return
    
    console.log('Refill request data:', {
      prescriptionId: selectedPrescription.id,
      patientId: user.id,
      prescription: selectedPrescription
    })
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/prescriptions/refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId: selectedPrescription.id,
          patientId: user.id
        })
      })

      const data = await response.json()
      console.log('Refill response:', data)
      
      if (response.ok) {
        setRequestedRefills(prev => new Set(prev).add(selectedPrescription.id))
        alert('✅ Refill request submitted successfully! Your doctor will review it shortly.')
        setOpen(false)
        setSelectedPrescription(null)
        onRefillSuccess?.()
      } else {
        alert('❌ ' + (data.error || 'Failed to submit refill request'))
      }
    } catch (error) {
      console.error('Refill error:', error)
      alert('❌ Failed to submit refill request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            Request Prescription Refill
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {prescriptions && prescriptions.length > 0 ? (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select prescription to refill:</Label>
              {prescriptions.map((prescription) => {
                const isRequested = requestedRefills.has(prescription.id)
                return (
                <div 
                  key={prescription.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPrescription?.id === prescription.id 
                      ? 'border-primary bg-primary/5' 
                      : isRequested
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : 'border-border/50 hover:border-border'
                  } ${isRequested ? 'opacity-60' : ''}`}
                  onClick={() => !isRequested && setSelectedPrescription(prescription)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{prescription.medication_name} {prescription.dosage}</h4>
                      <p className="text-sm text-muted-foreground">
                        {prescription.frequency} • {prescription.refills} refills remaining
                      </p>
                    </div>
                    {isRequested ? (
                      <span className="text-xs text-green-600 font-medium">✓ Requested</span>
                    ) : prescription.refills <= 0 ? (
                      <span className="text-xs text-red-500 font-medium">No refills</span>
                    ) : null}
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No prescriptions available</p>
            </div>
          )}
          
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex gap-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-xs text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Processing Time</p>
                <p>Your refill request will be processed within 2-4 hours.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border/10">
          <Button variant="outline" className="flex-1 h-11" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: colorValues.primary }} 
            className="text-white flex-1 h-11 shadow-lg"
            onClick={handleRequestRefill}
            disabled={isLoading || !selectedPrescription || selectedPrescription?.refills <= 0}
          >
            {isLoading ? 'Sending...' : 'Request Refill'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LabResultsDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [labResults, setLabResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  const fetchLabResults = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/lab-reports?patientId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setLabResults(data.labResults || [])
      }
    } catch (error) {
      console.error('Failed to fetch lab results:', error)
      setLabResults([
        {
          id: '1',
          test_name: 'Complete Blood Count',
          test_date: '2024-01-15',
          status: 'completed',
          abnormal_flags: null,
          lab_name: 'Quest Diagnostics'
        },
        {
          id: '2', 
          test_name: 'Lipid Panel',
          test_date: '2024-01-10',
          status: 'reviewed',
          abnormal_flags: 'High cholesterol',
          lab_name: 'LabCorp'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (open) {
      fetchLabResults()
    }
  }, [open, user])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Lab Results
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">View your recent laboratory test results</p>
        </DialogHeader>
        <div className="space-y-4 pt-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colorValues.primary }}></div>
            </div>
          ) : labResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No lab results available</p>
            </div>
          ) : (
            labResults.map((result) => (
              <div key={result.id} className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{result.test_name}</h4>
                    <p className="text-sm text-muted-foreground">{result.lab_name}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={result.status === 'completed' ? 'default' : result.status === 'reviewed' ? 'secondary' : 'outline'} className="text-xs">
                      {result.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(result.test_date).toLocaleDateString()}</p>
                  </div>
                </div>
                {result.abnormal_flags && (
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded text-xs">
                    <span className="font-medium text-orange-800 dark:text-orange-200">Note: </span>
                    <span className="text-orange-700 dark:text-orange-300">{result.abnormal_flags}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-3 pt-4 border-t border-border/10">
          <Button 
            variant="outline" 
            className="flex-1 h-11 border-border/50" 
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

