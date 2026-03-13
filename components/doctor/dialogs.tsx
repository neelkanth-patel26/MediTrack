'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, User, Activity, AlertCircle, FileText, Download, Pill } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export function AddPatientDialog({ children, onPatientAdded }: { 
  children: React.ReactNode
  onPatientAdded?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'new' | 'existing'>('new')
  const [existingPatients, setExistingPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    allergies: ''
  })

  useEffect(() => {
    if (open && mode === 'existing') {
      fetchExistingPatients()
    }
  }, [open, mode])

  const fetchExistingPatients = async () => {
    try {
      const response = await fetch(`/api/patients/available?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setExistingPatients(data.patients || [])
      }
    } catch (error) {
      console.error('Error fetching existing patients:', error)
    }
  }

  const handleSubmit = async () => {
    if (mode === 'new') {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Please fill in all required fields')
        return
      }
    } else {
      if (!selectedPatient) {
        toast.error('Please select a patient')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'new') {
        const response = await fetch('/api/doctor/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, doctorId: user?.id })
        })
        
        if (response.ok) {
          toast.success('Patient added successfully')
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            gender: '',
            bloodType: '',
            allergies: ''
          })
          setOpen(false)
          onPatientAdded?.()
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to add patient')
        }
      } else {
        // Add existing patient
        const response = await fetch('/api/doctor/patients/add-existing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            patientId: selectedPatient,
            doctorId: user?.id 
          })
        })
        
        if (response.ok) {
          toast.success('Patient added to your list')
          setSelectedPatient('')
          setOpen(false)
          onPatientAdded?.()
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to add patient')
        }
      }
    } catch (error) {
      toast.error('Failed to add patient')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-6 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <User className="h-5 w-5" style={{ color: colorValues.primary }} />
            </div>
            <div>
              <div>Add Patient</div>
              <div className="text-xs font-normal text-muted-foreground">
                Add a new patient or select existing
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-6">
          {/* Mode Selector */}
          <div className="flex gap-1 p-1 bg-muted/30 rounded-xl border border-border/50">
            <Button
              variant={mode === 'new' ? 'default' : 'ghost'}
              size="sm"
              className={`flex-1 h-10 rounded-lg font-medium transition-all duration-200 ${
                mode === 'new' 
                  ? 'text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              onClick={() => setMode('new')}
              style={mode === 'new' ? { backgroundColor: colorValues.primary } : {}}
            >
              <User className="h-4 w-4 mr-2" />
              New Patient
            </Button>
            <Button
              variant={mode === 'existing' ? 'default' : 'ghost'}
              size="sm"
              className={`flex-1 h-10 rounded-lg font-medium transition-all duration-200 ${
                mode === 'existing' 
                  ? 'text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              onClick={() => setMode('existing')}
              style={mode === 'existing' ? { backgroundColor: colorValues.primary } : {}}
            >
              <User className="h-4 w-4 mr-2" />
              Existing Patient
            </Button>
          </div>

          {mode === 'new' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jane" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="h-9"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="patient@email.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-9"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 123-4567" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    type="date" 
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="h-9"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bloodType" className="text-sm font-medium">Blood Type</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => setFormData({...formData, bloodType: value})}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="allergies" className="text-sm font-medium">Allergies</Label>
                <Textarea 
                  id="allergies" 
                  placeholder="List any known allergies..." 
                  rows={2}
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  className="resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="existingPatient" className="text-sm font-medium">Select Patient *</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="h-11 border-2 border-border/50 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Choose from existing patients..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {existingPatients.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No available patients found</p>
                        <p className="text-xs">All patients may already be in your list</p>
                      </div>
                    ) : (
                      existingPatients.map((patient) => (
                        <SelectItem key={patient.id} value={String(patient.id)} className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: colorValues.primary }}>
                              {patient.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-xs text-muted-foreground">{patient.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPatient && (
                <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: colorValues.primary }}>
                      {existingPatients.find(p => String(p.id) === selectedPatient)?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {existingPatients.find(p => String(p.id) === selectedPatient)?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {existingPatients.find(p => String(p.id) === selectedPatient)?.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-3 pt-6 border-t border-border/10">
          <Button 
            variant="outline" 
            className="flex-1 h-9" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: colorValues.primary }} 
            className="text-white flex-1 h-9"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Adding...' : `Add ${mode === 'new' ? 'New' : 'Existing'} Patient`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CreatePrescriptionDialog({ children, onPrescriptionCreated, prefillData }: { 
  children: React.ReactNode
  onPrescriptionCreated?: () => void
  prefillData?: {
    patientId?: string
    condition?: string
    treatmentRecommendations?: string[]
  }
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [showVerification, setShowVerification] = useState(false)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()
  const [formData, setFormData] = useState({
    patientId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refills: 0
  })

  useEffect(() => {
    if (open && user?.id) {
      fetchPatients()
    }
  }, [open, user?.id])

  useEffect(() => {
    // Pre-fill form with AI diagnosis data when prefillData changes
    if (prefillData && open) {
      setFormData(prev => ({
        ...prev,
        patientId: prefillData.patientId || prev.patientId,
        instructions: prefillData.condition ? `For treatment of: ${prefillData.condition}` : prev.instructions
      }))
      
      // Auto-suggest medication based on treatment recommendations
      if (prefillData.treatmentRecommendations && prefillData.treatmentRecommendations.length > 0) {
        const firstRecommendation = prefillData.treatmentRecommendations[0].toLowerCase()
        let suggestedMed = ''
        let suggestedDosage = ''
        let suggestedFrequency = 'Twice daily'
        
        if (firstRecommendation.includes('antibiotic') || firstRecommendation.includes('amoxicillin')) {
          suggestedMed = 'Amoxicillin'
          suggestedDosage = '500mg'
          suggestedFrequency = 'Three times daily'
        } else if (firstRecommendation.includes('pain') || firstRecommendation.includes('ibuprofen')) {
          suggestedMed = 'Ibuprofen'
          suggestedDosage = '400mg'
          suggestedFrequency = 'As needed'
        } else if (firstRecommendation.includes('blood pressure') || firstRecommendation.includes('ace inhibitor')) {
          suggestedMed = 'Lisinopril'
          suggestedDosage = '10mg'
          suggestedFrequency = 'Once daily'
        }
        
        if (suggestedMed) {
          setFormData(prev => ({
            ...prev,
            medicationName: suggestedMed,
            dosage: suggestedDosage,
            frequency: suggestedFrequency,
            duration: '7 days'
          }))
        }
      }
    }
  }, [prefillData, open])

  const fetchPatients = async () => {
    try {
      const response = await fetch(`/api/doctor/patients?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.medicationName || !formData.dosage || !formData.frequency) {
      toast.error('Please fill in all required fields')
      return
    }

    // Show verification step first
    if (!showVerification) {
      setShowVerification(true)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/doctor/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          doctorId: user?.id
        })
      })

      if (response.ok) {
        toast.success('Prescription created successfully')
        setFormData({
          patientId: '',
          medicationName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          refills: 0
        })
        setShowVerification(false)
        setOpen(false)
        onPrescriptionCreated?.()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create prescription')
      }
    } catch (error) {
      toast.error('Failed to create prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-6 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-5 w-5" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <div>Create Prescription</div>
              <div className="text-xs font-normal text-muted-foreground">
                Issue a new prescription for your patient
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-6">
          {showVerification ? (
            /* Verification View */
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">Please verify prescription details</span>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Review all information carefully before confirming. This prescription will be sent to the patient.
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Patient</h4>
                  <p className="text-sm text-muted-foreground">
                    {patients.find(p => p.id === formData.patientId)?.name} ({patients.find(p => p.id === formData.patientId)?.patientId})
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Medication</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {formData.medicationName}</p>
                    <p><strong>Dosage:</strong> {formData.dosage}</p>
                    <p><strong>Frequency:</strong> {formData.frequency}</p>
                    <p><strong>Duration:</strong> {formData.duration}</p>
                    <p><strong>Refills:</strong> {formData.refills}</p>
                  </div>
                </div>
                
                {formData.instructions && (
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Instructions</h4>
                    <p className="text-sm text-muted-foreground">{formData.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Form View */
            <>
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient" className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" style={{ color: colorValues.primary }} />
              Patient *
            </Label>
            <Select value={formData.patientId} onValueChange={(value) => setFormData({...formData, patientId: value})}>
              <SelectTrigger className="h-11 border-2 border-border/50 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Select patient from your list..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {patients.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No patients found</p>
                    <p className="text-xs">Add patients to your list first</p>
                  </div>
                ) : (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id} className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: colorValues.primary }}>
                          {patient.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">{patient.patientId}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Medication Information */}
          <div className="p-4 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-5 w-5" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="font-medium text-foreground">Medication Details</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medication" className="text-sm font-medium">Medication Name *</Label>
                <Input 
                  id="medication" 
                  placeholder="e.g., Lisinopril, Metformin, Amoxicillin" 
                  value={formData.medicationName}
                  onChange={(e) => setFormData({...formData, medicationName: e.target.value})}
                  className="h-10 border-2 border-border/50 focus:border-primary/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="dosage" className="text-sm font-medium">Dosage *</Label>
                  <Input 
                    id="dosage" 
                    placeholder="e.g., 10mg, 500mg" 
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    className="h-10 border-2 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-sm font-medium">Frequency *</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                    <SelectTrigger className="h-10 border-2 border-border/50 hover:border-primary/50">
                      <SelectValue placeholder="How often?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once daily">Once daily</SelectItem>
                      <SelectItem value="Twice daily">Twice daily (BID)</SelectItem>
                      <SelectItem value="Three times daily">Three times daily (TID)</SelectItem>
                      <SelectItem value="Four times daily">Four times daily (QID)</SelectItem>
                      <SelectItem value="As needed">As needed (PRN)</SelectItem>
                      <SelectItem value="Every 4 hours">Every 4 hours</SelectItem>
                      <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                      <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                      <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="p-4 rounded-lg border border-border/30 bg-muted/20">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-5 w-5" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium text-foreground">Additional Information</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
                  <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Treatment length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7 days">7 days</SelectItem>
                      <SelectItem value="10 days">10 days</SelectItem>
                      <SelectItem value="14 days">14 days</SelectItem>
                      <SelectItem value="30 days">30 days</SelectItem>
                      <SelectItem value="60 days">60 days</SelectItem>
                      <SelectItem value="90 days">90 days</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refills" className="text-sm font-medium">Refills Allowed</Label>
                  <Select value={String(formData.refills)} onValueChange={(value) => setFormData({...formData, refills: parseInt(value)})}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Number of refills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - No refills</SelectItem>
                      <SelectItem value="1">1 refill</SelectItem>
                      <SelectItem value="2">2 refills</SelectItem>
                      <SelectItem value="3">3 refills</SelectItem>
                      <SelectItem value="5">5 refills</SelectItem>
                      <SelectItem value="6">6 refills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-sm font-medium">Special Instructions</Label>
                <Textarea 
                  id="instructions" 
                  placeholder="e.g., Take with food, avoid alcohol, take on empty stomach, may cause drowsiness..." 
                  rows={3} 
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  className="resize-none border-2 border-border/50 focus:border-primary/50"
                />
              </div>
            </div>
          </div>
            </>
          )}
        </div>
        
        <div className="flex gap-3 pt-6 border-t border-border/10">
          <Button 
            variant="outline" 
            className="flex-1 h-10" 
            onClick={() => {
              setOpen(false)
              setShowVerification(false)
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          {showVerification ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1 h-10" 
                onClick={() => setShowVerification(false)}
                disabled={loading}
              >
                Back to Edit
              </Button>
              <Button 
                style={{ backgroundColor: colorValues.primary }} 
                className="text-white flex-1 h-10 font-medium"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm & Save
                  </div>
                )}
              </Button>
            </>
          ) : (
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white flex-1 h-10 font-medium"
              onClick={handleSubmit}
              disabled={loading}
            >
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Review Prescription
              </div>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SendMessageDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()
  const [formData, setFormData] = useState({
    recipientId: '',
    subject: '',
    content: '',
    messageType: 'general'
  })

  useEffect(() => {
    if (open && user?.id) {
      fetchPatients()
    }
  }, [open, user?.id])

  const fetchPatients = async () => {
    try {
      const response = await fetch(`/api/doctor/patients?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.recipientId || !formData.subject || !formData.content) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          senderId: user?.id
        })
      })

      if (response.ok) {
        toast.success('Message sent successfully')
        setFormData({
          recipientId: '',
          subject: '',
          content: '',
          messageType: 'general'
        })
        setOpen(false)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send message')
      }
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient *</Label>
            <Select value={formData.recipientId} onValueChange={(value) => setFormData({...formData, recipientId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} ({patient.patientId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="messageType">Message Type</Label>
            <Select value={formData.messageType} onValueChange={(value) => setFormData({...formData, messageType: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_result">Lab Result</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input 
              id="subject" 
              placeholder="Message subject" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea 
              id="message" 
              placeholder="Type your message..." 
              rows={4} 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white flex-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
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
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()
  const [formData, setFormData] = useState({
    date: appointment.date,
    time: appointment.time,
    duration: appointment.duration,
    type: appointment.type,
    condition: appointment.condition,
    status: appointment.status,
    notes: appointment.notes || ''
  })

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/doctor/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
          ...formData,
          doctorId: user?.id
        })
      })
      
      if (response.ok) {
        toast.success('Appointment updated successfully')
        setOpen(false)
        onAppointmentUpdated?.()
      } else {
        toast.error('Failed to update appointment')
      }
    } catch (error) {
      toast.error('Failed to update appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
      setLoading(true)
      try {
        const response = await fetch('/api/doctor/appointments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointmentId: appointment.id,
            status: 'cancelled',
            doctorId: user?.id
          })
        })
        
        if (response.ok) {
          toast.success('Appointment cancelled successfully')
          setOpen(false)
          onAppointmentUpdated?.()
        } else {
          toast.error('Failed to cancel appointment')
        }
      } catch (error) {
        toast.error('Failed to cancel appointment')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <svg className="h-4 w-4" style={{ color: colorValues.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <div>Edit Appointment</div>
              <div className="text-xs font-normal text-muted-foreground">
                {appointment.patient}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="date" className="text-xs font-medium">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="time" className="text-xs font-medium">Time</Label>
              <Input 
                id="time" 
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="h-9"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="duration" className="text-xs font-medium">Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 min">15 min</SelectItem>
                  <SelectItem value="30 min">30 min</SelectItem>
                  <SelectItem value="45 min">45 min</SelectItem>
                  <SelectItem value="60 min">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="h-9">
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
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="type" className="text-xs font-medium">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Check-up">Check-up</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="condition" className="text-xs font-medium">Condition</Label>
            <Input 
              id="condition" 
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
              placeholder="Patient condition"
              className="h-9"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
            <Textarea 
              id="notes" 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={2}
              placeholder="Additional notes..."
              className="resize-none"
            />
          </div>
        </div>
        
        <div className="flex gap-2 pt-4 border-t border-border/10">
          <Button 
            variant="outline" 
            className="flex-1 h-9" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            className="h-9"
            onClick={handleCancel}
            disabled={loading || appointment.status === 'cancelled'}
          >
            {loading ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
          <Button 
            style={{ backgroundColor: colorValues.primary }} 
            className="text-white flex-1 h-9"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
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
  const [patientReports, setPatientReports] = useState<any[]>([])
  const [loadingReports, setLoadingReports] = useState(false)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  // Fetch patient reports when dialog opens and it's a patient profile
  useEffect(() => {
    if (open && title.includes('Patient:') && data.id && user?.id) {
      fetchPatientReports()
    }
    // Fetch announcements when dialog opens and it's alerts/announcements
    if (open && (title.includes('Alerts') || title.includes('Announcements'))) {
      fetchAnnouncements()
    }
  }, [open, data.id, user?.id, title])

  const fetchPatientReports = async () => {
    setLoadingReports(true)
    try {
      const response = await fetch(`/api/doctor/patient-reports?patientId=${data.id}&doctorId=${user?.id}`)
      if (response.ok) {
        const result = await response.json()
        setPatientReports(result.reports || [])
      }
    } catch (error) {
      console.error('Error fetching patient reports:', error)
    } finally {
      setLoadingReports(false)
    }
  }

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true)
    try {
      const response = await fetch('/api/doctor/announcements')
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

  // Handle multiple appointments view
  if (data.allAppointments) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-2xl bg-background/95 border border-border/30 shadow-xl rounded-xl">
          <DialogHeader className="pb-6 border-b border-border/10">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <Calendar className="h-5 w-5" style={{ color: colorValues.primary }} />
              </div>
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-6 max-h-96 overflow-y-auto">
            {data.allAppointments.map((apt: any, index: number) => (
              <div key={apt.id || index} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}10` }}>
                      <User className="h-4 w-4" style={{ color: colorValues.primary }} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{apt.patient}</div>
                      <div className="text-sm text-muted-foreground">{apt.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Clock className="h-3 w-3" />
                      {apt.time}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      apt.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-500' :
                        apt.status === 'pending' ? 'bg-yellow-500' :
                        apt.status === 'completed' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}></div>
                      {apt.status}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Condition:</strong> {apt.condition}
                </div>
                {apt.notes && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <strong>Notes:</strong> {apt.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-6 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              {title.includes('📅') || title.toLowerCase().includes('appointment') ? (
                <Calendar className="h-5 w-5" style={{ color: colorValues.primary }} />
              ) : (
                <User className="h-5 w-5" style={{ color: colorValues.primary }} />
              )}
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient
              </div>
              <div className="text-foreground font-medium">{data.patient}</div>
            </div>
            {data.patientId && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2" />
                  </svg>
                  Patient ID
                </div>
                <div className="text-foreground">{data.patientId}</div>
              </div>
            )}
          </div>
          
          {/* Status */}
          {data.status && (
            <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: `${colorValues.primary}08` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <Activity className="h-5 w-5" style={{ color: colorValues.primary }} />
              </div>
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  data.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  data.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                  data.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    data.status === 'confirmed' ? 'bg-green-500' :
                    data.status === 'pending' ? 'bg-orange-500' :
                    data.status === 'completed' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}></div>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Status</div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Date */}
            <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: `${colorValues.primary}08` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <Calendar className="h-5 w-5" style={{ color: colorValues.primary }} />
              </div>
              <div>
                <div className="font-medium text-foreground">
                  {data.formattedDate || (data.date ? new Date(data.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'No date available')}
                </div>
                <div className="text-sm text-muted-foreground">Date</div>
              </div>
            </div>
            
            {/* Time & Duration */}
            {data.time && (
              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: `${colorValues.primary}08` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                  <Clock className="h-5 w-5" style={{ color: colorValues.primary }} />
                </div>
                <div>
                  <div className="font-medium text-foreground">{data.time} {data.duration && `(${data.duration})`}</div>
                  <div className="text-sm text-muted-foreground">Time & Duration</div>
                </div>
              </div>
            )}
            
            {/* Type */}
            {data.type && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Appointment Type
                </div>
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: `${colorValues.primary}05` }}>
                  {data.type}
                </div>
              </div>
            )}
            
            {/* Condition */}
            {data.condition && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Condition
                </div>
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: `${colorValues.primary}05` }}>
                  {data.condition}
                </div>
              </div>
            )}
            
            {/* Contact Info */}
            {(data.phone || data.email) && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Information
                </div>
                <div className="p-3 rounded-lg text-sm space-y-1" style={{ backgroundColor: `${colorValues.primary}05` }}>
                  {data.phone && <div><strong>Phone:</strong> {data.phone}</div>}
                  {data.email && <div><strong>Email:</strong> {data.email}</div>}
                </div>
              </div>
            )}
            
            {/* Notes */}
            {data.notes && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Notes
                </div>
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: `${colorValues.primary}05` }}>
                  {data.notes}
                </div>
              </div>
            )}
            
            {/* Revenue Information */}
            {(data.totalRevenue !== undefined || data.doctorEarnings !== undefined || data.adminCut !== undefined) && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Revenue Information
                </div>
                <div className="p-3 rounded-lg text-sm space-y-2" style={{ backgroundColor: `${colorValues.primary}05` }}>
                  {data.totalRevenue !== undefined && <div><strong>Total Revenue:</strong> ${data.totalRevenue}</div>}
                  {data.doctorEarnings !== undefined && <div><strong>Your Earnings (80%):</strong> ${data.doctorEarnings}</div>}
                  {data.adminCut !== undefined && <div><strong>Admin Cut (20%):</strong> ${data.adminCut}</div>}
                </div>
              </div>
            )}
            
            {/* Appointment Statistics */}
            {(data.totalAppointments !== undefined || data.completed !== undefined || data.remaining !== undefined) && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Appointment Statistics
                </div>
                <div className="p-3 rounded-lg text-sm space-y-2" style={{ backgroundColor: `${colorValues.primary}05` }}>
                  {data.totalAppointments !== undefined && <div><strong>Total Appointments:</strong> {data.totalAppointments}</div>}
                  {data.completed !== undefined && <div><strong>Completed:</strong> {data.completed}</div>}
                  {data.remaining !== undefined && <div><strong>Remaining:</strong> {data.remaining}</div>}
                  {data.nextPatient && <div><strong>Next Patient:</strong> {data.nextPatient}</div>}
                </div>
              </div>
            )}
            
            {/* Patient Report History */}
            {title.includes('Patient:') && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Report History
                </div>
                {loadingReports ? (
                  <div className="p-4 rounded-lg border border-dashed border-muted-foreground/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin"></div>
                      Loading reports...
                    </div>
                  </div>
                ) : patientReports.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {patientReports.map((report) => (
                      <LabReportDetailsDialog key={report.id} report={{
                        ...report,
                        patientName: data.name || data.patient
                      }}>
                        <div className="p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{report.testName}</span>
                            <div className="flex items-center gap-2">
                              {report.uploadedBy === 'patient' && (
                                <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  Patient Upload
                                </div>
                              )}
                              <div className={`px-2 py-1 rounded-full text-xs ${
                                report.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                                report.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {report.status}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{report.reportType}</span>
                            <span>{report.testDate}</span>
                          </div>
                        </div>
                      </LabReportDetailsDialog>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-dashed border-muted-foreground/30 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No reports available</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Announcements Section */}
            {(title.includes('Alerts') || title.includes('Announcements')) && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  Announcements
                </div>
                {loadingAnnouncements ? (
                  <div className="p-4 rounded-lg border border-dashed border-muted-foreground/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin"></div>
                      Loading announcements...
                    </div>
                  </div>
                ) : announcements.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
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
                ) : (
                  <div className="p-4 rounded-lg border border-dashed border-muted-foreground/30 text-center">
                    <svg className="h-8 w-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">No announcements available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PrescriptionDetailsDialog({ children, prescription }: { 
  children: React.ReactNode
  prescription: any
}) {
  const [open, setOpen] = useState(false)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  const downloadPrescriptionPDF = () => {
    // Import jsPDF dynamically to avoid SSR issues
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      let yPosition = 25

      // Modern Header
      doc.setFillColor(248, 250, 252) // Light gray background
      doc.rect(0, 0, pageWidth, 35, 'F')
      
      doc.setTextColor(30, 41, 59) // Dark gray
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('PRESCRIPTION', margin, 20)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 116, 139) // Medium gray
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, 20)
      doc.text('MediTrack Healthcare', pageWidth - margin - 40, 30)
      
      yPosition = 55
      doc.setTextColor(0, 0, 0)
      
      // Patient Section
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(71, 85, 105)
      doc.text('PATIENT', margin, yPosition)
      yPosition += 8
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text(`${prescription.patientName}`, margin, yPosition)
      doc.text(`ID: ${prescription.patientId}`, margin + 80, yPosition)
      yPosition += 25
      
      // Medication Card
      doc.setFillColor(255, 255, 255) // White background
      doc.roundedRect(margin, yPosition - 8, pageWidth - 2 * margin, 40, 3, 3, 'F')
      doc.setDrawColor(251, 146, 60)
      doc.setLineWidth(0.5)
      doc.roundedRect(margin, yPosition - 8, pageWidth - 2 * margin, 40, 3, 3)
      
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(194, 65, 12) // Orange text
      doc.text(prescription.medicationName, margin + 8, yPosition + 5)
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text(`${prescription.dosage} • ${prescription.frequency}`, margin + 8, yPosition + 18)
      
      if (prescription.duration) {
        doc.text(`Duration: ${prescription.duration}`, margin + 8, yPosition + 28)
      }
      
      yPosition += 55
      
      // Details Grid
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(71, 85, 105)
      doc.text('REFILLS', margin, yPosition)
      doc.text('STATUS', margin + 60, yPosition)
      doc.text('ISSUED', margin + 120, yPosition)
      
      yPosition += 8
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text(String(prescription.refills), margin, yPosition)
      doc.text(prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1), margin + 60, yPosition)
      doc.text(new Date(prescription.issuedAt).toLocaleDateString(), margin + 120, yPosition)
      
      yPosition += 25
      
      // Instructions
      if (prescription.instructions) {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(71, 85, 105)
        doc.text('INSTRUCTIONS', margin, yPosition)
        yPosition += 10
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        const instructions = doc.splitTextToSize(prescription.instructions, pageWidth - 2 * margin)
        doc.text(instructions, margin, yPosition)
        yPosition += instructions.length * 4 + 15
      }
      
      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 25
      doc.setDrawColor(229, 231, 235)
      doc.setLineWidth(0.5)
      doc.line(margin, footerY, pageWidth - margin, footerY)
      
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(107, 114, 128)
      doc.text('This prescription was generated electronically', margin, footerY + 8)
      doc.text(`Prescription ID: ${prescription.id}`, margin, footerY + 15)
      
      // Save the PDF
      doc.save(`${prescription.medicationName}-${prescription.patientName}.pdf`)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl w-[95vw] h-[90vh] p-0 gap-0 rounded-xl overflow-hidden">
        <div className="h-full flex flex-col bg-background overflow-hidden">
          {/* Enhanced Header */}
          <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-background to-muted/30">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted shadow-sm">
                  <Pill className="h-6 w-6" style={{ color: colorValues.primary }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{prescription.medicationName}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{prescription.patientName}</span>
                    <span>•</span>
                    <span>{prescription.patientId}</span>
                    <span>•</span>
                    <span>{new Date(prescription.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  prescription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  prescription.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    prescription.status === 'active' ? 'bg-green-500' :
                    prescription.status === 'completed' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}></div>
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                </div>
                {prescription.refills === 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium">
                    <AlertCircle className="h-3 w-3" />
                    Renewal Needed
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {/* Content with improved layout */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div className="p-6 space-y-6">
              {/* Key Information Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5" style={{ color: colorValues.primary }} />
                    <h3 className="font-semibold text-foreground">Patient & Prescription Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Patient Name</label>
                        <p className="text-sm font-medium mt-1">{prescription.patientName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Medication</label>
                        <p className="text-sm font-medium mt-1">{prescription.medicationName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dosage</label>
                        <p className="text-sm font-medium mt-1">{prescription.dosage}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Patient ID</label>
                        <p className="text-sm font-medium mt-1">{prescription.patientId}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Frequency</label>
                        <p className="text-sm font-medium mt-1">{prescription.frequency}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Duration</label>
                        <p className="text-sm font-medium mt-1">{prescription.duration || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5" style={{ color: colorValues.primary }} />
                    <h3 className="font-semibold text-foreground">Prescription Status</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                        prescription.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' :
                        prescription.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          prescription.status === 'active' ? 'bg-green-500' :
                          prescription.status === 'completed' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}></div>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Refills Left:</span>
                        <span className={`text-sm font-medium ${
                          prescription.refills === 0 ? 'text-red-600' : 'text-foreground'
                        }`}>
                          {prescription.refills}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Issued:</span>
                        <span className="text-sm font-medium">{new Date(prescription.issuedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions Section */}
              {prescription.instructions && (
                <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5" style={{ color: colorValues.primary }} />
                    <h3 className="font-semibold text-foreground">Instructions</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {typeof prescription.instructions === 'string' ? (
                        prescription.instructions.split(/[.!?]+/).filter(sentence => sentence.trim()).map((sentence, index) => (
                          <p key={index} className="mb-2 last:mb-0">{sentence.trim()}.</p>
                        ))
                      ) : (
                        <p>{String(prescription.instructions)}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Prescription Metadata */}
              <div className="p-3 rounded-lg bg-muted/30 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Prescription ID: {prescription.id}</span>
                  <span>Issued: {new Date(prescription.issuedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Prescription • {prescription.medicationName}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadPrescriptionPDF}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button 
                className="text-white gap-2"
                style={{ backgroundColor: colorValues.primary }}
                onClick={() => window.print()}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LabReportDetailsDialog({ children, report }: { 
  children: React.ReactNode
  report: any
}) {
  const [open, setOpen] = useState(false)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl w-[95vw] h-[90vh] p-0 gap-0 rounded-xl overflow-hidden">
        <div className="h-full flex flex-col bg-background overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-background to-muted/30">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted shadow-sm">
                  <FileText className="h-6 w-6" style={{ color: colorValues.primary }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{report.testName}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{report.patientName}</span>
                    <span>•</span>
                    <span>{report.patientId}</span>
                    <span>•</span>
                    <span>{report.testDate || new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  report.status === 'reviewed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  report.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    report.status === 'reviewed' ? 'bg-green-500' :
                    report.status === 'pending' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}></div>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </div>
                {report.abnormalFlags && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium">
                    <AlertCircle className="h-3 w-3" />
                    Critical
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5" style={{ color: colorValues.primary }} />
                    <h3 className="font-semibold text-foreground">Patient & Test Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Patient Name</label>
                        <p className="text-sm font-medium mt-1">{report.patientName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Test Type</label>
                        <p className="text-sm font-medium mt-1">{report.reportType}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Laboratory</label>
                        <p className="text-sm font-medium mt-1">{report.labName || 'MediTrack Lab'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Patient ID</label>
                        <p className="text-sm font-medium mt-1">{report.patientId}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Test Date</label>
                        <p className="text-sm font-medium mt-1">{report.testDate || new Date(report.createdAt).toLocaleDateString()}</p>
                      </div>
                      {report.technicianName && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Technician</label>
                          <p className="text-sm font-medium mt-1">{report.technicianName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5" style={{ color: colorValues.primary }} />
                    <h3 className="font-semibold text-foreground">Report Status</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                        report.status === 'reviewed' ? 'bg-green-50 text-green-700 border border-green-200' :
                        report.status === 'pending' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          report.status === 'reviewed' ? 'bg-green-500' :
                          report.status === 'pending' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}></div>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </div>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                      Report Type: {report.reportType}
                    </div>
                  </div>
                </div>
              </div>

              {report.testResults && (
                <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5" style={{ color: colorValues.primary }} />
                    <h3 className="font-semibold text-foreground">Test Results</h3>
                  </div>
                  {typeof report.testResults === 'object' && report.testResults !== null ? (
                    <div className="space-y-4">
                      {Object.entries(report.testResults).filter(([key]) => !['notes', 'summary'].includes(key.toLowerCase())).length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(report.testResults)
                            .filter(([key]) => !['notes', 'summary'].includes(key.toLowerCase()))
                            .map(([key, value]) => (
                            <div key={key} className="p-3 rounded-md bg-muted/50 border">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-foreground">{key}</span>
                                <span className="text-lg font-bold" style={{ color: colorValues.primary }}>{String(value)}</span>
                              </div>
                              {report.referenceRanges && report.referenceRanges[key] && (
                                <div className="text-xs text-muted-foreground">
                                  Normal: {report.referenceRanges[key]}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {(report.testResults.notes || report.testResults.summary) && (
                        <div className="space-y-3">
                          {report.testResults.summary && (
                            <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Summary
                              </h4>
                              <div className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                                {typeof report.testResults.summary === 'string' ? (
                                  report.testResults.summary.split(/[.!?]+/).filter(sentence => sentence.trim()).map((sentence, index) => (
                                    <p key={index} className="mb-2 last:mb-0">{sentence.trim()}.</p>
                                  ))
                                ) : (
                                  <p>{String(report.testResults.summary)}</p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {report.testResults.notes && (
                            <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Notes
                              </h4>
                              <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                                {typeof report.testResults.notes === 'string' ? (
                                  report.testResults.notes.split(/[.!?]+/).filter(sentence => sentence.trim()).map((sentence, index) => (
                                    <p key={index} className="mb-2 last:mb-0">{sentence.trim()}.</p>
                                  ))
                                ) : (
                                  <p>{String(report.testResults.notes)}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-md bg-muted/50 border">
                      <div className="text-sm leading-relaxed">
                        {typeof report.testResults === 'string' ? (
                          report.testResults.split(/[.!?]+/).filter(sentence => sentence.trim()).map((sentence, index) => (
                            <p key={index} className="mb-2 last:mb-0">{sentence.trim()}.</p>
                          ))
                        ) : (
                          <p>{String(report.testResults)}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3 rounded-lg bg-muted/30 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Report ID: {report.id}</span>
                  <span>Generated: {new Date(report.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-3 p-6 border-t bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Lab Report • {report.testName}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              {report.reportUrl && (
                <Button variant="outline" onClick={() => {
                  const link = document.createElement('a')
                  link.href = report.reportUrl
                  link.download = `${report.testName}-${report.patientName}.${report.reportUrl.split('.').pop()}`
                  link.target = '_blank'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button 
                className="text-white"
                style={{ backgroundColor: colorValues.primary }}
                onClick={() => window.print()}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}