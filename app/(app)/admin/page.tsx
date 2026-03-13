'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Stethoscope, AlertCircle, BarChart3, Activity, Bell, Sparkles, Calendar, TrendingUp, Plus, Eye, MessageSquare, FileText, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { AddDoctorDialog, AddPatientDialog, SendAlertDialog, ViewDetailsDialog, SystemAlertsDialog } from '@/components/admin/dialogs'
import Link from 'next/link'

interface AdminStats {
  totalUsers: number
  activeDoctors: number
  todayAppointments: number
  systemAlerts: number
  totalRevenue?: number
  completedAppointments?: number
  totalAdminCut?: number
}

interface AdminDashboardData {
  stats: AdminStats
  appointments: any[]
  recentActivity: any[]
  systemAlerts: any[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    stats: { totalUsers: 0, activeDoctors: 0, todayAppointments: 0, systemAlerts: 0 },
    appointments: [],
    recentActivity: [],
    systemAlerts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
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

  const todayStats = [
    { label: 'Total Users', value: loading ? '...' : dashboardData.stats.totalUsers.toString(), status: loading ? 'Loading...' : `${dashboardData.stats.totalUsers} registered`, icon: Users, color: 'text-blue-600' },
    { label: 'Active Doctors', value: loading ? '...' : dashboardData.stats.activeDoctors.toString(), status: loading ? 'Loading...' : `${dashboardData.stats.activeDoctors} available`, icon: Stethoscope, color: 'text-green-600' },
    { label: 'Today\'s Appointments', value: loading ? '...' : dashboardData.stats.todayAppointments.toString(), status: loading ? 'Loading...' : `${dashboardData.appointments.filter(a => a.status === 'confirmed').length} confirmed`, icon: Calendar, color: 'text-purple-600' },
    { label: 'System Alerts', value: loading ? '...' : dashboardData.stats.systemAlerts.toString(), status: loading ? 'Loading...' : `${dashboardData.systemAlerts.filter(a => a.severity === 'critical').length} critical`, icon: AlertCircle, color: 'text-red-600' },
  ]


  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              System overview and management dashboard
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/announcements" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Alerts 
              </Button>
            </Link>
            <SendAlertDialog onAlertSent={fetchDashboardData}>
              <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1 sm:flex-none w-full">
                <Plus className="h-4 w-4 mr-2" />
                Quick Action
              </Button>
            </SendAlertDialog>
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
                  <div className="text-2xl font-bold text-foreground mt-1">
                    {loading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                ) : (
                  stat.status
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Activity & Users */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Today's Appointments</h2>
              <ViewDetailsDialog title="All Appointments" data={{totalAppointments: dashboardData.appointments.length, confirmedAppointments: dashboardData.appointments.filter(a => a.status === 'confirmed').length, pendingAppointments: dashboardData.appointments.filter(a => a.status === 'pending').length}}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </ViewDetailsDialog>
            </div>
            <div className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background rounded-lg">
                        <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-muted animate-pulse rounded mb-1"></div>
                        <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded mb-1"></div>
                      <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                ))
              ) : dashboardData.appointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                dashboardData.appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background rounded-lg">
                        <Calendar className="h-4 w-4" style={{ color: colorValues.primary }} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.doctor} • {appointment.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{appointment.time}</p>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : appointment.status === 'pending' ? 'secondary' : 'outline'}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
              <ViewDetailsDialog title="All Recent Activity" data={{totalActivities: 156, todayActivities: 23, lastActivity: '2 min ago', mostActiveUser: 'Dr. Smith'}}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </ViewDetailsDialog>
            </div>
            <div className="space-y-4">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 w-48 bg-muted animate-pulse rounded mb-1"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                ))
              ) : dashboardData.recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                dashboardData.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-100 dark:bg-green-950/20' : 
                      activity.status === 'info' ? 'bg-blue-100 dark:bg-blue-950/20' : 'bg-orange-100 dark:bg-orange-950/20'
                    }`}>
                      <Activity className={`h-5 w-5 ${
                        activity.status === 'success' ? 'text-green-600' : 
                        activity.status === 'info' ? 'text-blue-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* System Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">System Overview</h2>
              <ViewDetailsDialog title="System Overview Details" data={{uptime: '99.8%', responseTime: '2.3s', activeUsers: 324, systemLoad: '45%', memoryUsage: '67%', diskSpace: '78%'}}>
                <Button variant="outline" size="sm">View Details</Button>
              </ViewDetailsDialog>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? (
                    <span className="inline-block h-8 w-12 bg-blue-200 dark:bg-blue-800 animate-pulse rounded"></span>
                  ) : (
                    dashboardData.stats.totalUsers
                  )}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">Registered users</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900 dark:text-green-100">Active Doctors</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? (
                    <span className="inline-block h-8 w-12 bg-green-200 dark:bg-green-800 animate-pulse rounded"></span>
                  ) : (
                    dashboardData.stats.activeDoctors
                  )}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">Available doctors</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-900 dark:text-purple-100">Appointments</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {loading ? (
                    <span className="inline-block h-8 w-12 bg-purple-200 dark:bg-purple-800 animate-pulse rounded"></span>
                  ) : (
                    dashboardData.stats.todayAppointments
                  )}
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">Today's appointments</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-emerald-900 dark:text-emerald-100">Total Revenue</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {loading ? (
                    <span className="inline-block h-8 w-12 bg-emerald-200 dark:bg-emerald-800 animate-pulse rounded"></span>
                  ) : (
                    `$${dashboardData.stats.totalRevenue?.toLocaleString() || 0}`
                  )}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{dashboardData.stats.completedAppointments || 0} completed</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-900 dark:text-amber-100">Admin Revenue</span>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {loading ? (
                    <span className="inline-block h-8 w-12 bg-amber-200 dark:bg-amber-800 animate-pulse rounded"></span>
                  ) : (
                    `$${dashboardData.stats.totalAdminCut?.toLocaleString() || 0}`
                  )}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">20% platform fee</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Alerts & Actions */}
        <div className="space-y-6">
          {/* System Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
              <Badge variant="destructive">{dashboardData.stats.systemAlerts} Active</Badge>
            </div>
            <div className="space-y-3">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="h-3 w-32 bg-muted animate-pulse rounded mb-1"></div>
                    <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                  </div>
                ))
              ) : dashboardData.systemAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active alerts</p>
                </div>
              ) : (
                dashboardData.systemAlerts.map((alert, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${
                    alert.severity === 'critical' 
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                      : alert.severity === 'high'
                      ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                      : alert.severity === 'medium' 
                      ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' 
                      : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className={`h-4 w-4 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        alert.severity === 'critical' 
                          ? 'text-red-900 dark:text-red-100' 
                          : alert.severity === 'high'
                          ? 'text-orange-900 dark:text-orange-100'
                          : alert.severity === 'medium' 
                          ? 'text-yellow-900 dark:text-yellow-100' 
                          : 'text-blue-900 dark:text-blue-100'
                      }`}>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</span>
                    </div>
                    <p className={`text-xs mb-1 ${
                      alert.severity === 'critical' 
                        ? 'text-red-800 dark:text-red-200' 
                        : alert.severity === 'high'
                        ? 'text-orange-800 dark:text-orange-200'
                        : alert.severity === 'medium' 
                        ? 'text-yellow-800 dark:text-yellow-200' 
                        : 'text-blue-800 dark:text-blue-200'
                    }`}>{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <AddDoctorDialog>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Stethoscope className="h-4 w-4" style={{ color: colorValues.primary }} />
                  Add Doctor
                </Button>
              </AddDoctorDialog>
              <AddPatientDialog>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" style={{ color: colorValues.primary }} />
                  Add Patient
                </Button>
              </AddPatientDialog>
              <SendAlertDialog>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Bell className="h-4 w-4" style={{ color: colorValues.primary }} />
                  Send Alert
                </Button>
              </SendAlertDialog>
              <ViewDetailsDialog title="System Reports" data={{totalReports: 45, pendingReports: 8, completedReports: 37, lastGenerated: '1 hour ago'}}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" style={{ color: colorValues.primary }} />
                  View Reports
                </Button>
              </ViewDetailsDialog>
            </div>
          </Card>

          {/* System Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="text-xs bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-200 px-2 py-1 rounded">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">API Server</span>
                <span className="text-xs bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-200 px-2 py-1 rounded">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {loading ? '...' : dashboardData.stats.totalUsers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">System Alerts</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  dashboardData.stats.systemAlerts > 0 
                    ? 'bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-200'
                    : 'bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-200'
                }`}>
                  {loading ? '...' : dashboardData.stats.systemAlerts === 0 ? 'None' : dashboardData.stats.systemAlerts}
                </span>
              </div>
            </div>
          </Card>

          {/* Performance Insights */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5" style={{ color: colorValues.primary }} />
              <h3 className="text-lg font-semibold text-foreground">This Week's Insights</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Active Doctors: {loading ? '...' : dashboardData.stats.activeDoctors}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">Available for appointments</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Today's Appointments: {loading ? '...' : dashboardData.stats.todayAppointments}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">Scheduled for today</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  System Status: {loading ? '...' : dashboardData.stats.systemAlerts === 0 ? 'Healthy' : 'Needs Attention'}
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  {loading ? 'Loading...' : dashboardData.stats.systemAlerts === 0 ? 'All systems operational' : `${dashboardData.stats.systemAlerts} alerts active`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
