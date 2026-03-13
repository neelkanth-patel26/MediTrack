'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, FileText, Eye, Search, Phone, Calendar, Activity, Heart, AlertTriangle, Clock, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AddPatientDialog, ViewDetailsDialog, CreatePrescriptionDialog } from '@/components/doctor/dialogs'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'

export default function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    bloodType: 'all',
    gender: 'all',
    hasAllergies: 'all',
    ageRange: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  useEffect(() => {
    if (user?.id) {
      fetchPatients()
    }
  }, [user?.id])

  const fetchPatients = async () => {
    try {
      const response = await fetch(`/api/doctor/patients?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.allergies?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesBloodType = filters.bloodType === 'all' || !filters.bloodType || patient.bloodType === filters.bloodType
    const matchesGender = filters.gender === 'all' || !filters.gender || patient.gender === filters.gender
    const matchesAllergies = filters.hasAllergies === 'all' || !filters.hasAllergies || 
      (filters.hasAllergies === 'yes' && patient.allergies && patient.allergies !== 'None' && patient.allergies !== '-') ||
      (filters.hasAllergies === 'no' && (!patient.allergies || patient.allergies === 'None' || patient.allergies === '-'))
    
    let matchesAge = true
    if (filters.ageRange && filters.ageRange !== 'all' && patient.dateOfBirth) {
      const age = Math.floor((new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))
      switch (filters.ageRange) {
        case 'child': matchesAge = age < 18; break
        case 'adult': matchesAge = age >= 18 && age < 65; break
        case 'senior': matchesAge = age >= 65; break
      }
    }
    
    return matchesSearch && matchesBloodType && matchesGender && matchesAllergies && matchesAge
  })

  const getRiskColor = (bloodType: string) => {
    // Simple risk assessment based on blood type (demo logic)
    if (['AB-', 'O-'].includes(bloodType)) return 'text-red-600'
    if (['A-', 'B-'].includes(bloodType)) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusColor = (gender: string) => {
    // Demo status logic
    return 'default'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-40 mb-2"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </div>
            <div className="flex gap-2">
              <div className="animate-pulse h-10 w-24 bg-muted rounded"></div>
              <div className="animate-pulse h-10 w-28 bg-muted rounded"></div>
            </div>
          </div>
        </Card>

        {/* Search and Stats Skeleton */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-2 p-4">
            <div className="animate-pulse h-10 bg-muted rounded"></div>
          </Card>
          <Card className="p-4 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-8 mx-auto mb-1"></div>
              <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-6 mx-auto mb-1"></div>
              <div className="h-4 bg-muted rounded w-16 mx-auto"></div>
            </div>
          </Card>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 text-center">
              <div className="animate-pulse">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-5 w-5 bg-muted rounded"></div>
                  <div className="h-5 w-8 bg-muted rounded"></div>
                </div>
                <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Patients Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                {/* Patient Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="h-5 bg-muted rounded w-32 mb-1"></div>
                    <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-muted rounded"></div>
                    <div className="h-3 w-3 bg-muted rounded-full"></div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                  <div className="h-5 w-24 bg-muted rounded"></div>
                </div>

                {/* Patient Details */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-12"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-12"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-12"></div>
                    <div className="h-4 bg-muted rounded w-28"></div>
                  </div>
                </div>

                {/* Allergies */}
                <div className="mb-4">
                  <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded flex-1"></div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">My Patients</h1>
          <p className="text-muted-foreground">Manage and monitor your patients</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2 shadow-sm hover:shadow-md transition-all duration-200 border-2 hover:border-primary/50" 
            onClick={() => setShowScheduleDialog(true)}
          >
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <AddPatientDialog onPatientAdded={fetchPatients}>
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white gap-2 shadow-md hover:shadow-lg transition-shadow">
              <FileText className="h-4 w-4" />
              Add Patient
            </Button>
          </AddPatientDialog>
        </div>
      </div>

      {/* Search and Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-3 p-4 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients by name or allergies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-0 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 border-0 bg-muted/30 hover:bg-muted/50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filters
            </Button>
          </div>
        </Card>
        <Card className="p-4 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colorValues.primary }}>{filteredPatients.length}</p>
            <p className="text-sm text-muted-foreground">Showing</p>
          </div>
        </Card>
        <Card className="p-4 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{filteredPatients.filter(p => p.bloodType && ['AB-', 'O-'].includes(p.bloodType)).length}</p>
            <p className="text-sm text-muted-foreground">High Risk</p>
          </div>
        </Card>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-6 border-2 border-dashed border-muted-foreground/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filter Patients</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ bloodType: 'all', gender: 'all', hasAllergies: 'all', ageRange: 'all' })}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Blood Type</Label>
              <Select value={filters.bloodType} onValueChange={(value) => setFilters({...filters, bloodType: value})}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
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
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gender</Label>
              <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Allergies</Label>
              <Select value={filters.hasAllergies} onValueChange={(value) => setFilters({...filters, hasAllergies: value})}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="yes">With Allergies</SelectItem>
                  <SelectItem value="no">No Allergies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Age Range</Label>
              <Select value={filters.ageRange} onValueChange={(value) => setFilters({...filters, ageRange: value})}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="child">Child (0-17)</SelectItem>
                  <SelectItem value="adult">Adult (18-64)</SelectItem>
                  <SelectItem value="senior">Senior (65+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Patients Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => {
            const age = patient.dateOfBirth ? Math.floor((new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : null
            const displayAge = age ? `${age} years` : '-'
            const displayGender = patient.gender || '-'
            const displayBloodType = patient.bloodType || '-'
            const displayAllergies = patient.allergies || '-'
            return (
              <Card key={patient.id} className="p-5 hover:shadow-md transition-all duration-200 border-l-4" style={{ borderLeftColor: colorValues.primary }}>
                {/* Patient Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: colorValues.primary }}>
                      {patient.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">{displayAge}, {displayGender}</p>
                      <p className="text-xs text-muted-foreground">{patient.patientId}</p>
                    </div>
                  </div>
                  {patient.allergies && patient.allergies !== 'None' && patient.allergies !== '-' && (
                    <Badge variant="destructive" className="text-xs">
                      Allergies
                    </Badge>
                  )}
                </div>

                {/* Patient Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Blood Type</span>
                    <span className="font-medium">{displayBloodType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium">{displayAge}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{displayGender}</span>
                  </div>
                  {patient.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium text-xs">{patient.email}</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium">{patient.phone}</span>
                    </div>
                  )}
                </div>

                {/* Allergies */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Allergies</p>
                  {displayAllergies !== '-' && displayAllergies !== 'None' ? (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                      <p className="text-xs text-red-800 dark:text-red-200">{displayAllergies}</p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">No known allergies</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <ViewDetailsDialog 
                    title={`Patient: ${patient.name}`} 
                    data={{
                      ...patient,
                      patient: patient.name,
                      age: displayAge,
                      gender: displayGender,
                      bloodType: displayBloodType,
                      allergies: displayAllergies,
                      type: 'Patient Profile',
                      status: 'active'
                    }}
                  >
                    <Button size="sm" variant="outline" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </ViewDetailsDialog>
                  <Button size="sm" variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  {patient.phone && (
                    <Button size="sm" variant="outline" onClick={() => window.open(`tel:${patient.phone}`)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
            <Activity className="h-8 w-8" style={{ color: colorValues.primary }} />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Patients Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No patients match your search criteria.' : 'You haven\'t added any patients yet.'}
          </p>
          <AddPatientDialog onPatientAdded={fetchPatients}>
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white gap-2">
              <FileText className="h-4 w-4" />
              Add Your First Patient
            </Button>
          </AddPatientDialog>
        </Card>
      )}

      {/* Schedule Dialog */}
      {showScheduleDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white shadow-2xl border-0">
            <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colorValues.primary }}>
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Schedule Appointment</h2>
                    <p className="text-sm text-muted-foreground">Book a new appointment with a patient</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowScheduleDialog(false)}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Patient</Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose a patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: colorValues.primary }}>
                              {patient.name?.charAt(0) || 'P'}
                            </div>
                            {patient.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Appointment Type</Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="check-up">Check-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date</Label>
                  <Input type="date" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Time</Label>
                  <Input type="time" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Duration</Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Notes (Optional)</Label>
                <textarea 
                  className="w-full h-24 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Add any additional notes for this appointment..."
                />
              </div>
            </div>
            <div className="p-6 border-t bg-muted/20 flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowScheduleDialog(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                style={{ backgroundColor: colorValues.primary }} 
                className="text-white px-6 shadow-md hover:shadow-lg transition-shadow"
                onClick={() => {
                  setShowScheduleDialog(false)
                }}
              >
                Schedule Appointment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
