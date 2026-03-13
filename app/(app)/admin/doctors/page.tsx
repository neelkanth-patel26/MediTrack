'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Eye, Search, Stethoscope, Users, Activity, TrendingUp, Filter } from 'lucide-react'
import { AddDoctorDialog } from '@/components/admin/dialogs'
import { useTheme } from '@/lib/theme-context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminDoctors() {
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewDoctor, setViewDoctor] = useState(null)
  const [editDoctor, setEditDoctor] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterSpecialization, setFilterSpecialization] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchDoctors()
    const interval = setInterval(fetchDoctors, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/admin/doctors')
      if (response.ok) {
        const data = await response.json()
        
        // Fetch patient counts and appointment stats for each doctor
        const doctorsWithStats = await Promise.all(data.doctors.map(async (doctor) => {
          try {
            const [patientsRes, appointmentsRes] = await Promise.all([
              fetch(`/api/doctor/stats?doctorId=${doctor.userId}`),
              fetch(`/api/doctor/stats?doctorId=${doctor.userId}`)
            ])
            
            const statsData = patientsRes.ok ? await patientsRes.json() : { totalPatients: 0, completedAppointments: 0, totalRevenue: 0, doctorEarnings: 0 }
            
            return {
              id: doctor.id,
              name: doctor.name,
              email: doctor.email,
              specialization: doctor.specialization,
              doctorId: doctor.doctor_id,
              licenseNumber: doctor.license_number,
              yearsExperience: doctor.years_experience,
              consultationFee: doctor.consultation_fee,
              availability: doctor.availability,
              bio: doctor.bio,
              education: doctor.education,
              certifications: doctor.certifications,
              isActive: doctor.is_active,
              phone: doctor.phone,
              joinedDate: doctor.created_at,
              patientCount: statsData.totalPatients || 0,
              completedAppointments: statsData.completedAppointments || 0,
              totalEarnings: statsData.doctorEarnings || 0
            }
          } catch {
            return {
              id: doctor.id,
              name: doctor.name,
              email: doctor.email,
              specialization: doctor.specialization,
              doctorId: doctor.doctor_id,
              licenseNumber: doctor.license_number,
              yearsExperience: doctor.years_experience,
              consultationFee: doctor.consultation_fee,
              availability: doctor.availability,
              bio: doctor.bio,
              education: doctor.education,
              certifications: doctor.certifications,
              isActive: doctor.is_active,
              phone: doctor.phone,
              joinedDate: doctor.created_at,
              patientCount: 0,
              completedAppointments: 0,
              totalEarnings: 0
            }
          }
        }))
        
        setDoctors(doctorsWithStats)
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialization = filterSpecialization === 'all' || 
      doctor.specialization?.toLowerCase() === filterSpecialization.toLowerCase()
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && doctor.isActive) ||
      (filterStatus === 'inactive' && !doctor.isActive)
    
    return matchesSearch && matchesSpecialization && matchesStatus
  })

  const stats = {
    total: doctors.length,
    active: doctors.filter(d => d.isActive).length,
    avgRating: doctors.length > 0 ? (doctors.reduce((sum, d) => sum + (d.rating || 4.5), 0) / doctors.length).toFixed(1) : '0'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Doctors</h1>
            <p className="text-muted-foreground">Add, edit, and manage doctor accounts</p>
          </div>
          <AddDoctorDialog onDoctorAdded={fetchDoctors}>
            <Button 
              className="gap-2 text-white"
              style={{ backgroundColor: colorValues.primary }}
            >
              <Plus className="h-4 w-4" />
              Add Doctor
            </Button>
          </AddDoctorDialog>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Stethoscope className="h-5 w-5" style={{ color: colorValues.primary }} />
            <span className="font-semibold" style={{ color: colorValues.primary }}>{stats.total}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Doctors</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-600">{stats.active}</span>
          </div>
          <p className="text-sm text-muted-foreground">Active Doctors</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-600">-</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Patients</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-600">{stats.avgRating}</span>
          </div>
          <p className="text-sm text-muted-foreground">Avg Rating</p>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search doctors by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Doctors Grid */}
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
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No doctors found matching your search.' : 'No doctors registered yet.'}
              </p>
            </Card>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: colorValues.primary}}>
                    {doctor.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </div>
                <Badge variant={doctor.isActive ? 'default' : 'secondary'}>
                  {doctor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Doctor ID:</span>
                  <span className="font-medium text-foreground">{doctor.doctorId || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium text-foreground">{doctor.yearsExperience || 0} years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fee:</span>
                  <span className="font-medium text-foreground">${doctor.consultationFee || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium text-foreground">{new Date(doctor.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewDoctor(doctor)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditDoctor(doctor)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* View Doctor Dialog */}
      <Dialog open={!!viewDoctor} onOpenChange={() => setViewDoctor(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Doctor Profile</DialogTitle>
          </DialogHeader>
          {viewDoctor && (
            <div className="space-y-4">
              {/* Header Section */}
              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: `${colorValues.primary}10` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{backgroundColor: colorValues.primary}}>
                  {viewDoctor.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{viewDoctor.name}</h3>
                  <p className="text-base" style={{ color: colorValues.primary }}>{viewDoctor.specialization}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant={viewDoctor.isActive ? 'default' : 'secondary'}>
                      {viewDoctor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">ID: {viewDoctor.doctorId}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border text-center">
                  <div className="text-xl font-bold" style={{ color: colorValues.primary }}>{viewDoctor.patientCount || 0}</div>
                  <div className="text-xs text-muted-foreground">Patients</div>
                </div>
                <div className="p-3 rounded-lg border text-center">
                  <div className="text-xl font-bold text-green-600">${(viewDoctor.totalEarnings || 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Earnings</div>
                </div>
                <div className="p-3 rounded-lg border text-center">
                  <div className="text-xl font-bold text-blue-600">{viewDoctor.completedAppointments || 0}</div>
                  <div className="text-xs text-muted-foreground">Appointments</div>
                </div>
                <div className="p-3 rounded-lg border text-center">
                  <div className="text-xl font-bold text-purple-600">${viewDoctor.consultationFee || 0}</div>
                  <div className="text-xs text-muted-foreground">Fee</div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Email</div>
                  <div className="text-sm font-medium truncate">{viewDoctor.email}</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Phone</div>
                  <div className="text-sm font-medium">{viewDoctor.phone || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs font-medium text-muted-foreground mb-1">License</div>
                  <div className="text-sm font-medium">{viewDoctor.licenseNumber || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Experience</div>
                  <div className="text-sm font-medium">{viewDoctor.yearsExperience || 0} years</div>
                </div>
              </div>

              {/* Bio */}
              {viewDoctor.bio && (
                <div className="p-3 rounded-lg border">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Bio</div>
                  <div className="text-sm">{viewDoctor.bio}</div>
                </div>
              )}

              {/* Education & Certifications */}
              <div className="grid grid-cols-2 gap-3">
                {viewDoctor.education && (
                  <div className="p-3 rounded-lg border">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Education</div>
                    <div className="text-sm">{viewDoctor.education}</div>
                  </div>
                )}
                {viewDoctor.certifications && (
                  <div className="p-3 rounded-lg border">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Certifications</div>
                    <div className="text-sm">{viewDoctor.certifications}</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  Joined: {new Date(viewDoctor.joinedDate).toLocaleDateString()}
                </div>
                <Button onClick={() => setViewDoctor(null)} style={{ backgroundColor: colorValues.primary }} className="text-white">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog open={!!editDoctor} onOpenChange={() => setEditDoctor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Doctor</DialogTitle>
          </DialogHeader>
          {editDoctor && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="Doctor name" defaultValue={editDoctor.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input placeholder="Email" defaultValue={editDoctor.email} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Input placeholder="Medical specialization" defaultValue={editDoctor.specialization} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience</label>
                  <Input placeholder="Years" defaultValue={editDoctor.experience} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full p-2 border rounded-lg" defaultValue={editDoctor.status}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => setEditDoctor(null)}>Save Changes</Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditDoctor(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
