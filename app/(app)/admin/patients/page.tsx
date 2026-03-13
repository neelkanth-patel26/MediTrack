'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Eye, Search, Users, Activity, TrendingUp, Heart, Copy } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function AdminPatients() {
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewPatient, setViewPatient] = useState(null)
  const [editPatient, setEditPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
    const interval = setInterval(fetchPatients, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/admin/patients')
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients || [])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (dob) => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Patients</h1>
            <p className="text-muted-foreground">View and manage patient accounts</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-5 w-5" style={{ color: colorValues.primary }} />
            <span className="font-semibold" style={{ color: colorValues.primary }}>{patients.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Patients</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-600">{patients.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Active Patients</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-600">-</span>
          </div>
          <p className="text-sm text-muted-foreground">New This Week</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-600">-</span>
          </div>
          <p className="text-sm text-muted-foreground">Critical Care</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search patients by name, email, or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Patients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </Card>
          ))
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
              </p>
            </Card>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: colorValues.primary}}>
                    {patient.name?.split(' ').map(n => n[0]).join('') || 'P'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">{calculateAge(patient.dateOfBirth)} years old</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-medium text-foreground">{patient.patientId || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Blood Type:</span>
                  <span className="font-medium text-foreground">{patient.bloodType || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium text-foreground capitalize">{patient.gender || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium text-foreground">{new Date(patient.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewPatient(patient)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditPatient(patient)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* View Patient Dialog */}
      <Dialog open={!!viewPatient} onOpenChange={() => setViewPatient(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Patient Profile</DialogTitle>
          </DialogHeader>
          {viewPatient && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{backgroundColor: colorValues.primary}}>
                  {viewPatient.name?.split(' ').map(n => n[0]).join('') || 'P'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{viewPatient.name}</h3>
                  <p className="text-muted-foreground">{calculateAge(viewPatient.dateOfBirth)} years old</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{viewPatient.patientId || 'N/A'}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm truncate">{viewPatient.email}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="ml-2 h-8 w-8 p-0"
                      onClick={() => {
                        navigator.clipboard.writeText(viewPatient.email)
                        alert('Email copied to clipboard!')
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewPatient.phone}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{viewPatient.gender || 'N/A'}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-medium">{viewPatient.bloodType || 'N/A'}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{viewPatient.dateOfBirth ? new Date(viewPatient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              {viewPatient.address && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{viewPatient.address}</p>
                </div>
              )}
              {viewPatient.allergies && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Allergies</p>
                  <p className="font-medium">{viewPatient.allergies}</p>
                </div>
              )}
              {viewPatient.emergencyContactName && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{viewPatient.emergencyContactName} - {viewPatient.emergencyContactPhone}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={!!editPatient} onOpenChange={() => setEditPatient(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Patient</DialogTitle>
          </DialogHeader>
          {editPatient && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="Patient name" defaultValue={editPatient.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input placeholder="Email" defaultValue={editPatient.email} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="Phone" defaultValue={editPatient.phone} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Type</label>
                  <Input placeholder="Blood Type" defaultValue={editPatient.bloodType} />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => setEditPatient(null)}>Save Changes</Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditPatient(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
