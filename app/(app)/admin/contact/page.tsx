'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Mail, Phone, User, Search, Reply, Archive, Trash2, Clock, CheckCircle } from 'lucide-react'
import { ReplyMessageDialog } from '@/components/admin/dialogs'
import { useTheme } from '@/lib/theme-context'

export default function AdminContact() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/contact-messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/admin/contact-messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: id, status: newStatus })
      })
      fetchMessages()
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  const deleteMessage = async (id: string) => {
    // In a real implementation, you might want to soft delete or archive
    // For now, we'll just refresh the list
    fetchMessages()
  }

  const archiveResolved = async () => {
    // Archive all resolved messages
    try {
      const resolvedMessages = messages.filter(msg => msg.status === 'resolved')
      for (const msg of resolvedMessages) {
        await fetch('/api/admin/contact-messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId: msg.id, status: 'archived' })
        })
      }
      fetchMessages()
    } catch (error) {
      console.error('Error archiving messages:', error)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'destructive'
      case 'in-progress': return 'secondary'
      case 'replied': return 'default'
      case 'resolved': return 'outline'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <MessageSquare className="h-4 w-4 text-red-600" />
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'replied': return <Reply className="h-4 w-4 text-blue-600" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const todayStats = [
    { label: 'Total Messages', value: messages.length.toString(), icon: MessageSquare, color: 'text-blue-600' },
    { label: 'New Messages', value: messages.filter(m => m.status === 'new').length.toString(), icon: Mail, color: 'text-red-600' },
    { label: 'In Progress', value: messages.filter(m => m.status === 'in-progress').length.toString(), icon: Clock, color: 'text-yellow-600' },
    { label: 'Resolved', value: messages.filter(m => m.status === 'resolved').length.toString(), icon: CheckCircle, color: 'text-green-600' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
            <p className="text-muted-foreground">Manage messages from the landing page contact form</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={archiveResolved}>
              <Archive className="h-4 w-4 mr-2" />
              Archive All Resolved
            </Button>
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white" onClick={() => alert('Bulk reply feature coming soon!')}>
              <Reply className="h-4 w-4 mr-2" />
              Bulk Reply
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {todayStats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon className={`h-6 w-6 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search messages..."
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Messages List */}
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
        ) : filteredMessages.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'No messages found matching your criteria.' 
                : 'No contact messages yet.'}
            </p>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <User className="h-6 w-6" style={{ color: colorValues.primary }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{message.name}</h3>
                      <Badge variant={getStatusColor(message.status)}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1).replace('-', ' ')}
                      </Badge>
                      {getStatusIcon(message.status)}
                      <span className={`text-xs font-semibold ${getPriorityColor(message.priority)}`}>
                        {message.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{message.email} • {message.phone || 'No phone'}</p>
                    <p className="text-sm font-semibold text-foreground">{message.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{message.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">Message:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{message.message}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Contact Form Submission</span>
                </div>
                <div className="flex gap-2">
                  <ReplyMessageDialog message={message}>
                    <Button size="sm" variant="outline">
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </ReplyMessageDialog>
                  {message.status === 'new' && (
                    <Button size="sm" style={{ backgroundColor: colorValues.primary }} className="text-white" onClick={() => updateMessageStatus(message.id, 'in-progress')}>
                      Start Processing
                    </Button>
                  )}
                  {message.status === 'in-progress' && (
                    <Button size="sm" style={{ backgroundColor: colorValues.primary }} className="text-white" onClick={() => updateMessageStatus(message.id, 'resolved')}>
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}