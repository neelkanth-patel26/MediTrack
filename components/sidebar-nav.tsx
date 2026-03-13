'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  LogOut,
  Stethoscope,
  Heart,
  ClipboardList,
  BarChart3,
  ShieldAlert,
  Calendar,
  MoreHorizontal,
} from 'lucide-react'

export function SidebarNav() {
  const { user, logout } = useAuth()
  const { getColorClasses, getColorValues } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const colorClasses = getColorClasses()
  const colorValues = getColorValues()

  const handleLogout = () => {
    logout()
    router.push('/login')
    setShowLogoutDialog(false)
  }

  if (!user) return null

  const getNavItems = () => {
    const baseItems = {
      'patient': [
        { label: 'Dashboard', href: '/patient', icon: LayoutDashboard },
        { label: 'Find Doctors', href: '/patient/find-doctors', icon: Stethoscope },
        { label: 'Messages', href: '/patient/messages', icon: MessageSquare },
        { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
        { label: 'Health', href: '/patient/health', icon: Heart },
        { label: 'Prescriptions', href: '/patient/prescriptions', icon: FileText },
        { label: 'Reports', href: '/patient/reports', icon: ClipboardList },
        { label: 'Vitals', href: '/patient/vitals', icon: BarChart3 },
      ],
      'doctor': [
        { label: 'Dashboard', href: '/doctor', icon: LayoutDashboard },
        { label: 'Appointments', href: '/doctor/appointments', icon: Calendar },
        { label: 'Patients', href: '/doctor/patients', icon: Users },
        { label: 'AI Diagnosis', href: '/doctor/diagnosis', icon: Stethoscope },
        { label: 'Prescriptions', href: '/doctor/prescriptions', icon: FileText },
        { label: 'Reports', href: '/doctor/reports', icon: ClipboardList },
        { label: 'Messages', href: '/doctor/messages', icon: MessageSquare },
      ],
      'admin': [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
        { label: 'Contact', href: '/admin/contact', icon: MessageSquare },
        { label: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
        { label: 'Patients', href: '/admin/patients', icon: Users },
        { label: 'Activity', href: '/admin/activity', icon: ShieldAlert },
        { label: 'Announcements', href: '/admin/announcements', icon: Bell },
        { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
      ]
    }

    const items = baseItems[user.role as keyof typeof baseItems] || []
    return [...items, { label: 'Settings', href: '/settings', icon: Settings }]
  }

  const navItems = getNavItems()
  const mainNavItems = navItems.slice(0, 3) // First 3 items for mobile bottom nav
  const moreNavItems = navItems.slice(3) // Remaining items for "More" menu

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 p-4 pointer-events-none">
        <div className="flex-1 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl dark:shadow-2xl flex flex-col pointer-events-auto overflow-hidden h-full">
          
          {/* Logo */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 text-white"
                style={{
                  background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.dark})`,
                  boxShadow: `0 10px 15px -3px ${colorValues.primary}30`
                }}
              >
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">MediTrack+</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Healthcare</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Logged in as</p>
              <p className="font-semibold text-slate-900 dark:text-white capitalize text-sm">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">{user.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
                    isActive
                      ? `bg-gradient-to-r ${colorClasses.primary} text-white shadow-lg`
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  )}
                  style={
                    isActive
                      ? { boxShadow: `0 10px 15px -3px ${colorValues.primary}30` }
                      : {}
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 space-y-2">
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 h-auto"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 z-50 shadow-2xl">
        <div className="flex items-center justify-around px-4 py-3">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 flex-1',
                  isActive
                    ? 'text-white transform scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                )}
                style={isActive ? { 
                  backgroundColor: colorValues.primary,
                  boxShadow: `0 4px 12px ${colorValues.primary}40`
                } : {}}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-semibold truncate text-center leading-tight">
                  {item.label}
                </span>
                {isActive && (
                  <div 
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: 'white' }}
                  />
                )}
              </Link>
            )
          })}
          
          {/* More Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={cn(
              'flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 flex-1 relative',
              showMoreMenu
                ? 'text-white transform scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            )}
            style={showMoreMenu ? { 
              backgroundColor: colorValues.primary,
              boxShadow: `0 4px 12px ${colorValues.primary}40`
            } : {}}
          >
            <MoreHorizontal className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-semibold truncate text-center leading-tight">
              More
            </span>
            {showMoreMenu && (
              <div 
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'white' }}
              />
            )}
          </button>
        </div>
        
        {/* More Menu Popup */}
        {showMoreMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowMoreMenu(false)}
            />
            
            {/* Popup Menu */}
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 z-50">
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {moreNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMoreMenu(false)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200',
                          isActive
                            ? 'text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        )}
                        style={isActive ? { backgroundColor: colorValues.primary } : {}}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-medium text-center leading-tight">
                          {item.label}
                        </span>
                      </Link>
                    )
                  })}
                </div>
                
                {/* Logout Button */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <button
                    onClick={() => {
                      setShowLogoutDialog(true)
                      setShowMoreMenu(false)
                    }}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">Sign Out</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-muted-foreground">Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowLogoutDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1" 
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
