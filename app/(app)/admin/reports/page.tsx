'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, BarChart3, TrendingUp, Users, Activity, Calendar, Filter, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ViewDetailsDialog } from '@/components/admin/dialogs'
import { useTheme } from '@/lib/theme-context'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('30d')
  const [reportType, setReportType] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/admin/reports?timeRange=${timeRange}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
    const interval = setInterval(fetchReports, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const exportReport = () => {
    if (!data) return
    
    const rows = [
      ['Report Type', reportType],
      ['Time Range', timeRange],
      ['Generated', new Date().toLocaleString()],
      [''],
      ['STATISTICS'],
      ['Total Users', data.stats.totalUsers],
      ['Total Doctors', data.stats.totalDoctors],
      ['Total Patients', data.stats.totalPatients],
      ['Appointments', data.stats.appointments],
      ['Diagnoses', data.stats.diagnoses],
      ['Prescriptions', data.stats.prescriptions],
      ['Critical Alerts', data.stats.criticalAlerts],
      [''],
      ['TOP DIAGNOSES'],
      ['Condition', 'Count', 'Percentage'],
      ...data.topDiagnoses.map((d: any) => [d.condition, d.count, `${d.percentage}%`]),
      [''],
      ['DOCTOR PERFORMANCE'],
      ['Name', 'Patients', 'Appointments', 'Diagnoses', 'Earnings'],
      ...data.doctorPerformance.map((d: any) => [d.name, d.patients, d.appointments, d.diagnoses, `$${d.earnings}`])
    ]
    
    const csv = rows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </Card>
        <Card className="p-4">
          <div className="flex gap-4">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-40" />
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1,2].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-80 w-full" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const todayStats = [
    { label: 'Total Users', value: data.stats.totalUsers.toString(), change: `${data.stats.totalDoctors} doctors, ${data.stats.totalPatients} patients`, icon: Users, color: 'text-blue-600' },
    { label: 'Appointments', value: data.stats.appointments.toString(), change: `In selected period`, icon: Activity, color: 'text-green-600' },
    { label: 'Total Diagnoses', value: data.stats.diagnoses.toString(), change: `In selected period`, icon: BarChart3, color: 'text-purple-600' },
    { label: 'Prescriptions', value: data.stats.prescriptions.toString(), change: `In selected period`, icon: TrendingUp, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive system statistics and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setLoading(true)
              fetchReports()
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="users">User Analytics</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="medical">Medical Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <p className="text-sm text-muted-foreground">{stat.change}</p>
            </Card>
          )
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-purple-600">{data.stats.appointments}</p>
          <p className="text-sm text-muted-foreground">Total Appointments</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-blue-600">{data.stats.totalDoctors}</p>
          <p className="text-sm text-muted-foreground">Active Doctors</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-green-600">{data.stats.totalPatients}</p>
          <p className="text-sm text-muted-foreground">Total Patients</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-orange-600">{data.stats.diagnoses}</p>
          <p className="text-sm text-muted-foreground">Total Diagnoses</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-red-600">{data.stats.criticalAlerts}</p>
          <p className="text-sm text-muted-foreground">Critical Alerts</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-teal-600">{data.stats.prescriptions}</p>
          <p className="text-sm text-muted-foreground">Prescriptions</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">User Growth</h2>
            <ViewDetailsDialog title="User Growth Details" data={{totalDoctors: 20, totalPatients: 284, growthRate: '15%', monthlyIncrease: 18}}>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </ViewDetailsDialog>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#f1f5f9' }} />
              <Legend />
              <Line type="monotone" dataKey="doctors" stroke={colorValues.primary} strokeWidth={2} name="Doctors" />
              <Line type="monotone" dataKey="patients" stroke="#64748b" strokeWidth={2} name="Patients" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Weekly Activity</h2>
            <ViewDetailsDialog title="Weekly Activity Details" data={{totalLogins: 1650, totalDiagnoses: 124, totalPrescriptions: 227, avgDaily: 58}}>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </ViewDetailsDialog>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#f1f5f9' }} />
              <Legend />
              <Bar dataKey="logins" fill={colorValues.primary} name="Logins" />
              <Bar dataKey="diagnoses" fill="#3b82f6" name="Diagnoses" />
              <Bar dataKey="prescriptions" fill="#64748b" name="Prescriptions" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground">System Performance</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              <p className="mt-2 text-2xl font-bold text-foreground">245ms</p>
              <p className="text-xs text-green-600">Excellent (-15ms vs last week)</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">System Uptime</p>
              <p className="mt-2 text-2xl font-bold text-foreground">99.9%</p>
              <p className="text-xs text-green-600">30 days continuous</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Database Size</p>
              <p className="mt-2 text-2xl font-bold text-foreground">2.4GB</p>
              <p className="text-xs text-yellow-600">78% capacity used</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">API Calls/Hour</p>
              <p className="mt-2 text-2xl font-bold text-foreground">45,234</p>
              <p className="text-xs text-green-600">Peak: 67,890 at 2 PM</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground">Top Diagnoses This Period</h2>
          <div className="space-y-3">
            {data.topDiagnoses && data.topDiagnoses.length > 0 ? data.topDiagnoses.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{item.condition}</p>
                  <p className="text-sm text-muted-foreground">{item.count} cases</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{item.percentage}%</p>
                  <div className="w-16 h-2 bg-muted rounded-full mt-1">
                    <div 
                      className="h-full rounded-full" 
                      style={{width: `${item.percentage}%`, backgroundColor: colorValues.primary}}
                    ></div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No diagnosis data available yet.</p>
                <p className="text-xs text-muted-foreground">Diagnoses will appear here once doctors start using the AI diagnostic tool.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Doctor Performance & Patient Demographics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground">Doctor Performance</h2>
          <div className="space-y-4">
            {data.doctorPerformance.length > 0 ? data.doctorPerformance.map((doctor: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.patients} patients • {doctor.diagnoses} diagnoses</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Appointments: <span className="font-bold text-foreground">{doctor.appointments}</span></p>
                  <p className="text-sm text-muted-foreground">Earnings: <span className="font-bold text-green-600">${doctor.earnings.toLocaleString()}</span></p>
                </div>
              </div>
            )) : <p className="text-sm text-muted-foreground">No doctor data available</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground">Patient Demographics</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3 text-foreground">Age Distribution</h3>
              <div className="space-y-2">
                {data.demographics.age.map((age: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{age.range} years</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full rounded-full" 
                          style={{width: `${age.percentage}%`, backgroundColor: colorValues.primary}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-foreground">{age.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <h3 className="font-medium mb-3 text-foreground">Gender Distribution</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{data.demographics.gender.female.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Female ({data.demographics.gender.female.count})</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{data.demographics.gender.male.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Male ({data.demographics.gender.male.count})</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
