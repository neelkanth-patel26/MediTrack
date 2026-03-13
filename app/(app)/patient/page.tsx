'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Pill, FileText, MessageSquare, TrendingUp, AlertCircle, Sparkles, Calendar, Clock, Activity, Target, Bell, Plus, Eye, Search } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { SendMessageDialog, BookAppointmentDialog, AddVitalDialog, ViewDetailsDialog, RefillRequestDialog, LabResultsDialog } from '@/components/patient/dialogs'
import { useTheme } from '@/lib/theme-context'
import Link from 'next/link'

interface PatientData {
  prescriptions: any[]
  appointments: any[]
  vitals: any[]
  insights: any[]
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const [patientData, setPatientData] = useState<PatientData>({ prescriptions: [], appointments: [], vitals: [], insights: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  
  const colorValues = getColorValues()
  
  // Check if user is demo user
  const isDemoUser = user?.email?.includes('@meditrack.com') || 
    sessionStorage.getItem('isDemoUser') === 'true'

  const refreshData = () => {
    setRefreshKey(prev => prev + 1)
  }

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user) return
      
      try {
        const [patientResponse, insightsResponse, announcementsResponse] = await Promise.all([
          fetch(`/api/patient/data?userId=${user.id}&isDemoUser=${isDemoUser}`),
          fetch(`/api/health-insights?userId=${user.id}`),
          fetch('/api/patient/announcements')
        ])
        
        const patientData = await patientResponse.json()
        const insightsData = await insightsResponse.json()
        const announcementsData = await announcementsResponse.json()
        
        setPatientData({
          ...patientData,
          insights: insightsData.insights || []
        })
        setAnnouncements(announcementsData.announcements || [])
      } catch (error) {
        console.error('Failed to fetch patient data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatientData()
  }, [user, isDemoUser, refreshKey])
  
  const healthMetrics = [
    { 
      label: 'Blood Pressure', 
      value: patientData.vitals[0] ? `${patientData.vitals[0].blood_pressure_systolic}/${patientData.vitals[0].blood_pressure_diastolic}` : '--/--', 
      status: patientData.vitals[0] ? 'Normal' : 'No data', 
      trend: patientData.vitals[0] ? '+2%' : '--', 
      icon: Heart, 
      color: 'text-red-600' 
    },
    { 
      label: 'Heart Rate', 
      value: patientData.vitals[0]?.heart_rate?.toString() || '--', 
      status: patientData.vitals[0] ? `${patientData.vitals[0].heart_rate} bpm` : 'No data', 
      trend: patientData.vitals[0] ? 'Stable' : '--', 
      icon: TrendingUp, 
      color: 'text-green-600' 
    },
    { 
      label: 'Weight', 
      value: patientData.vitals[0]?.weight?.toString() || '--', 
      status: patientData.vitals[0] ? `${patientData.vitals[0].weight} kg` : 'No data', 
      trend: patientData.vitals[0] ? '-0.2kg' : '--', 
      icon: Activity, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Temperature', 
      value: patientData.vitals[0]?.temperature?.toString() || '--', 
      status: patientData.vitals[0] ? `${patientData.vitals[0].temperature}°C` : 'No data', 
      trend: patientData.vitals[0] ? 'Normal' : '--', 
      icon: Target, 
      color: 'text-purple-600' 
    },
  ]

  const recentActivity = [
    { type: 'vitals', description: 'Blood pressure logged: 120/80', time: '2 hours ago', icon: Heart },
    { type: 'prescription', description: 'Prescription refill requested', time: '1 day ago', icon: Pill },
    { type: 'message', description: 'Message from Dr. Urmi Thakkar', time: '2 days ago', icon: MessageSquare },
    { type: 'report', description: 'Lab results available', time: '3 days ago', icon: FileText },
  ]
  
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header Skeleton */}
        <Card className="p-4 sm:p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </Card>
        
        {/* Health Metrics Skeleton */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Main Content Skeleton */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                          <div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Here's your health overview for today
            </p>
            {!isDemoUser && (
              <p className="text-sm text-muted-foreground mt-1">
                Real patient data from database
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link href="/patient/find-doctors" className="flex-1 sm:flex-none">
              <Button variant="outline" size="sm" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Find Doctors
              </Button>
            </Link>
            <ViewDetailsDialog title="Notifications & Announcements" data={{totalNotifications: 5, announcements: announcements.length, unread: 2, lastNotification: '2 hours ago', urgentAlerts: 1, recentAnnouncements: announcements.slice(0, 3).map(a => `${a.title} - ${a.priority}`).join(', ') || 'No announcements'}}>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Bell className="h-4 w-4 mr-2" />
                Notifications ({5 + announcements.length})
              </Button>
            </ViewDetailsDialog>
            <AddVitalDialog>
              <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1 sm:flex-none" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Quick Log
              </Button>
            </AddVitalDialog>
          </div>
        </div>
      </Card>

      {/* Health Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {healthMetrics.map((metric, i) => {
          const Icon = metric.icon
          return (
            <Card key={i} className="p-4 hover:shadow-lg transition-all duration-200">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color}`} />
                  <Badge variant="outline" className="text-xs">{metric.trend}</Badge>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.status}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {!isDemoUser && patientData.prescriptions.length === 0 && patientData.appointments.length === 0 && (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Welcome to MediTrack+</h3>
              <p className="text-muted-foreground mb-4">You're using a real account. Start by finding doctors and booking appointments.</p>
              <Link href="/patient/find-doctors">
                <Button style={{ backgroundColor: colorValues.primary }} className="text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Find Doctors
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* Active Prescriptions */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Active Prescriptions</h2>
            <ViewDetailsDialog title="All Prescriptions" data={{totalPrescriptions: patientData.prescriptions.length, activePrescriptions: patientData.prescriptions.filter(p => p.status === 'active').length, refillsNeeded: 1, lastRefill: '1 week ago'}}>
              <Button variant="outline" size="sm" className="w-full sm:w-auto h-9">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </ViewDetailsDialog>
          </div>
          <div className="space-y-3">
            {patientData.prescriptions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No active prescriptions</p>
            ) : (
              patientData.prescriptions.slice(0, 3).map((rx, i) => (
                <div key={rx.id || i} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Pill className="h-4 w-4" style={{ color: colorValues.primary }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{rx.medication_name}</p>
                      <p className="text-xs text-muted-foreground">{rx.dosage} - {rx.frequency}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={rx.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {rx.refills} refills
                    </Badge>
                    <RefillRequestDialog prescriptions={[rx]} onRefillSuccess={refreshData}>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Refill
                      </Button>
                    </RefillRequestDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Appointments</h3>
            <div className="flex flex-row flex-wrap gap-2 w-full sm:w-auto">
              <Link href="/patient/appointments" className="flex-1 sm:flex-none">
                <Button variant="outline" size="sm" className="w-full h-9">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
              <BookAppointmentDialog>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-9">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book New
                </Button>
              </BookAppointmentDialog>
            </div>
          </div>
          <div className="space-y-3">
            {patientData.appointments.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-3">No upcoming appointments</p>
                <BookAppointmentDialog>
                  <Button size="sm" style={{ backgroundColor: colorValues.primary }} className="text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </BookAppointmentDialog>
              </div>
            ) : (
              patientData.appointments.slice(0, 3).map((appointment, i) => (
                <div key={appointment.id || i} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                        <Calendar className="h-5 w-5" style={{ color: colorValues.primary }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{appointment.appointment_type}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{appointment.doctor_name}</p>
                      </div>
                    </div>
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : appointment.status === 'pending' ? 'secondary' : 'outline'} className="text-xs">
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{typeof appointment.appointment_time === 'string' && appointment.appointment_time.includes(':') ? appointment.appointment_time.slice(0,5) : appointment.appointment_time}</span>
                    </div>
                  </div>
                  {appointment.reason && (
                    <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Reason: </span>
                      <span className="text-slate-600 dark:text-slate-400">{appointment.reason}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="text-xs text-slate-500">
                      {appointment.status === 'confirmed' && (
                        <span className="text-green-600">✓ Confirmed</span>
                      )}
                      {appointment.status === 'pending' && (
                        <span className="text-yellow-600">⏳ Awaiting confirmation</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-red-600">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <AddVitalDialog>
              <Button variant="outline" className="w-full justify-center gap-2 h-12">
                <Heart className="h-4 w-4" style={{ color: colorValues.primary }} />
                <span className="text-sm">Log Vitals</span>
              </Button>
            </AddVitalDialog>
            <RefillRequestDialog prescriptions={patientData.prescriptions} onRefillSuccess={refreshData}>
              <Button variant="outline" className="w-full justify-center gap-2 h-12">
                <Pill className="h-4 w-4" style={{ color: colorValues.primary }} />
                <span className="text-sm">Request Refill</span>
              </Button>
            </RefillRequestDialog>
            <SendMessageDialog>
              <Button variant="outline" className="w-full justify-center gap-2 h-12">
                <MessageSquare className="h-4 w-4" style={{ color: colorValues.primary }} />
                <span className="text-sm">Message Doctor</span>
              </Button>
            </SendMessageDialog>
            <LabResultsDialog>
              <Button variant="outline" className="w-full justify-center gap-2 h-12">
                <FileText className="h-4 w-4" style={{ color: colorValues.primary }} />
                <span className="text-sm">Lab Results</span>
              </Button>
            </LabResultsDialog>
          </div>
        </Card>

        {/* Health Insights */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5" style={{ color: colorValues.primary }} />
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Health Insights</h2>
          </div>
          <div className="space-y-3">
            {patientData.insights?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No insights available</p>
            ) : (
              patientData.insights?.map((insight, i) => {
                const bgColor = insight.type === 'positive' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                               insight.type === 'reminder' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' :
                               'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                const textColor = insight.type === 'positive' ? 'text-green-900 dark:text-green-100' :
                                 insight.type === 'reminder' ? 'text-orange-900 dark:text-orange-100' :
                                 'text-blue-900 dark:text-blue-100'
                const descColor = insight.type === 'positive' ? 'text-green-800 dark:text-green-200' :
                                 insight.type === 'reminder' ? 'text-orange-800 dark:text-orange-200' :
                                 'text-blue-800 dark:text-blue-200'
                
                return (
                  <div key={i} className={`p-3 rounded-lg border ${bgColor}`}>
                    <h3 className={`font-semibold mb-1 text-sm ${textColor}`}>{insight.title}</h3>
                    <p className={`text-xs ${descColor}`}>{insight.message}</p>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
