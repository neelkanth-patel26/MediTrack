'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTheme } from '@/lib/theme-context'
import { Users, Stethoscope, Shield, Hospital } from 'lucide-react'

export function AddDoctorDialog({ children, onDoctorAdded }: { children: React.ReactNode, onDoctorAdded?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    phone: ''
  })
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.specialization) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/doctors/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setOpen(false)
        setFormData({ firstName: '', lastName: '', email: '', specialization: '', phone: '' })
        onDoctorAdded?.()
        alert('Doctor added successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add doctor')
      }
    } catch (error) {
      console.error('Error adding doctor:', error)
      alert('Error adding doctor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Smith" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="doctor@hospital.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              placeholder="+1 (555) 123-4567" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white flex-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Doctor'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AddPatientDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Jane" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="patient@email.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="30" />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+1 (555) 123-4567" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1">
              Add Patient
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SendAlertDialog({ children, onAlertSent }: { children: React.ReactNode, onAlertSent?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    alertType: '',
    title: '',
    message: '',
    recipients: ''
  })
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  const handleSubmit = async () => {
    if (!formData.alertType || !formData.title || !formData.message) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setOpen(false)
        setFormData({ alertType: '', title: '', message: '', recipients: '' })
        onAlertSent?.()
        alert('Alert sent successfully!')
      } else {
        alert('Failed to send alert')
      }
    } catch (error) {
      console.error('Error sending alert:', error)
      alert('Error sending alert')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send System Alert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="alertType">Alert Type</Label>
            <Select value={formData.alertType} onValueChange={(value) => setFormData({...formData, alertType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">Alert Title</Label>
            <Input 
              id="title" 
              placeholder="System maintenance scheduled" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Describe the alert details..." 
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="recipients">Recipients</Label>
            <Select value={formData.recipients} onValueChange={(value) => setFormData({...formData, recipients: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="doctors">Doctors Only</SelectItem>
                <SelectItem value="patients">Patients Only</SelectItem>
                <SelectItem value="admins">Admins Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white flex-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Alert'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ReplyMessageDialog({ children, message }: { 
  children: React.ReactNode
  message: any
}) {
  const [open, setOpen] = useState(false)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()
  const [formData, setFormData] = useState({
    to: message?.email || '',
    subject: `Re: ${message?.subject || ''}`,
    message: ''
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to {message?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="to">To</Label>
            <Input 
              id="to" 
              value={formData.to}
              onChange={(e) => setFormData({...formData, to: e.target.value})}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={5}
              placeholder="Type your reply..."
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white flex-1"
              onClick={() => {
                alert(`Reply sent to ${message?.name}\nSubject: ${formData.subject}\nMessage: ${formData.message}`)
                setOpen(false)
              }}
            >
              Send Reply
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function EditItemDialog({ children, title, data, onSave }: { 
  children: React.ReactNode
  title: string
  data: any
  onSave?: (data: any) => void
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(data)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  const handleSave = () => {
    onSave?.(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
              <Input 
                id={key}
                value={String(value)}
                onChange={(e) => setFormData({...formData, [key]: e.target.value})}
              />
            </div>
          ))}
          <div className="flex gap-2 pt-4">
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CreateAnnouncementDialog({ children, onAnnouncementCreated }: { children: React.ReactNode, onAnnouncementCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    audience: 'all'
  })
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setOpen(false)
        setFormData({ title: '', content: '', priority: 'medium', audience: 'all' })
        onAnnouncementCreated?.()
        alert('Announcement created successfully!')
      } else {
        alert('Failed to create announcement')
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert('Error creating announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-5 w-5" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <div>Create Announcement</div>
              <div className="text-sm text-muted-foreground font-normal">Broadcast a message to users</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-sm font-semibold">Title *</Label>
            <Input 
              id="title" 
              placeholder="Enter announcement title" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1.5 h-11"
            />
          </div>
          <div>
            <Label htmlFor="content" className="text-sm font-semibold">Content *</Label>
            <Textarea 
              id="content" 
              placeholder="Write your announcement message here..." 
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="mt-1.5 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority" className="text-sm font-semibold">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger className="mt-1.5 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low Priority</SelectItem>
                  <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                  <SelectItem value="high">🔴 High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audience" className="text-sm font-semibold">Target Audience</Label>
              <Select value={formData.audience} onValueChange={(value) => setFormData({...formData, audience: value})}>
                <SelectTrigger className="mt-1.5 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>All Users</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="doctors">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      <span>Doctors Only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="patients">
                    <div className="flex items-center gap-2">
                      <Hospital className="h-4 w-4" />
                      <span>Patients Only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Staff Only</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white flex-1 h-11"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="h-11 px-8">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export function ScheduleAppointmentDialog({ children, onAppointmentScheduled }: { 
  children: React.ReactNode
  onAppointmentScheduled?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '30',
    appointmentType: 'consultation',
    condition: '',
    notes: ''
  })
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  const fetchDoctorsAndPatients = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        fetch('/api/admin/doctors'),
        fetch('/api/admin/patients')
      ])
      
      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json()
        setDoctors(doctorsData.doctors || [])
      }
      
      if (patientsRes.ok) {
        const patientsData = await patientsRes.json()
        setPatients(patientsData.patients || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSchedule = async () => {
    if (!formData.doctorId || !formData.patientId || !formData.appointmentDate || !formData.appointmentTime) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setOpen(false)
        setFormData({
          doctorId: '',
          patientId: '',
          appointmentDate: '',
          appointmentTime: '',
          duration: '30',
          appointmentType: 'consultation',
          condition: '',
          notes: ''
        })
        onAppointmentScheduled?.()
        alert('Appointment scheduled successfully!')
      } else {
        alert('Failed to schedule appointment')
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      alert('Error scheduling appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (isOpen) fetchDoctorsAndPatients()
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <svg className="h-5 w-5" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-foreground">Schedule New Appointment</div>
                <div className="text-sm text-muted-foreground font-normal">Create a new appointment for a patient</div>
              </div>
            </DialogTitle>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Patient & Doctor Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient *</Label>
                  <Select value={formData.patientId} onValueChange={(value) => setFormData({...formData, patientId: value})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.user_id}>{p.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Doctor *</Label>
                  <Select value={formData.doctorId} onValueChange={(value) => setFormData({...formData, doctorId: value})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(d => (
                        <SelectItem key={d.id} value={d.user_id}>{d.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date *</Label>
                  <Input type="date" value={formData.appointmentDate} onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} className="mt-1.5" />
                </div>
                <div>
                  <Label>Time *</Label>
                  <Input type="time" value={formData.appointmentTime} onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label>Condition</Label>
                <Input value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="mt-1.5" />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="mt-1.5" rows={3} />
              </div>
            </div>
          </div>
          <div className="p-6 border-t flex gap-3">
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1" onClick={handleSchedule} disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function EditAppointmentDialog({ children, appointment, onAppointmentUpdated }: { 
  children: React.ReactNode
  appointment: any
  onAppointmentUpdated?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: appointment?.status || 'pending',
    date: appointment?.date || '',
    time: appointment?.time || '',
    notes: appointment?.notes || ''
  })
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  useEffect(() => {
    if (appointment) {
      setFormData({
        status: appointment.status,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes
      })
    }
  }, [appointment])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setOpen(false)
        onAppointmentUpdated?.()
        alert('Appointment updated successfully!')
      } else {
        alert('Failed to update appointment')
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      alert('Error updating appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-5 w-5" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <div>Edit Appointment</div>
              <div className="text-sm text-muted-foreground font-normal">{appointment?.patient} - {appointment?.doctor}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="mt-1.5" />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="mt-1.5" rows={4} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1" onClick={handleUpdate} disabled={loading}>
              {loading ? 'Updating...' : 'Update Appointment'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SystemAlertsDialog({ children, alerts, onAlertDeleted }: { 
  children: React.ReactNode
  alerts: any[]
  onAlertDeleted?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [localAlerts, setLocalAlerts] = useState(alerts)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  useEffect(() => {
    setLocalAlerts(alerts)
  }, [alerts])

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/admin/alerts?id=${alertId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setLocalAlerts(prev => prev.filter(a => a.id !== alertId))
        onAlertDeleted?.()
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-900 dark:text-red-100', icon: 'text-red-600' }
      case 'high': return { bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-900 dark:text-orange-100', icon: 'text-orange-600' }
      case 'medium': return { bg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-900 dark:text-yellow-100', icon: 'text-yellow-600' }
      default: return { bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-900 dark:text-blue-100', icon: 'text-blue-600' }
    }
  }

  const criticalCount = localAlerts.filter(a => a.severity === 'critical').length
  const highCount = localAlerts.filter(a => a.severity === 'high').length
  const mediumCount = localAlerts.filter(a => a.severity === 'medium').length
  const lowCount = localAlerts.filter(a => a.severity === 'low').length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
          {/* Header */}
          <div className="px-6 py-5 border-b bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <svg className="h-6 w-6" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3l-6.928-12c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="text-foreground">System Alerts</div>
                <div className="text-sm text-muted-foreground font-normal">{localAlerts.length} active alerts</div>
              </div>
            </DialogTitle>
          </div>

          {/* Stats Overview */}
          <div className="px-6 py-4 border-b bg-muted/30">
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className="text-xs font-semibold text-red-600 uppercase mb-1">Critical</div>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100">{criticalCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                <div className="text-xs font-semibold text-orange-600 uppercase mb-1">High</div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{highCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <div className="text-xs font-semibold text-yellow-600 uppercase mb-1">Medium</div>
                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{mediumCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Low</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{lowCount}</div>
              </div>
            </div>
          </div>
          
          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {localAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-1">All Clear!</p>
                  <p className="text-sm text-muted-foreground">No active system alerts</p>
                </div>
              ) : (
                localAlerts.map((alert, i) => {
                  const colors = getSeverityColor(alert.severity)
                  return (
                    <div key={i} className={`group p-5 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-200`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3l-6.928-12c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors.text}`}>
                              {alert.severity}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.text} bg-white/50 dark:bg-black/20`}>
                              {alert.type}
                            </span>
                          </div>
                          <p className={`text-base font-semibold ${colors.text} mb-2`}>{alert.message}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{alert.time}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20"
                        >
                          <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Last updated: {localAlerts.length > 0 ? localAlerts[0].time : 'N/A'}
              </div>
              <Button variant="outline" onClick={() => setOpen(false)} className="h-10 px-6 rounded-xl font-medium">
                Close
              </Button>
            </div>
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
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  const formatKey = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  const formatValue = (key: string, value: any) => {
    if (key === 'status') {
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'confirmed' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'completed' ? 'bg-blue-100 text-blue-800' :
          value === 'new' ? 'bg-red-100 text-red-800' :
          value === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
          value === 'resolved' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {String(value).charAt(0).toUpperCase() + String(value).slice(1).replace('-', ' ')}
        </span>
      )
    }
    if (key === 'priority') {
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'high' ? 'bg-red-100 text-red-800' :
          value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          value === 'low' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {String(value).toUpperCase()}
        </span>
      )
    }
    if (key === 'formattedDate' || key === 'created_at') {
      return (
        <span className="font-medium" style={{ color: colorValues.primary }}>
          {new Date(String(value)).toLocaleString()}
        </span>
      )
    }
    return String(value)
  }

  const getIcon = (key: string) => {
    switch (key) {
      case 'name':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      case 'email':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" /></svg>
      case 'phone':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      case 'subject':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
      case 'category':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
      case 'priority':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
      case 'patient':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      case 'doctor':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      case 'time':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      case 'date':
      case 'formattedDate':
      case 'created_at':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      case 'type':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      case 'status':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      case 'message':
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      default:
        return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
  }

  // Check if this is a contact message
  const isContactMessage = data.hasOwnProperty('message') && data.hasOwnProperty('email')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[85vw] max-w-[1400px] h-[90vh] p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <svg className="h-5 w-5" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isContactMessage ? "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" : "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"} />
                </svg>
              </div>
              <div>
                <div className="text-foreground">{title}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {isContactMessage ? 'Contact message details' : 'View details'}
                </div>
              </div>
            </DialogTitle>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {isContactMessage ? (
                <div className="space-y-6">
                  {/* Header Card with Sender Info */}
                  <div className="relative overflow-hidden rounded-2xl border shadow-lg" style={{ borderColor: `${colorValues.primary}30`, background: `linear-gradient(135deg, ${colorValues.primary}08 0%, transparent 100%)` }}>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${colorValues.primary} 0%, ${colorValues.primary}dd 100%)` }}>
                            {data.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">{data.name}</h3>
                            <div className="flex flex-col gap-2 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" /></svg>
                                <span className="text-sm font-medium">{data.email}</span>
                              </div>
                              {data.phone && (
                                <div className="flex items-center gap-2">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                  <span className="text-sm font-medium">{data.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {data.status && formatValue('status', data.status)}
                          {data.priority && formatValue('priority', data.priority)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Details Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {data.subject && (
                      <div className="col-span-2 p-5 rounded-xl border bg-card shadow-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Subject</div>
                        <div className="text-lg font-semibold text-foreground">{data.subject}</div>
                      </div>
                    )}
                    {data.category && (
                      <div className="p-5 rounded-xl border bg-card shadow-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Category</div>
                        <div className="text-lg font-semibold text-foreground capitalize">{data.category}</div>
                      </div>
                    )}
                    {data.created_at && (
                      <div className="col-span-3 p-5 rounded-xl border bg-card shadow-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Received</div>
                        <div className="text-base font-semibold" style={{ color: colorValues.primary }}>{new Date(data.created_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</div>
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  {data.message && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: `${colorValues.primary}15` }}>
                          <svg className="h-5 w-5" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Message</h3>
                      </div>
                      <div className="p-6 rounded-2xl border bg-muted/30 shadow-md" style={{ borderColor: `${colorValues.primary}20` }}>
                        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">{data.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(data)
                    .filter(([key]) => key !== 'id')
                    .map(([key, value]) => (
                    <div key={key} className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15`, color: colorValues.primary }}>
                          {getIcon(key)}
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                          {formatKey(key)}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-foreground break-words">
                        {formatValue(key, value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setOpen(false)} className="h-10 px-6 rounded-xl font-medium">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}