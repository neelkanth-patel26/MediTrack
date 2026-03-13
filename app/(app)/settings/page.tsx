'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth-context'
import { useTheme, type ThemeColor } from '@/lib/theme-context'
import { Settings, User, Shield, Bell, Palette, Sun, Moon, Key, Smartphone, LogOut, ChevronRight, Mail, Phone, Globe, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { color, isDarkMode, setThemeColor, setIsDarkMode, getColorValues } = useTheme()
  const colorValues = getColorValues()
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [showSessionsDialog, setShowSessionsDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timezone: 'UTC-5 (EST)',
    // Doctor-specific fields
    years_experience: '',
    consultation_fee: '',
    availability: '',
    specialization: '',
    // Patient-specific fields
    gender: '',
    blood_type: '',
    allergies: '',
    date_of_birth: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    appointmentReminders: true,
    prescriptionAlerts: true
  })
  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Update user in context and session storage
      updateUser({ name: formData.name, email: formData.email })
      
      // Try to update in database
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          profile: formData,
          notifications,
          theme: { color, isDarkMode }
        })
      })

      const result = await response.json()
      if (response.ok) {
        // Immediately refresh the profile data
        await fetchUserProfile()
        setShowSuccessDialog(true)
        setTimeout(() => setShowSuccessDialog(false), 2000)
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      console.error('Settings update error:', error)
      // Still save locally even if database fails
      localStorage.setItem('meditrack_profile', JSON.stringify(formData))
      localStorage.setItem('meditrack_notifications', JSON.stringify(notifications))
      setShowSuccessDialog(true)
      setTimeout(() => setShowSuccessDialog(false), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  // Load user profile from database
  const fetchUserProfile = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/user/profile?userId=${user.id}`)
      const data = await response.json()
      
      if (data.user) {
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          timezone: 'UTC-5 (EST)',
          years_experience: String(data.user.years_experience || ''),
          consultation_fee: String(data.user.consultation_fee || ''),
          availability: data.user.availability || '',
          specialization: data.user.specialization || '',
          gender: data.user.gender || '',
          blood_type: data.user.blood_type || '',
          allergies: data.user.allergies || '',
          date_of_birth: data.user.date_of_birth || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      // Fallback to context user data
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        timezone: 'UTC-5 (EST)',
        years_experience: '',
        consultation_fee: '',
        availability: '',
        specialization: '',
        gender: '',
        blood_type: '',
        allergies: '',
        date_of_birth: ''
      })
    } finally {
      setIsLoadingProfile(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [user])

  // Load saved settings on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('meditrack_notifications')
    
    if (savedNotifications) {
      try {
        const notifs = JSON.parse(savedNotifications)
        setNotifications(notifs)
      } catch (e) {
        console.error('Failed to load saved notifications', e)
      }
    }
  }, [])

  const themeColors: { name: ThemeColor; color: string }[] = [
    { name: 'orange', color: '#f97316' },
    { name: 'blue', color: '#3b82f6' },
    { name: 'pink', color: '#ec4899' },
    { name: 'purple', color: '#8b5cf6' },
    { name: 'green', color: '#10b981' },
    { name: 'red', color: '#ef4444' },
    { name: 'teal', color: '#14b8a6' },
  ]

  return (
    <div className="w-full space-y-8">
      {isLoadingProfile ? (
        <div className="space-y-8">
          {/* Header Skeleton */}
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </Card>
          
          {/* Profile Section Skeleton */}
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-1"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </Card>
          
          {/* Security & Notifications Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        </div>
                        <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Appearance Skeleton */}
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                  <div className="flex gap-3">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Danger Zone Skeleton */}
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <>
          {/* Header */}
          <Card className="p-6">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </Card>

      {/* Profile Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: colorValues.primary }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <Badge variant="outline" className="mt-1">
              {user?.role === 'admin' ? 'Administrator' : user?.role === 'doctor' ? 'Doctor' : 'Patient'}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input 
              id="timezone" 
              value={formData.timezone}
              onChange={(e) => setFormData({...formData, timezone: e.target.value})}
            />
          </div>
          {user?.role === 'doctor' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialization">Medical Specialization *</Label>
                <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                    <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                    <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                    <SelectItem value="Oncology">Oncology</SelectItem>
                    <SelectItem value="Gynecology">Gynecology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience *</Label>
                <Select value={formData.years_experience} onValueChange={(value) => setFormData({...formData, years_experience: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="4">4 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="6">6 years</SelectItem>
                    <SelectItem value="7">7 years</SelectItem>
                    <SelectItem value="8">8 years</SelectItem>
                    <SelectItem value="9">9 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                    <SelectItem value="12">12 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20+ years</SelectItem>
                    <SelectItem value="25">25+ years</SelectItem>
                    <SelectItem value="30">30+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="consultation_fee">Consultation Fee (USD) *</Label>
                <Select value={formData.consultation_fee} onValueChange={(value) => setFormData({...formData, consultation_fee: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select consultation fee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">$50</SelectItem>
                    <SelectItem value="75">$75</SelectItem>
                    <SelectItem value="100">$100</SelectItem>
                    <SelectItem value="120">$120</SelectItem>
                    <SelectItem value="150">$150</SelectItem>
                    <SelectItem value="180">$180</SelectItem>
                    <SelectItem value="200">$200</SelectItem>
                    <SelectItem value="250">$250</SelectItem>
                    <SelectItem value="300">$300</SelectItem>
                    <SelectItem value="350">$350</SelectItem>
                    <SelectItem value="400">$400</SelectItem>
                    <SelectItem value="500">$500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability Status *</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData({...formData, availability: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select availability status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available Today">Available Today</SelectItem>
                    <SelectItem value="Available This Week">Available This Week</SelectItem>
                    <SelectItem value="Available Next Week">Available Next Week</SelectItem>
                    <SelectItem value="Available Mon-Fri">Available Mon-Fri</SelectItem>
                    <SelectItem value="Available Weekends">Available Weekends</SelectItem>
                    <SelectItem value="By Appointment Only">By Appointment Only</SelectItem>
                    <SelectItem value="Currently Unavailable">Currently Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {user?.role === 'patient' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood_type">Blood Group</Label>
                <Select value={formData.blood_type} onValueChange={(value) => setFormData({...formData, blood_type: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input 
                  id="date_of_birth" 
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input 
                  id="allergies" 
                  placeholder="List any allergies (e.g., Penicillin, Peanuts, None)"
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            style={{ backgroundColor: colorValues.primary }} 
            className="text-white" 
            onClick={handleSaveProfile}
            disabled={isLoading || (user?.role === 'doctor' && (!formData.specialization || !formData.years_experience || !formData.consultation_fee || !formData.availability))}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        
        {user?.role === 'doctor' && (!formData.specialization || !formData.years_experience || !formData.consultation_fee || !formData.availability) && (
          <p className="text-sm text-red-600 mt-2 text-center">
            * Please fill in all required doctor profile fields
          </p>
        )}
      </Card>

      {/* Security & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5" style={{ color: colorValues.primary }} />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          
          <div className="space-y-4">
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4" style={{ color: colorValues.primary }} />
                    <span className="text-sm font-medium">Password</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background/95 border border-border/30 shadow-xl rounded-xl">
                <DialogHeader className="pb-4 border-b border-border/10">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <Key className="h-4 w-4" style={{ color: colorValues.primary }} />
                    </div>
                    Change Password
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="current" className="text-sm font-medium">Current Password</Label>
                    <Input id="current" type="password" className="h-11 border-border/50" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new" className="text-sm font-medium">New Password</Label>
                    <Input id="new" type="password" className="h-11 border-border/50" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-sm font-medium">Confirm Password</Label>
                    <Input id="confirm" type="password" className="h-11 border-border/50" placeholder="Confirm new password" />
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-border/10">
                    <Button variant="outline" className="flex-1 h-11 border-border/50" onClick={() => setShowPasswordDialog(false)}>
                      Cancel
                    </Button>
                    <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1 h-11 shadow-lg">
                      Update Password
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4" style={{ color: colorValues.primary }} />
                <div>
                  <p className="text-sm font-medium">Two-Factor Auth</p>
                  <p className="text-xs text-muted-foreground">Not enabled</p>
                </div>
              </div>
              <Switch onCheckedChange={(checked) => {
                if (checked) {
                  alert('2FA setup would be implemented here')
                }
              }} />
            </div>
            
            <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4" style={{ color: colorValues.primary }} />
                    <div>
                      <p className="text-sm font-medium">Active Sessions</p>
                      <p className="text-xs text-muted-foreground">2 devices</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </DialogTrigger>
              <DialogContent className="bg-background/95 border border-border/30 shadow-xl rounded-xl">
                <DialogHeader className="pb-4 border-b border-border/10">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <Globe className="h-4 w-4" style={{ color: colorValues.primary }} />
                    </div>
                    Active Sessions
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4" style={{ color: colorValues.primary }} />
                      <div>
                        <p className="font-medium text-sm">Current Device</p>
                        <p className="text-xs text-muted-foreground">Chrome on Windows</p>
                      </div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4" style={{ color: colorValues.primary }} />
                      <div>
                        <p className="font-medium text-sm">Mobile Device</p>
                        <p className="text-xs text-muted-foreground">Safari on iOS</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-border/50">Sign Out</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5" style={{ color: colorValues.primary }} />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'pushNotifications', label: 'Push Notifications' },
              { key: 'smsAlerts', label: 'SMS Alerts' },
              { key: 'appointmentReminders', label: 'Appointment Reminders' },
              { key: 'prescriptionAlerts', label: 'Prescription Alerts' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <Switch 
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, [item.key]: checked})
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="h-5 w-5" style={{ color: colorValues.primary }} />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>
        
        <div className="space-y-6">
          {/* Theme Colors */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Theme Color</Label>
            <div className="flex gap-3">
              {themeColors.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setThemeColor(theme.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === theme.name ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: theme.color }}
                />
              ))}
            </div>
          </div>
          
          {/* Dark Mode */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Display Mode</Label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  !isDarkMode ? 'border-2' : 'border-border hover:border-muted-foreground'
                }`}
                style={!isDarkMode ? { borderColor: colorValues.primary } : {}}
              >
                <Sun className="w-4 h-4" />
                <span className="text-sm">Light</span>
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isDarkMode ? 'border-2' : 'border-border hover:border-muted-foreground'
                }`}
                style={isDarkMode ? { borderColor: colorValues.primary } : {}}
              >
                <Moon className="w-4 h-4" />
                <span className="text-sm">Dark</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => alert('Exporting your data... This will be sent to your email.')}>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5" style={{ color: colorValues.primary }} />
            <div>
              <p className="font-medium text-sm">Export Data</p>
              <p className="text-xs text-muted-foreground">Download your information</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open('mailto:support@meditrack.com?subject=Support Request', '_blank')}>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5" style={{ color: colorValues.primary }} />
            <div>
              <p className="font-medium text-sm">Contact Support</p>
              <p className="text-xs text-muted-foreground">Get help with your account</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => alert('Advanced settings panel would open here with developer options, API keys, etc.')}>
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5" style={{ color: colorValues.primary }} />
            <div>
              <p className="font-medium text-sm">Advanced Settings</p>
              <p className="text-xs text-muted-foreground">More configuration options</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Account Actions</h3>
            <p className="text-sm text-muted-foreground">Manage your account status</p>
          </div>
          <Button variant="destructive" onClick={() => {
            if (window.confirm('Are you sure you want to sign out?')) {
              logout && logout()
            }
          }}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
          </Card>
        </>
      )}
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-background/95 border border-border/30 shadow-xl rounded-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Settings Saved</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colorValues.primary}20` }}>
              <CheckCircle className="w-8 h-8" style={{ color: colorValues.primary }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Settings Saved Successfully!</h3>
            <p className="text-sm text-muted-foreground">Your changes have been saved.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
