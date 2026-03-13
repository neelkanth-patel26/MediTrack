'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Clock, User, Search, Plus, Eye, Edit, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, List, Grid } from 'lucide-react'
import { ViewDetailsDialog, EditAppointmentDialog } from '@/components/doctor/dialogs'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'
import { SuccessNotification } from '@/components/ui/success-notification'

export default function DoctorAppointments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('list')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ isVisible: false, message: '', patientName: '' })
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  useEffect(() => {
    if (user?.id) {
      fetchAppointments()
    }
  }, [user?.id])

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/doctor/appointments?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const response = await fetch('/api/doctor/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status, doctorId: user?.id })
      })
      if (response.ok) {
        fetchAppointments()
        // Show success notification when confirming appointment
        if (status === 'confirmed') {
          const appointment = appointments.find(apt => apt.id === appointmentId)
          if (appointment) {
            setNotification({
              isVisible: true,
              message: 'The patient has been successfully added to your care.',
              patientName: appointment.patient
            })
          }
        }
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus
    const matchesType = filterType === 'all' || appointment.type === filterType
    
    let matchesDate = true
    if (filterDate !== 'all') {
      const appointmentDate = new Date(appointment.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      switch (filterDate) {
        case 'today':
          matchesDate = appointmentDate.toDateString() === today.toDateString()
          break
        case 'tomorrow':
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          matchesDate = appointmentDate.toDateString() === tomorrow.toDateString()
          break
        case 'week':
          const weekEnd = new Date(today)
          weekEnd.setDate(weekEnd.getDate() + 7)
          matchesDate = appointmentDate >= today && appointmentDate <= weekEnd
          break
        case 'month':
          const monthEnd = new Date(today)
          monthEnd.setMonth(monthEnd.getMonth() + 1)
          matchesDate = appointmentDate >= today && appointmentDate <= monthEnd
          break
        case 'custom':
          if (dateRange.from && dateRange.to) {
            const fromDate = new Date(dateRange.from)
            const toDate = new Date(dateRange.to)
            matchesDate = appointmentDate >= fromDate && appointmentDate <= toDate
          }
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const clearAllFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setFilterType('all')
    setFilterDate('all')
    setDateRange({ from: '', to: '' })
  }

  const activeFiltersCount = [
    searchTerm,
    filterStatus !== 'all' ? filterStatus : null,
    filterType !== 'all' ? filterType : null,
    filterDate !== 'all' ? filterDate : null
  ].filter(Boolean).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default'
      case 'pending': return 'secondary'
      case 'completed': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const todayStats = [
    { label: 'Total Appointments', value: appointments.length.toString(), icon: Calendar, color: 'text-blue-600' },
    { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length.toString(), icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length.toString(), icon: Clock, color: 'text-yellow-600' },
    { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length.toString(), icon: CheckCircle, color: 'text-purple-600' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-2"></div>
              <div className="h-4 bg-muted rounded w-80"></div>
            </div>
            <div className="flex gap-2">
              <div className="animate-pulse h-10 w-32 bg-muted rounded"></div>
              <div className="animate-pulse h-10 w-24 bg-muted rounded"></div>
              <div className="animate-pulse h-10 w-36 bg-muted rounded"></div>
            </div>
          </div>
        </Card>

        {/* Stats Skeleton */}
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

        {/* Filters Skeleton */}
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="animate-pulse h-10 bg-muted rounded"></div>
            <div className="animate-pulse h-10 bg-muted rounded"></div>
          </div>
        </Card>

        {/* Appointments List Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-5 bg-muted rounded w-32"></div>
                        <div className="h-5 w-20 bg-muted rounded"></div>
                        <div className="h-4 w-4 bg-muted rounded"></div>
                      </div>
                      <div className="h-4 bg-muted rounded w-48 mb-1"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-4 w-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-12"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-muted rounded"></div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                    <div className="h-8 w-20 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date)
      .sort((a, b) => {
        // Sort by time in ascending order
        const timeA = a.time.replace(':', '')
        const timeB = b.time.replace(':', '')
        return timeA.localeCompare(timeB)
      })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateString = formatDate(date)
      const dayAppointments = getAppointmentsForDate(dateString)
      const isToday = dateString === formatDate(new Date())

      days.push(
        <div key={day} className={`h-24 border border-border p-1 ${isToday ? 'border-2' : ''}`} style={isToday ? { backgroundColor: `${colorValues.primary}10`, borderColor: colorValues.primary } : {}}>
          <div className={`text-sm font-medium mb-1`} style={isToday ? { color: colorValues.primary } : {}}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.length === 0 ? null :
            dayAppointments.length === 1 ? (
              <ViewDetailsDialog 
                key={dayAppointments[0].id} 
                title={`Appointment Details`} 
                data={{
                  ...dayAppointments[0],
                  date: dateString,
                  formattedDate: new Date(dateString).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                }}
              >
                <div
                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate`}
                  style={{
                    backgroundColor: 
                      dayAppointments[0].status === 'confirmed' ? colorValues.primary :
                      dayAppointments[0].status === 'pending' ? '#f59e0b' :
                      dayAppointments[0].status === 'completed' ? '#10b981' :
                      '#ef4444',
                    color: 'white'
                  }}
                >
                  <div className="font-medium truncate flex items-center gap-1">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{dayAppointments[0].patient}</span>
                  </div>
                  <div className="truncate flex items-center gap-1">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{dayAppointments[0].time}</span>
                  </div>
                </div>
              </ViewDetailsDialog>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <div 
                    className="text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity text-center font-medium"
                    style={{ backgroundColor: `${colorValues.primary}20`, color: colorValues.primary, border: `1px solid ${colorValues.primary}40` }}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>{dayAppointments.length} Appointments</span>
                    </div>
                    <div className="text-xs opacity-75">
                      {dayAppointments[0].time} - {dayAppointments[dayAppointments.length - 1].time}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 gap-0 rounded-2xl overflow-hidden">
                  <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
                    {/* Header */}
                    <div className="px-6 py-4 border-b bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
                      <DialogTitle className="text-lg font-semibold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                          <Calendar className="h-4 w-4" style={{ color: colorValues.primary }} />
                        </div>
                        <div>
                          <div className="text-foreground">
                            {new Date(dateString).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {dayAppointments.length} appointments
                          </div>
                        </div>
                      </DialogTitle>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 space-y-3">
                        {dayAppointments.map((apt, index) => (
                          <Card key={apt.id} className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 rounded-xl" style={{ borderLeftColor: 
                            apt.status === 'confirmed' ? colorValues.primary :
                            apt.status === 'pending' ? '#f59e0b' :
                            apt.status === 'completed' ? '#10b981' :
                            '#ef4444'
                          }}>
                            <div className="flex items-center gap-4">
                              {/* Avatar & Time */}
                              <div className="flex flex-col items-center gap-2 min-w-0">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                                  <User className="h-5 w-5" style={{ color: colorValues.primary }} />
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-bold" style={{ color: colorValues.primary }}>{apt.time}</div>
                                  <div className="text-xs text-muted-foreground">{apt.duration}</div>
                                </div>
                              </div>
                              
                              {/* Main Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-foreground text-base truncate">{apt.patient}</h4>
                                    <p className="text-xs text-muted-foreground">{apt.patientId}</p>
                                  </div>
                                  <Badge variant={getStatusColor(apt.status)} className="text-xs px-2 py-1 ml-2">
                                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Condition</div>
                                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate">{apt.condition}</div>
                                  </div>
                                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Type</div>
                                    <div className="text-sm font-semibold text-purple-900 dark:text-purple-100 truncate">{apt.type}</div>
                                  </div>
                                </div>
                                
                                {apt.notes && (
                                  <div className="p-2 rounded-lg mb-2 text-xs" style={{ backgroundColor: `${colorValues.primary}08` }}>
                                    <span className="font-medium" style={{ color: colorValues.primary }}>Notes: </span>
                                    <span className="text-foreground">{apt.notes}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Actions */}
                              <div className="flex gap-1">
                                <ViewDetailsDialog title={`Appointment: ${apt.patient}`} data={apt}>
                                  <Button size="sm" variant="outline" className="h-8 px-2">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </ViewDetailsDialog>
                                <EditAppointmentDialog appointment={apt} onAppointmentUpdated={fetchAppointments}>
                                  <Button size="sm" variant="outline" className="h-8 px-2">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </EditAppointmentDialog>
                                {apt.status === 'pending' && (
                                  <Button 
                                    size="sm" 
                                    style={{ backgroundColor: colorValues.primary }} 
                                    className="text-white h-8 px-2" 
                                    onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0 border border-border">
          {dayNames.map(day => (
            <div key={day} className="p-2 bg-muted font-medium text-center text-sm">
              {day}
            </div>
          ))}
          {days}
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
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Manage your patient appointments and schedule</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {todayStats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Appointments Display */}
      {viewMode === 'calendar' ? (
        <Card className="p-6">
          {renderCalendar()}
        </Card>
      ) : (
        <>
          {/* Enhanced Filters */}
          <Card className="p-4">
            <div className="space-y-4">
              {/* Main Filter Row */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search patients, conditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="check-up">Check-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.553.894l-4 2A1 1 0 019 20v-6.586a1 1 0 00-.293-.707L2.293 7.293A1 1 0 012 6.586V4z" />
                    </svg>
                    More
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full" style={{ backgroundColor: colorValues.primary, color: 'white' }}>
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Advanced Filters */}
              {showFilters && (
                <div className="pt-4 border-t border-border">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
                      <Select value={filterDate} onValueChange={setFilterDate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Dates</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="week">Next 7 Days</SelectItem>
                          <SelectItem value="month">Next 30 Days</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {filterDate === 'custom' && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">From Date</label>
                          <Input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">To Date</label>
                          <Input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Active Filters Display */}
                  {activeFiltersCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                        {searchTerm && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Search: "{searchTerm}"
                          </span>
                        )}
                        {filterStatus !== 'all' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Status: {filterStatus}
                          </span>
                        )}
                        {filterType !== 'all' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Type: {filterType}
                          </span>
                        )}
                        {filterDate !== 'all' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Date: {filterDate === 'custom' ? 'Custom Range' : filterDate}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Appointments List/Grid */}
          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredAppointments.length > 0 ? filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className={`transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'p-6 hover:shadow-lg hover:border-primary/30' 
                  : 'p-6 hover:shadow-md'
              }`}>
                {viewMode === 'grid' ? (
                  <div className="space-y-4">
                    {/* Grid Header */}
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: `${colorValues.primary}15` }}>
                        <User className="h-6 w-6" style={{ color: colorValues.primary }} />
                      </div>
                      <Badge variant={getStatusColor(appointment.status)} className="text-xs">
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {/* Patient Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground leading-tight mb-1">
                        {appointment.patient}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {appointment.patientId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.condition}
                      </p>
                    </div>
                    
                    {/* Date & Time */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.time} ({appointment.duration})</span>
                      </div>
                    </div>
                    
                    {/* Type */}
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Type:</span> {appointment.type}
                    </div>
                    
                    {/* Actions */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex gap-2">
                        <ViewDetailsDialog title={`Appointment: ${appointment.patient}`} data={appointment}>
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </ViewDetailsDialog>
                        <EditAppointmentDialog appointment={appointment} onAppointmentUpdated={fetchAppointments}>
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </EditAppointmentDialog>
                        {appointment.status === 'pending' && (
                          <Button 
                            size="sm" 
                            style={{ backgroundColor: colorValues.primary }} 
                            className="text-white flex-1 text-xs" 
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <User className="h-5 w-5" style={{ color: colorValues.primary }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{appointment.patient}</h3>
                            <Badge variant={getStatusColor(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                            {getStatusIcon(appointment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{appointment.patientId} • {appointment.condition}</p>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{appointment.time}</span>
                          <span className="text-muted-foreground">({appointment.duration})</span>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-foreground mb-1">Notes:</p>
                        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {appointment.phone && <span>Phone: {appointment.phone}</span>}
                        {appointment.email && <span>Email: {appointment.email}</span>}
                      </div>
                      <div className="flex gap-2">
                        <ViewDetailsDialog title={`Appointment: ${appointment.patient}`} data={appointment}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </ViewDetailsDialog>
                        <EditAppointmentDialog appointment={appointment} onAppointmentUpdated={fetchAppointments}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </EditAppointmentDialog>
                        {appointment.status === 'pending' && (
                          <Button 
                            size="sm" 
                            style={{ backgroundColor: colorValues.primary }} 
                            className="text-white" 
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            )) : (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No appointments found matching your criteria.' 
                    : 'No appointments scheduled yet.'}
                </p>
              </Card>
            )}
          </div>
        </>
      )}
      
      <SuccessNotification
        message={notification.message}
        patientName={notification.patientName}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ isVisible: false, message: '', patientName: '' })}
      />
    </div>
  )
}