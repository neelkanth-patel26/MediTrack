'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Send, Stethoscope, Plus, Filter, Menu, X, Pin, Reply, Trash2, MoreVertical, FileText, Calendar, Clock } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  sender: { id: string; name: string; role: string }
  recipient: { id: string; name: string; role: string }
  is_pinned?: boolean
  parent_message_id?: string
  parent_message?: Message
  message_type?: string
}

interface Doctor {
  id: string
  name: string
  specialization: string
}

function MessagesContent() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filterSpecialization, setFilterSpecialization] = useState('')
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [showPinnedMessages, setShowPinnedMessages] = useState(false)
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; messageId: string | null; messageContent: string }>({ open: false, messageId: null, messageContent: '' })
  const [deletedMessage, setDeletedMessage] = useState<{ id: string; content: string } | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchMessages()
      fetchDoctors()
    }
  }, [user?.id])

  // Handle URL parameters for pre-filled messages
  useEffect(() => {
    const doctorId = searchParams.get('doctorId')
    const message = searchParams.get('message')
    
    if (doctorId) {
      setSelectedDoctor(doctorId)
    }
    if (message) {
      setNewMessage(message)
    }
  }, [searchParams])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, selectedDoctor])

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlightedMessageId(messageId)
      setTimeout(() => setHighlightedMessageId(null), 2000)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?userId=${user?.id}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors')
      const data = await response.json()
      setDoctors(data.doctors || [])
    } catch (error) {
      console.error('Failed to fetch doctors:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedDoctor || !user) return

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          recipientId: selectedDoctor,
          content: newMessage,
          parentMessageId: replyingTo?.id,
          messageType: 'general'
        })
      })

      if (response.ok) {
        setNewMessage('')
        setReplyingTo(null)
        await fetchMessages()
        scrollToBottom()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const pinMessage = async (messageId: string) => {
    try {
      const response = await fetch('/api/messages/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      })
      
      if (response.ok) {
        fetchMessages()
        toast.success('Message pinned')
      }
    } catch (error) {
      console.error('Failed to pin message:', error)
      toast.error('Failed to pin message')
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch('/api/messages/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      })
      
      if (response.ok) {
        const deletedMsg = messages.find(m => m.id === messageId)
        if (deletedMsg) {
          setDeletedMessage({ id: messageId, content: deletedMsg.content })
          toast.success('Message deleted', {
            action: {
              label: 'Undo',
              onClick: () => undoDelete(messageId, deletedMsg.content)
            },
            duration: 5000
          })
        }
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
      toast.error('Failed to delete message')
    }
  }

  const undoDelete = async (messageId: string, content: string) => {
    toast.success('Delete action undone')
    setDeletedMessage(null)
  }

  const confirmDelete = (messageId: string, content: string) => {
    setDeleteDialog({ open: true, messageId, messageContent: content })
  }

  const replyToMessage = (message: Message) => {
    setReplyingTo(message)
  }

  const getConversations = () => {
    const conversations: { [key: string]: { doctor: Doctor; messages: Message[]; lastMessage: Message } } = {}
    
    messages.forEach(msg => {
      const isFromUser = msg.sender_id === user?.id
      const doctorId = isFromUser ? msg.recipient_id : msg.sender_id
      const doctorName = isFromUser ? msg.recipient.name : msg.sender.name
      
      if (!conversations[doctorId]) {
        const doctor = doctors.find(d => d.id === doctorId) || { id: doctorId, name: doctorName, specialization: '' }
        conversations[doctorId] = { doctor, messages: [], lastMessage: msg }
      }
      
      conversations[doctorId].messages.push(msg)
      if (new Date(msg.created_at) > new Date(conversations[doctorId].lastMessage.created_at)) {
        conversations[doctorId].lastMessage = msg
      }
    })
    
    return Object.values(conversations).sort((a, b) => 
      new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    )
  }

  const conversations = getConversations()
  const filteredConversations = conversations.filter(conv => 
    !filterSpecialization || conv.doctor.specialization?.toLowerCase().includes(filterSpecialization.toLowerCase())
  )
  const selectedConversation = filteredConversations.find(c => c.doctor.id === selectedDoctor)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-3rem)] flex" style={{ background: `linear-gradient(135deg, ${colorValues.primary}08, ${colorValues.primary}03)` }}>
        <div className="w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60">
          <div className="p-4 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-3"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3rem)] flex bg-background rounded-2xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 lg:flex flex-col hidden border-r bg-card rounded-l-2xl">
        {/* Header */}
        <div className="p-6 border-b rounded-tl-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colorValues.primary }}>
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Messages</h1>
                <p className="text-sm text-muted-foreground">{filteredConversations.length} conversations</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 w-8 p-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-full mb-3">
              <SelectValue placeholder="Select a doctor to message" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" style={{ color: colorValues.primary }} />
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      {doctor.specialization && (
                        <div className="text-xs text-muted-foreground">{doctor.specialization}</div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showFilters && (
            <Input
              placeholder="Filter by specialization..."
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="text-sm"
            />
          )}
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-3">
          {filteredConversations.length > 0 ? filteredConversations.map((conversation) => (
            <div
              key={conversation.doctor.id}
              className={`mb-2 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedDoctor === conversation.doctor.id 
                  ? 'bg-primary/10 border-2 border-primary/20' 
                  : 'hover:bg-muted/50 border-2 border-transparent'
              }`}
              onClick={() => setSelectedDoctor(conversation.doctor.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: colorValues.primary }}>
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground truncate">{conversation.doctor.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.lastMessage.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.content}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Stethoscope className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground font-medium mb-2">No conversations yet</p>
              <p className="text-sm text-muted-foreground">Select a doctor above to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 p-0 rounded-full shadow-lg"
            style={{ backgroundColor: colorValues.primary }}
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Messages Navigation</SheetTitle>
          </SheetHeader>
          <div className="h-full bg-card flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colorValues.primary }}>
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">Messages</h1>
                    <p className="text-xs text-muted-foreground">{filteredConversations.length} conversations</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-8 w-8 p-0"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full mb-3">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" style={{ color: colorValues.primary }} />
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          {doctor.specialization && (
                            <div className="text-xs text-muted-foreground">{doctor.specialization}</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {showFilters && (
                <Input
                  placeholder="Filter by specialization..."
                  value={filterSpecialization}
                  onChange={(e) => setFilterSpecialization(e.target.value)}
                  className="text-sm"
                />
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.doctor.id}
                  className={`mb-2 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedDoctor === conversation.doctor.id 
                      ? 'bg-primary/10 border-2 border-primary/20' 
                      : 'hover:bg-muted/50 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedDoctor(conversation.doctor.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: colorValues.primary }}>
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground truncate">{conversation.doctor.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background rounded-r-2xl">
        {selectedDoctor ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card rounded-tr-2xl">
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="lg:hidden h-9 w-9 p-0"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Messages Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="h-full bg-card flex flex-col p-4">
                      <p className="text-muted-foreground">Mobile navigation content</p>
                    </div>
                  </SheetContent>
                </Sheet>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: colorValues.primary }}>
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedConversation?.doctor.name || doctors.find(d => d.id === selectedDoctor)?.name}</h3>
                  {(selectedConversation?.doctor.specialization || doctors.find(d => d.id === selectedDoctor)?.specialization) && (
                    <p className="text-sm text-muted-foreground">{selectedConversation?.doctor.specialization || doctors.find(d => d.id === selectedDoctor)?.specialization}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPinnedMessages(!showPinnedMessages)}
                  className="gap-2 ml-auto"
                >
                  <Pin className="h-4 w-4" />
                  Pinned
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation ? selectedConversation.messages.map((msg) => {
                const isFromUser = msg.sender_id === user?.id
                return (
                  <div key={msg.id} id={`message-${msg.id}`} className={highlightedMessageId === msg.id ? 'animate-pulse bg-primary/10 rounded-lg p-2' : ''}>
                    {msg.parent_message && msg.parent_message.content && (
                      <div 
                        className="mb-2 ml-12 p-3 bg-muted/50 rounded-lg border-l-4 border-primary/30 cursor-pointer hover:bg-muted/70"
                        onClick={() => scrollToMessage(msg.parent_message_id!)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Reply className="h-3 w-3 text-primary" />
                          <span className="text-xs text-primary font-medium">Reply to</span>
                        </div>
                        <p className="text-sm text-muted-foreground italic">{msg.parent_message.content}</p>
                      </div>
                    )}
                    <div className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} group`}>
                      {msg.message_type === 'appointment' ? (
                        /* Appointment Message Card */
                        <div className="max-w-md p-4 rounded-2xl border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-semibold text-blue-900 dark:text-blue-100">Appointment Scheduled</span>
                          </div>
                          <div className="space-y-2">
                            {msg.content.split('\n').map((line, i) => {
                              if (line.startsWith('Date:')) {
                                return (
                                  <div key={i} className="flex items-center gap-2 p-2 bg-white/80 dark:bg-slate-800/50 rounded-lg">
                                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-foreground">{line}</span>
                                  </div>
                                )
                              }
                              if (line.startsWith('Time:')) {
                                return (
                                  <div key={i} className="flex items-center gap-2 p-2 bg-white/80 dark:bg-slate-800/50 rounded-lg">
                                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-foreground">{line}</span>
                                  </div>
                                )
                              }
                              if (line.startsWith('Reason:')) {
                                return (
                                  <div key={i} className="flex items-center gap-2 p-2 bg-white/80 dark:bg-slate-800/50 rounded-lg">
                                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-foreground">{line}</span>
                                  </div>
                                )
                              }
                              if (line.includes('Please confirm')) {
                                return (
                                  <div key={i} className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-950/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">{line}</p>
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">{formatTime(msg.created_at)}</p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => replyToMessage(msg)}>
                                  <Reply className="h-4 w-4 mr-2" />
                                  Reply
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => pinMessage(msg.id)}>
                                  <Pin className="h-4 w-4 mr-2" />
                                  {msg.is_pinned ? 'Unpin' : 'Pin'}
                                </DropdownMenuItem>
                                {isFromUser && (
                                  <DropdownMenuItem onClick={() => confirmDelete(msg.id, msg.content)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ) : (
                        /* Regular Message */
                        <div className={`max-w-md px-4 py-3 rounded-2xl relative ${
                          isFromUser
                            ? 'text-white rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        } ${msg.is_pinned ? 'ring-2 ring-yellow-400' : ''}`}
                        style={isFromUser ? { backgroundColor: colorValues.primary } : {}}>
                          {msg.is_pinned && (
                            <Pin className="absolute -top-2 -right-2 h-4 w-4 text-yellow-500 bg-background rounded-full p-1" />
                          )}
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-75">{formatTime(msg.created_at)}</p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => replyToMessage(msg)}>
                                  <Reply className="h-4 w-4 mr-2" />
                                  Reply
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => pinMessage(msg.id)}>
                                  <Pin className="h-4 w-4 mr-2" />
                                  {msg.is_pinned ? 'Unpin' : 'Pin'}
                                </DropdownMenuItem>
                                {isFromUser && (
                                  <DropdownMenuItem onClick={() => confirmDelete(msg.id, msg.content)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colorValues.primary}20` }}>
                      <MessageSquare className="h-8 w-8" style={{ color: colorValues.primary }} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Start a conversation</h3>
                    <p className="text-muted-foreground mb-4">Send your first message to {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              {replyingTo && (
                <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Reply className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Replying to</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded border-l-2 border-primary/30">
                    {replyingTo.content}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 border rounded-xl bg-background">
                <Input
                  placeholder={replyingTo ? "Reply to message..." : "Type a message..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="h-9 w-9 p-0 rounded-full text-white"
                  style={{ backgroundColor: colorValues.primary }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colorValues.primary}20` }}>
                <MessageSquare className="h-10 w-10" style={{ color: colorValues.primary }} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Select a doctor</h3>
              <p className="text-muted-foreground">Choose a doctor from the dropdown to start messaging</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Message
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-foreground">{deleteDialog.messageContent}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteDialog({ open: false, messageId: null, messageContent: '' })}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  if (deleteDialog.messageId) {
                    deleteMessage(deleteDialog.messageId)
                    setDeleteDialog({ open: false, messageId: null, messageContent: '' })
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function PatientMessages() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-3rem)] flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}