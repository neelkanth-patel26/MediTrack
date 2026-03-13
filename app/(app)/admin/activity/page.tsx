'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Activity, Users, Stethoscope, Shield, Clock, TrendingUp, Filter, Download } from 'lucide-react'
import { ViewDetailsDialog } from '@/components/admin/dialogs'
import { useTheme } from '@/lib/theme-context'

export default function AdminActivity() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterAction, setFilterAction] = useState('all')
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/activity')
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadLog = () => {
    const csv = [
      ['Timestamp', 'User', 'User Type', 'Action', 'Details', 'Category', 'IP Address'],
      ...activities.map(a => [
        new Date(a.timestamp).toLocaleString(),
        a.user,
        a.userType,
        a.action,
        a.details,
        a.category,
        a.ipAddress
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || activity.userType === filterType
    const matchesAction = filterAction === 'all' || activity.category === filterAction
    
    return matchesSearch && matchesType && matchesAction
  })

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin': return <Shield className="h-4 w-4" />
      case 'doctor': return <Stethoscope className="h-4 w-4" />
      case 'patient': return <Users className="h-4 w-4" />
      case 'system': return <Activity className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      case 'medium': return 'text-orange-600'
      case 'info': return 'text-blue-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const todayStats = [
    { label: 'Total Activities', value: activities.length.toString(), icon: Activity, color: 'text-blue-600' },
    { label: 'User Actions', value: activities.filter(a => a.userType !== 'system').length.toString(), icon: Users, color: 'text-green-600' },
    { label: 'System Events', value: activities.filter(a => a.userType === 'system').length.toString(), icon: Shield, color: 'text-purple-600' },
    { label: 'Admin Actions', value: activities.filter(a => a.userType === 'admin').length.toString(), icon: Clock, color: 'text-red-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
            <p className="text-muted-foreground">System activities and comprehensive audit trail</p>
          </div>
          <div className="flex gap-2">
            <ViewDetailsDialog title="Export Options" data={{
              format: 'CSV',
              dateRange: 'All Time',
              totalRecords: activities.length,
              fileSize: `${(activities.length * 0.5).toFixed(1)} KB`
            }}>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Export Options
              </Button>
            </ViewDetailsDialog>
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white" onClick={downloadLog}>
              <Download className="h-4 w-4 mr-2" />
              Download Log
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

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search activities, users, or actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
              <SelectItem value="doctor">Doctors</SelectItem>
              <SelectItem value="patient">Patients</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by action type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="authentication">Authentication</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="report">Reports</SelectItem>
              <SelectItem value="user_management">User Management</SelectItem>
              <SelectItem value="data_modification">Data Changes</SelectItem>
              <SelectItem value="system">System Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Activity Feed */}
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </Card>
          ))
        ) : filteredActivities.length === 0 ? (
          <Card className="p-8 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activities found matching your filters.</p>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
          <Card key={activity.id} className="p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/50 rounded-lg">
                  {getUserTypeIcon(activity.userType)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{activity.user}</span>
                    <Badge variant={activity.userType === 'admin' ? 'destructive' : activity.userType === 'doctor' ? 'default' : activity.userType === 'system' ? 'secondary' : 'outline'}>
                      {activity.userType}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(activity.severity).replace('text-', 'bg-')}`}></div>
                  </div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{activity.timestamp}</p>
                <p className="text-xs">{activity.ipAddress}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Category: {activity.category.replace('_', ' ')}</span>
                <span className={`font-medium ${getSeverityColor(activity.severity)}`}>
                  {activity.severity.toUpperCase()}
                </span>
              </div>
              <ViewDetailsDialog title={`Activity Details: ${activity.action}`} data={activity}>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </ViewDetailsDialog>
            </div>
          </Card>
          ))
        )}
      </div>

      {/* Summary Footer */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredActivities.length} of {activities.length} activities</span>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </Card>
    </div>
  )
}
