'use client'

import { Bell, Search, Moon, Sun, Stethoscope, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { cn } from '@/lib/utils'

export function Header() {
  const { user, isDarkMode, setIsDarkMode } = useAuth()
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300">
      <div className="px-4 sm:px-6 h-16 flex items-center relative">
        {/* Mobile Branding - Centered on mobile */}
        <div className="flex md:hidden items-center justify-center flex-1 gap-2">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg text-white"
            style={{
              background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.dark})`,
              boxShadow: `0 8px 16px -4px ${colorValues.primary}40`
            }}
          >
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">MediTrack+</span>
        </div>

        {/* Buttons on mobile - Right aligned */}
        <div className="md:hidden absolute right-4 flex items-center gap-1">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 h-9 w-9"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </Button>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-1.5 flex-1 max-w-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search anything..."
            className="border-0 bg-transparent focus-visible:ring-0 text-sm h-8"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 h-9 w-9 sm:h-10 sm:w-10"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
            )}
          </Button>

          {/* Notifications */}
          <NotificationBell />

          {/* Date & User Profile (Mobile/Desktop) */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-slate-900 dark:text-white">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Today</p>
            </div>
            
            {/* User Profile Hookup */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
               {user?.avatar ? (
                 <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
               ) : (
                 <User className="h-5 w-5 text-slate-400" />
               )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
