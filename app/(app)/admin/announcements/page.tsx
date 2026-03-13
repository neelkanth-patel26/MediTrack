'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Edit, Eye, Bell, Users, Stethoscope, Shield, Calendar, TrendingUp, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CreateAnnouncementDialog, ViewDetailsDialog, EditItemDialog } from '@/components/admin/dialogs'
import { useTheme } from '@/lib/theme-context'

export default function AdminAnnouncements() {
  const [searchTerm, setSearchTerm] = useState('')
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  useEffect(() => {
    fetchAnnouncements()
    const interval = setInterval(fetchAnnouncements, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'normal': return 'text-blue-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getRecipientIcon = (recipients: string) => {
    switch (recipients) {
      case 'Doctors': return <Stethoscope className="h-4 w-4" />
      case 'Patients': return <Users className="h-4 w-4" />
      case 'All Users': return <Shield className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const todayStats = [
    { label: 'Total Announcements', value: announcements.length.toString(), icon: Bell, color: 'text-blue-600' },
    { label: 'Active Announcements', value: announcements.filter(a => a.status === 'active').length.toString(), icon: TrendingUp, color: 'text-green-600' },
    { label: 'All Users', value: announcements.filter(a => a.recipients === 'All Users').length.toString(), icon: Eye, color: 'text-purple-600' },
    { label: 'High Priority', value: announcements.filter(a => a.priority === 'high').length.toString(), icon: Calendar, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Send system-wide notifications and manage communications</p>
          </div>
          <CreateAnnouncementDialog onAnnouncementCreated={fetchAnnouncements}>
            <Button
              className="gap-2 text-white"
              style={{ backgroundColor: colorValues.primary }}
            >
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
          </CreateAnnouncementDialog>
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



      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Published Announcements */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </Card>
          ))
        ) : filteredAnnouncements.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No announcements found matching your search.</p>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{announcement.title}</h3>
                  <Badge variant={announcement.status === 'active' ? 'default' : 'secondary'}>
                    {announcement.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(announcement.priority).replace('text-', 'bg-')}`}></div>
                </div>
                <p className="text-muted-foreground mb-3">{announcement.message}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {getRecipientIcon(announcement.recipients)}
                    <span>{announcement.recipients}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(announcement.published).toLocaleDateString()}</span>
                  </div>
                  <span>By: {announcement.publishedBy}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <ViewDetailsDialog title={`Announcement: ${announcement.title}`} data={announcement}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </ViewDetailsDialog>
                <EditItemDialog title={`Edit: ${announcement.title}`} data={announcement}>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </EditItemDialog>
                <Button size="sm" variant="outline" className="text-red-600" onClick={() => confirm(`Delete announcement: ${announcement.title}?`) && alert('Announcement deleted!')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Category: {announcement.category}</span>
                <span className={`font-medium ${getPriorityColor(announcement.priority)}`}>
                  {announcement.priority.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}
