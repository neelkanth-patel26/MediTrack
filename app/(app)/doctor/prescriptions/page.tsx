'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, AlertTriangle, Clock, CheckCircle, Pill, FileText, Eye, Filter, X, Calendar, User, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CreatePrescriptionDialog, PrescriptionDetailsDialog } from '@/components/doctor/dialogs'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'

export default function DoctorPrescriptions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    status: 'all',
    medication: 'all',
    refills: 'all',
    dateRange: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  useEffect(() => {
    if (user?.id) {
      fetchPrescriptions()
    }
  }, [user?.id])

  const fetchPrescriptions = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const response = await fetch(`/api/doctor/prescriptions?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setPrescriptions(data.prescriptions)
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesSearch = rx.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filters.status === 'all' || rx.status === filters.status
    const matchesMedication = filters.medication === 'all' || 
      rx.medicationName?.toLowerCase().includes(filters.medication.toLowerCase())
    const matchesRefills = filters.refills === 'all' || 
      (filters.refills === 'low' && rx.refills <= 1) ||
      (filters.refills === 'none' && rx.refills === 0) ||
      (filters.refills === 'available' && rx.refills > 1)
    
    let matchesDate = true
    if (filters.dateRange !== 'all') {
      const prescriptionDate = new Date(rx.issuedAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - prescriptionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (filters.dateRange) {
        case 'today': matchesDate = daysDiff === 0; break
        case 'week': matchesDate = daysDiff <= 7; break
        case 'month': matchesDate = daysDiff <= 30; break
        case '3months': matchesDate = daysDiff <= 90; break
      }
    }
    
    return matchesSearch && matchesStatus && matchesMedication && matchesRefills && matchesDate
  })

  const clearFilters = () => {
    setFilters({ status: 'all', medication: 'all', refills: 'all', dateRange: 'all' })
    setSearchTerm('')
  }

  const hasActiveFilters = filters.status !== 'all' || filters.medication !== 'all' || 
    filters.refills !== 'all' || filters.dateRange !== 'all' || searchTerm !== ''

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-44 mb-2"></div>
              <div className="h-4 bg-muted rounded w-72"></div>
            </div>
            <div className="flex gap-2">
              <div className="animate-pulse h-6 w-24 bg-muted rounded"></div>
              <div className="animate-pulse h-10 w-40 bg-muted rounded"></div>
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
              <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-6 mx-auto mb-1"></div>
              <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
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
                <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Prescriptions Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="h-5 bg-muted rounded w-32 mb-1"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                  <div className="h-5 w-16 bg-muted rounded"></div>
                </div>

                {/* Medication Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-28"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-36"></div>
                </div>

                {/* Details */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-12"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-12"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-4">
                  <div className="h-4 bg-muted rounded w-20 mb-1"></div>
                  <div className="h-12 bg-muted rounded w-full"></div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded flex-1"></div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                  <div className="h-8 w-16 bg-muted rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
            <p className="text-muted-foreground">Issue and manage patient prescriptions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{prescriptions.filter(p => p.refills === 0).length}</div>
                <div className="text-xs text-muted-foreground">Need Renewal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{prescriptions.filter(p => p.status === 'active').length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{prescriptions.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
            <CreatePrescriptionDialog onPrescriptionCreated={() => fetchPrescriptions(false)}>
              <Button
                size="lg"
                className="gap-2 text-white font-medium"
                style={{ backgroundColor: colorValues.primary }}
              >
                <Plus className="h-4 w-4" />
                New Prescription
              </Button>
            </CreatePrescriptionDialog>
          </div>
        </div>
      </Card>

      {/* Search and Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by patient name, medication, or patient ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">Filter Prescriptions</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Medication Type</label>
                  <Select value={filters.medication} onValueChange={(value) => setFilters(prev => ({ ...prev, medication: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Medications</SelectItem>
                      <SelectItem value="antibiotic">Antibiotics</SelectItem>
                      <SelectItem value="pain">Pain Relief</SelectItem>
                      <SelectItem value="blood pressure">Blood Pressure</SelectItem>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="heart">Heart Medication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Refill Status</label>
                  <Select value={filters.refills} onValueChange={(value) => setFilters(prev => ({ ...prev, refills: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Refills</SelectItem>
                      <SelectItem value="none">No Refills</SelectItem>
                      <SelectItem value="low">Low Refills (≤1)</SelectItem>
                      <SelectItem value="available">Refills Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Prescriptions Grid/List */}
      {filteredPrescriptions.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
          {filteredPrescriptions.map((prescription) => (
            viewMode === 'grid' ? (
              /* Grid Cards */
              <Card key={prescription.id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted">
                      <Pill className="h-6 w-6" style={{ color: colorValues.primary }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{prescription.patientName}</h3>
                      <p className="text-sm text-muted-foreground">{prescription.patientId}</p>
                      <p className="text-xs text-muted-foreground">{prescription.medicationName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusColor(prescription.status)} className="text-xs">
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </Badge>
                    {prescription.refills === 0 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Renewal Needed
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Dosage:</span>
                      <span className="ml-2 font-medium">{prescription.dosage}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="ml-2 font-medium">{prescription.frequency}</span>
                    </div>
                    {prescription.duration && (
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2 font-medium">{prescription.duration}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Refills:</span>
                      <span className={`ml-2 font-medium ${
                        prescription.refills === 0 ? 'text-red-600' : 'text-foreground'
                      }`}>
                        {prescription.refills} left
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Issued:</span>
                      <span className="ml-2 font-medium">{new Date(prescription.issuedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {prescription.instructions && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Instructions</div>
                      <p className="text-sm text-foreground">
                        {prescription.instructions.slice(0, 100)}...
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <PrescriptionDetailsDialog prescription={prescription}>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </PrescriptionDetailsDialog>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4" />
                  </Button>
                  {prescription.refills === 0 && prescription.status === 'active' && (
                    <Button 
                      size="sm" 
                      style={{ backgroundColor: colorValues.primary }} 
                      className="text-white"
                      onClick={() => alert(`Prescription renewal initiated for ${prescription.patientName}`)}
                    >
                      Renew
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              /* List View */
              <Card key={prescription.id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted flex-shrink-0">
                    <Pill className="h-6 w-6" style={{ color: colorValues.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{prescription.medicationName}</h3>
                        <p className="text-sm text-muted-foreground">{prescription.patientName} • {prescription.patientId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(prescription.status)} className="text-xs">
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </Badge>
                        {prescription.refills === 0 && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Renewal Needed
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Dosage:</span>
                        <span className="ml-2 font-medium">{prescription.dosage}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="ml-2 font-medium">{prescription.frequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2 font-medium">{prescription.duration || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Refills:</span>
                        <span className={`ml-2 font-medium ${
                          prescription.refills === 0 ? 'text-red-600' : 'text-foreground'
                        }`}>
                          {prescription.refills} left
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Issued:</span>
                        <span className="ml-2 font-medium">{new Date(prescription.issuedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {prescription.instructions && (
                      <div className="p-3 bg-muted rounded-lg mb-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Instructions</div>
                        <p className="text-sm text-foreground">
                          {prescription.instructions.slice(0, 150)}...
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <PrescriptionDetailsDialog prescription={prescription}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </PrescriptionDetailsDialog>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4" />
                    </Button>
                    {prescription.refills === 0 && prescription.status === 'active' && (
                      <Button 
                        size="sm" 
                        style={{ backgroundColor: colorValues.primary }} 
                        className="text-white"
                        onClick={() => alert(`Prescription renewal initiated for ${prescription.patientName}`)}
                      >
                        Renew
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Pill className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm || hasActiveFilters ? 'No prescriptions found' : 'No prescriptions yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || hasActiveFilters ? 'No prescriptions match your search criteria.' : 'Create your first prescription to get started.'}
          </p>
          <CreatePrescriptionDialog onPrescriptionCreated={() => fetchPrescriptions(false)}>
            <Button 
              className="text-white"
              style={{ backgroundColor: colorValues.primary }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Prescription
            </Button>
          </CreatePrescriptionDialog>
        </Card>
      )}
    </div>
  )
}
