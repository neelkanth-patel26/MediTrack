'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Clock, User, Stethoscope, Search, Plus, Eye, Edit, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Grid3x3 } from 'lucide-react'
import { ViewDetailsDialog, ScheduleAppointmentDialog, EditAppointmentDialog } from '@/components/admin/dialogs'
import { useTheme } from '@/lib/theme-context'

export default function AdminAppointments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments')
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

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

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
    { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length.toString(), icon: XCircle, color: 'text-red-600' }
  ]

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
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
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
                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Doctor</div>
                                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate">{apt.doctor}</div>
                                  </div>
                                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Condition</div>
                                    <div className="text-sm font-semibold text-purple-900 dark:text-purple-100 truncate">{apt.condition}</div>
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
                                <ViewDetailsDialog title={`Appointment: ${apt.patient} - ${apt.doctor}`} data={apt}>
                                  <Button size="sm" variant="outline" className="h-8 px-2">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </ViewDetailsDialog>
                                <EditAppointmentDialog appointment={apt} onAppointmentUpdated={fetchAppointments}>
                                  <Button size="sm" variant="outline" className="h-8 px-2">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </EditAppointmentDialog>
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
            <h1 className="text-3xl font-bold text-foreground">All Appointments</h1>
            <p className="text-muted-foreground">Manage all doctor and patient appointments</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              size="sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              List
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <ScheduleAppointmentDialog onAppointmentScheduled={fetchAppointments}>
              <Button style={{ backgroundColor: colorValues.primary }} className="text-white">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </ScheduleAppointmentDialog>
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
      ) : viewMode === 'grid' ? (
        <>
          {/* Filters */}
          <Card className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Grid View */}
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No appointments found matching your criteria.' 
                  : 'No appointments scheduled yet.'}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-4 hover:shadow-lg transition-all duration-200 border-t-4" style={{ borderTopColor: 
                  appointment.status === 'confirmed' ? colorValues.primary :
                  appointment.status === 'pending' ? '#f59e0b' :
                  appointment.status === 'completed' ? '#10b981' :
                  '#ef4444'
                }}>
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                          <User className="h-4 w-4" style={{ color: colorValues.primary }} />
                        </div>
                        <Badge variant={getStatusColor(appointment.status)} className="text-xs">
                          {appointment.status}
                        </Badge>
                      </div>
                      {getStatusIcon(appointment.status)}
                    </div>

                    {/* Patient Info */}
                    <div>
                      <h3 className="font-bold text-foreground truncate">{appointment.patient}</h3>
                      <p className="text-xs text-muted-foreground truncate">{appointment.patientId}</p>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">{appointment.time}</span>
                        <span className="text-muted-foreground text-xs">({appointment.duration})</span>
                      </div>
                    </div>

                    {/* Doctor & Condition */}
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-0.5">Doctor</div>
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate">{appointment.doctor}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <div className="text-xs text-purple-600 dark:text-purple-400 mb-0.5">Condition</div>
                        <div className="text-sm font-semibold text-purple-900 dark:text-purple-100 truncate">{appointment.condition}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <ViewDetailsDialog title={`Appointment: ${appointment.patient}`} data={appointment}>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </ViewDetailsDialog>
                      <EditAppointmentDialog appointment={appointment} onAppointmentUpdated={fetchAppointments}>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </EditAppointmentDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Filters */}
          <Card className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Appointments List */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-20 bg-muted rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No appointments found matching your criteria.' 
                    : 'No appointments scheduled yet.'}
                </p>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-6 hover:shadow-md transition-all duration-200">
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
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{appointment.doctor} • {appointment.specialty}</span>
                      </div>
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

                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Phone: {appointment.phone}</span>
                    <span>Email: {appointment.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <ViewDetailsDialog title={`Appointment: ${appointment.patient} - ${appointment.doctor}`} data={appointment}>
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
                      <Button size="sm" style={{ backgroundColor: colorValues.primary }} className="text-white" onClick={() => alert(`Appointment confirmed for ${appointment.patient}`)}>
                        Confirm
                      </Button>
                    )}
                    {appointment.status !== 'cancelled' && (
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => alert(`Appointment cancelled for ${appointment.patient}`)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
            )}
          </div>
        </>
      )}
    </div>
  )
}