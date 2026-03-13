'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Clock, User, MapPin, Plus, Eye, FileText, Phone, Search, Filter, Grid, List, Stethoscope, AlertCircle, CheckCircle2, XCircle, Timer } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { BookAppointmentDialog } from '@/components/patient/dialogs'
import { useTheme } from '@/lib/theme-context'

export default function AppointmentsPage() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const colorValues = getColorValues()
  
  const isDemoUser = user?.email?.includes('@meditrack.com') || sessionStorage.getItem('isDemoUser') === 'true'

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return
      
      try {
        const response = await fetch(`/api/patient/data?userId=${user.id}&isDemoUser=${isDemoUser}`)
        const data = await response.json()
        setAppointments(data.appointments || [])
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
        setAppointments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [user, isDemoUser, refreshTrigger])

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800'
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-3 w-3" />
      case 'pending': return <Timer className="h-3 w-3" />
      case 'completed': return <CheckCircle2 className="h-3 w-3" />
      case 'cancelled': return <XCircle className="h-3 w-3" />
      default: return <AlertCircle className="h-3 w-3" />
    }
  }

  const QuickViewDialog = ({ appointment }: { appointment: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Eye className="h-3 w-3" />
          Quick View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
              <Calendar className="h-5 w-5" style={{ color: colorValues.primary }} />
            </div>
            <div>
              <div>Appointment Details</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                {appointment.appointment_type}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}20` }}>
              <Stethoscope className="h-6 w-6" style={{ color: colorValues.primary }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{appointment.doctor_name}</p>
              <p className="text-sm text-muted-foreground">{appointment.specialization || 'General Practice'}</p>
            </div>
            <Badge className={`${getStatusColor(appointment.status)} border flex items-center gap-1 px-2 py-1`}>
              {getStatusIcon(appointment.status)}
              {appointment.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <Calendar className="h-5 w-5" style={{ color: colorValues.primary }} />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <Clock className="h-5 w-5" style={{ color: colorValues.primary }} />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-medium">{typeof appointment.appointment_time === 'string' && appointment.appointment_time.includes(':') ? appointment.appointment_time.slice(0,5) : appointment.appointment_time}</p>
                </div>
              </div>
            </div>
          </div>
          
          {appointment.reason && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reason for Visit
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">{appointment.reason}</p>
              </div>
            </div>
          )}
          
          {appointment.condition && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Condition
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-900 dark:text-amber-100">{appointment.condition}</p>
              </div>
            </div>
          )}
          
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex gap-2">
              <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-green-800 dark:text-green-200">
                <p className="font-medium mb-1">Appointment Reminder</p>
                <p>Please arrive 15 minutes early for check-in and bring a valid ID and insurance card.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border/10">
          <Button variant="outline" className="flex-1 h-11">
            <Phone className="h-4 w-4 mr-2" />
            Call Doctor
          </Button>
          <Button 
            style={{ backgroundColor: colorValues.primary }}
            className="text-white flex-1 h-11 shadow-lg"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Reschedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
            <p className="text-muted-foreground">Manage your healthcare appointments and schedule</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <BookAppointmentDialog onSuccess={() => setRefreshTrigger(prev => prev + 1)}>
              <Button style={{ backgroundColor: colorValues.primary }} className="text-white">
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </BookAppointmentDialog>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-full">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{appointments.length}</span>
          </div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Appointments</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{appointments.filter(a => a.status === 'confirmed').length}</span>
          </div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Confirmed</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-amber-500 rounded-full">
              <Timer className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{appointments.filter(a => a.status === 'pending').length}</span>
          </div>
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-full">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{appointments.filter(a => a.status === 'completed').length}</span>
          </div>
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completed</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>{filteredAppointments.length} of {appointments.length} appointments</span>
          </div>
        </div>
      </Card>

      {/* Appointments Display */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Book your first appointment with a healthcare provider'}
                </p>
                <BookAppointmentDialog onSuccess={() => setRefreshTrigger(prev => prev + 1)}>
                  <Button style={{ backgroundColor: colorValues.primary }} className="text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </BookAppointmentDialog>
              </Card>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="group p-5 hover:shadow-xl transition-all duration-300 border-l-4 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:scale-[1.02]" style={{ borderLeftColor: appointment.status === 'confirmed' ? colorValues.primary : appointment.status === 'pending' ? '#f59e0b' : appointment.status === 'completed' ? '#3b82f6' : '#ef4444' }}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                        <Stethoscope className="h-5 w-5" style={{ color: colorValues.primary }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{appointment.appointment_type}</h3>
                        <p className="text-xs text-muted-foreground">{appointment.doctor_name}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(appointment.status)} border flex items-center gap-1 px-2 py-1 text-xs`}>
                      {getStatusIcon(appointment.status)}
                      {appointment.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{typeof appointment.appointment_time === 'string' && appointment.appointment_time.includes(':') ? appointment.appointment_time.slice(0,5) : appointment.appointment_time}</span>
                    </div>
                  </div>
                  
                  {appointment.reason && (
                    <div className="p-2 bg-muted/50 rounded text-xs">
                      <span className="font-medium">Reason: </span>
                      <span className="text-muted-foreground">{appointment.reason.length > 50 ? appointment.reason.substring(0, 50) + '...' : appointment.reason}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2 border-t">
                    <QuickViewDialog appointment={appointment} />
                    <Button size="sm" variant="ghost" className="flex-1 text-xs">
                      Reschedule
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Book your first appointment with a healthcare provider'}
              </p>
              <BookAppointmentDialog onSuccess={() => setRefreshTrigger(prev => prev + 1)}>
                <Button style={{ backgroundColor: colorValues.primary }} className="text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </BookAppointmentDialog>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="group p-6 hover:shadow-xl transition-all duration-300 border-l-4 bg-gradient-to-r from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-800/30" style={{ borderLeftColor: appointment.status === 'confirmed' ? colorValues.primary : appointment.status === 'pending' ? '#f59e0b' : appointment.status === 'completed' ? '#3b82f6' : '#ef4444' }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                        <Calendar className="h-5 w-5" style={{ color: colorValues.primary }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{appointment.appointment_type}</h3>
                        <Badge className={`${getStatusColor(appointment.status)} border flex items-center gap-1 px-2 py-1 mt-1`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" style={{ color: colorValues.primary }} />
                        <span className="font-medium">{appointment.doctor_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" style={{ color: colorValues.primary }} />
                        <span>{new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" style={{ color: colorValues.primary }} />
                        <span>{typeof appointment.appointment_time === 'string' && appointment.appointment_time.includes(':') ? appointment.appointment_time.slice(0,5) : appointment.appointment_time}</span>
                      </div>
                    </div>
                    {appointment.reason && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Reason: </span>
                          {appointment.reason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <QuickViewDialog appointment={appointment} />
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}