'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, FileText, MessageSquare, AlertCircle, Clock, CheckCircle, Sparkles, Calendar, TrendingUp, Activity, Stethoscope, Plus, Bell, Eye } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { ViewDetailsDialog, SendMessageDialog } from '@/components/doctor/dialogs'
import { useTheme } from '@/lib/theme-context'
import { useRouter } from 'next/navigation'
import { SuccessNotification } from '@/components/ui/success-notification'

interface DashboardData {
  todayStats: {
    appointmentsToday: number
    appointmentsCompleted: number
    prescriptionsIssued: number
    labReviewsPending: number
  }
  upcomingAppointments: any[]
  recentMessages: any[]
  criticalAlerts: any[]
  aiDiagnoses: any[]
  weeklyInsights: {
    patientSatisfaction: number
    avgResponseTime: number
    diagnosesAccuracy: number
    totalPatients: number
    completedAppointments: number
    prescriptionsIssued: number
  }
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const router = useRouter()
  const colorValues = getColorValues()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [doctorStats, setDoctorStats] = useState({ 
    totalPatients: 0, 
    totalAppointments: 0, 
    completedAppointments: 0,
    totalRevenue: 0,
    doctorEarnings: 0,
    adminCut: 0,
    consultationFee: 0
  })
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ isVisible: false, message: '', patientName: '' })
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData()
      fetchDoctorStats()
      fetchAnnouncements()
    }
  }, [user?.id])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/doctor/dashboard?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctorStats = async () => {
    try {
      const response = await fetch(`/api/doctor/stats?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setDoctorStats(data)
      }
    } catch (error) {
      console.error('Error fetching doctor stats:', error)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/doctor/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-10 bg-muted rounded w-80 mb-3"></div>
              <div className="h-5 bg-muted rounded w-64"></div>
            </div>
            <div className="flex gap-2">
              <div className="animate-pulse">
                <div className="h-10 w-24 bg-muted rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-10 w-28 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-12"></div>
                  </div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointments Skeleton */}
            <Card className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 bg-muted rounded w-48"></div>
                  <div className="h-8 w-24 bg-muted rounded"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-muted rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-40"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-5 w-20 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* AI Diagnoses Skeleton */}
            <Card className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 bg-muted rounded w-44"></div>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-4 bg-muted rounded w-24"></div>
                            <div className="h-4 w-16 bg-muted rounded"></div>
                          </div>
                          <div className="h-3 bg-muted rounded w-full mb-2"></div>
                        </div>
                        <div className="h-3 w-16 bg-muted rounded"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-32 bg-muted rounded"></div>
                        <div className="h-8 w-28 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Critical Alerts Skeleton */}
            <Card className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-5 bg-muted rounded w-28"></div>
                  <div className="h-5 w-16 bg-muted rounded"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-4 w-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                      <div className="h-3 bg-muted rounded w-full mb-1"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Messages Skeleton */}
            <Card className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-5 bg-muted rounded w-32"></div>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-4 w-12 bg-muted rounded"></div>
                      </div>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Actions Skeleton */}
            <Card className="p-6">
              <div className="animate-pulse">
                <div className="h-5 bg-muted rounded w-28 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-muted rounded w-full"></div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Insights Skeleton */}
            <Card className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 bg-muted rounded"></div>
                  <div className="h-5 bg-muted rounded w-36"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border">
                      <div className="h-4 bg-muted rounded w-40 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const upcomingAppointments = dashboardData?.upcomingAppointments || []
  const recentMessages = dashboardData?.recentMessages || []
  const criticalAlerts = dashboardData?.criticalAlerts || []
  const aiDiagnoses = dashboardData?.aiDiagnoses || []
  
  const todayStats = [
    { 
      label: 'Total Appointments', 
      value: doctorStats?.totalAppointments?.toString() || '0', 
      status: `${(doctorStats?.totalAppointments || 0) - (doctorStats?.completedAppointments || 0)} remaining`, 
      icon: Calendar, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Patients Seen', 
      value: doctorStats?.completedAppointments?.toString() || '0', 
      status: 'Completed appointments', 
      icon: Users, 
      color: 'text-green-600' 
    },
    { 
      label: 'Total Revenue', 
      value: `$${doctorStats?.totalRevenue || 0}`, 
      status: 'From completed appointments', 
      icon: FileText, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Your Earnings', 
      value: `$${doctorStats?.doctorEarnings || 0}`, 
      status: '80% of total revenue', 
      icon: Activity, 
      color: 'text-orange-600' 
    },
  ]
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
              Good morning, Dr. {user?.name?.split(' ')[1] || user?.name}!
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              You have {doctorStats?.totalAppointments || 0} total appointments with {doctorStats?.completedAppointments || 0} completed
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ViewDetailsDialog title="Alerts & Announcements" data={{alerts: criticalAlerts.length, announcements: announcements.length, highPriority: criticalAlerts.filter(a => a.severity === 'high').length, mediumPriority: criticalAlerts.filter(a => a.severity === 'medium').length, lastUpdate: criticalAlerts[0]?.time || 'No recent alerts', recentAnnouncements: announcements.slice(0, 3).map(a => `${a.title} - ${a.priority}`).join(', ') || 'No announcements'}}>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({criticalAlerts.length + announcements.length})
              </Button>
            </ViewDetailsDialog>
            <SendMessageDialog>
              <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                Quick Note
              </Button>
            </SendMessageDialog>
          </div>
        </div>
      </Card>

      {/* Today's Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {todayStats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.status}</p>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Appointments & Messages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Today's Appointments</h2>
              <ViewDetailsDialog title="Today's Schedule" data={{totalAppointments: doctorStats.totalAppointments, completed: doctorStats.completedAppointments, remaining: doctorStats.totalAppointments - doctorStats.completedAppointments, nextPatient: upcomingAppointments[0] ? `${upcomingAppointments[0].patient} at ${upcomingAppointments[0].time}` : 'No upcoming appointments', totalRevenue: doctorStats.totalRevenue, doctorEarnings: doctorStats.doctorEarnings, adminCut: doctorStats.adminCut}}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </ViewDetailsDialog>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? upcomingAppointments.map((appointment, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <Stethoscope className="h-5 w-5" style={{ color: colorValues.primary }} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type} - {appointment.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{appointment.time}</p>
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </Card>

          {/* Pending AI Diagnoses */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Pending AI Diagnoses</h2>
              <ViewDetailsDialog title="Pending AI Diagnoses" data={{totalPending: aiDiagnoses.length, highConfidence: aiDiagnoses.filter(d => parseInt(d.confidence) >= 80).length, needsReview: aiDiagnoses.length, avgConfidence: aiDiagnoses.length > 0 ? Math.round(aiDiagnoses.reduce((acc, d) => acc + parseInt(d.confidence), 0) / aiDiagnoses.length) + '%' : '0%'}}>
              <Button variant="outline" size="sm">View All ({aiDiagnoses.length})</Button>
            </ViewDetailsDialog>
            </div>
            <div className="space-y-4">
              {aiDiagnoses.length > 0 ? aiDiagnoses.map((diagnosis, i) => (
                <div key={i} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{diagnosis.patient}</p>
                        <Badge variant="outline" className="text-xs">{diagnosis.confidence} confidence</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{diagnosis.symptoms}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{diagnosis.submitted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="px-3 py-1 bg-orange-100 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200 rounded text-xs font-semibold">
                      AI: {diagnosis.aiSuggestion}
                    </div>
                    <Button 
                      size="sm" 
                      className="text-white"
                      style={{ backgroundColor: colorValues.primary }}
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/doctor/ai-diagnoses', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              diagnosisId: diagnosis.id,
                              status: 'confirmed',
                              doctorNotes: 'Confirmed by doctor',
                              finalDiagnosis: diagnosis.aiSuggestion
                            })
                          })
                          if (response.ok) {
                            setNotification({
                              isVisible: true,
                              message: 'AI diagnosis confirmed successfully!',
                              patientName: diagnosis.patient
                            })
                            fetchDashboardData()
                          }
                        } catch (error) {
                          console.error('Error confirming diagnosis:', error)
                        }
                      }}
                    >
                      Review & Confirm
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending AI diagnoses</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Messages & Alerts */}
        <div className="space-y-6">
          {/* Critical Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Critical Alerts</h3>
              <Badge variant="destructive">{criticalAlerts.length} Active</Badge>
            </div>
            <div className="space-y-3">
              {criticalAlerts.length > 0 ? criticalAlerts.map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg border ${
                  alert.severity === 'high' 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                    : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className={`h-4 w-4 ${
                      alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      alert.severity === 'high' 
                        ? 'text-red-900 dark:text-red-100' 
                        : 'text-yellow-900 dark:text-yellow-100'
                    }`}>{alert.patient}</span>
                  </div>
                  <p className={`text-xs mb-1 ${
                    alert.severity === 'high' 
                      ? 'text-red-800 dark:text-red-200' 
                      : 'text-yellow-800 dark:text-yellow-200'
                  }`}>{alert.alert}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              )) : (
                <div className="text-center py-4 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No critical alerts</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Messages */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Messages</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/doctor/messages')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentMessages.length > 0 ? recentMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className="group p-4 border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-r hover:from-muted/30 hover:to-transparent"
                  style={{ borderColor: `${colorValues.primary}20` }}
                  onClick={() => router.push('/doctor/messages')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: colorValues.primary }}>
                        {msg.patient?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{msg.patient}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs px-2 py-1">{msg.messageCount} new</Badge>
                      <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-110 transition-transform"></div>
                    </div>
                  </div>
                  <div className="pl-13">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {msg.lastMessage || 'New message received'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colorValues.primary}10` }}>
                    <MessageSquare className="h-8 w-8 opacity-50" style={{ color: colorValues.primary }} />
                  </div>
                  <p className="text-sm font-medium mb-1">No new messages</p>
                  <p className="text-xs">Messages from patients will appear here</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push('/doctor/patients')}
              >
                <Users className="h-4 w-4" style={{ color: colorValues.primary }} />
                View Patient List
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push('/doctor/reports')}
              >
                <FileText className="h-4 w-4" style={{ color: colorValues.primary }} />
                Lab Reports
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push('/doctor/appointments')}
              >
                <Calendar className="h-4 w-4" style={{ color: colorValues.primary }} />
                Schedule Appointment
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push('/doctor/prescriptions')}
              >
                <TrendingUp className="h-4 w-4" style={{ color: colorValues.primary }} />
                Prescriptions
              </Button>
            </div>
          </Card>

          {/* Performance Insights */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5" style={{ color: colorValues.primary }} />
              <h3 className="text-lg font-semibold text-foreground">This Week's Insights</h3>
            </div>
            <div className="space-y-3">
              {dashboardData?.weeklyInsights ? (
                <>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Patient Satisfaction: {dashboardData.weeklyInsights.patientSatisfaction}%
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {dashboardData.weeklyInsights.patientSatisfaction >= 90 ? 'Excellent performance' : 
                       dashboardData.weeklyInsights.patientSatisfaction >= 80 ? 'Good performance' : 'Needs improvement'}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Response Time: {dashboardData.weeklyInsights.avgResponseTime} min avg
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {dashboardData.weeklyInsights.avgResponseTime <= 15 ? 'Excellent response time' : 
                       dashboardData.weeklyInsights.avgResponseTime <= 30 ? 'Good response time' : 'Consider improving'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Weekly Activity: {dashboardData.weeklyInsights.completedAppointments} appointments
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      {dashboardData.weeklyInsights.prescriptionsIssued} prescriptions issued
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      Total Patients: {dashboardData.weeklyInsights.totalPatients}
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Active patient roster
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Loading insights...</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      <SuccessNotification
        message={notification.message}
        patientName={notification.patientName}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ isVisible: false, message: '', patientName: '' })}
      />
    </div>
  )
}
