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
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl transition-all duration-300">
      <div className="px-4 sm:px-8 h-20 flex items-center justify-between gap-4 max-w-screen-2xl mx-auto">
        {/* Mobile Branding - Centered on mobile */}
        <div className="flex md:hidden items-center justify-center flex-1 gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white"
            style={{
              background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.dark})`,
              boxShadow: `0 8px 16px -4px ${colorValues.primary}40`
            }}
          >
            <Stethoscope className="w-6 h-6" />
          </div>
          <span className="font-black text-slate-900 dark:text-white tracking-tighter text-lg">MediTrack+</span>
        </div>

        {/* Buttons on mobile - Right aligned */}
        <div className="md:hidden absolute right-6 flex items-center gap-2">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 h-10 w-10 bg-slate-50 dark:bg-slate-800/50"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </Button>
        </div>

        {/* Search Bar & Stats - Desktop Only */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2 flex-1 max-w-md transition-all focus-within:ring-2 focus-within:ring-primary/20 group">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary" />
            <Input
              placeholder="Search patients, records, or analytics..."
              className="border-0 bg-transparent focus-visible:ring-0 text-sm h-8"
            />
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-500">
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-slate-200 leading-none">Status</span>
              <span className="text-green-500 text-[10px] uppercase tracking-wider mt-1 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                System Active
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div className="hidden md:flex items-center gap-4">
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
          
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 h-11 w-11 transition-transform active:scale-95"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </Button>
          </div>

          <button className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-black text-slate-900 dark:text-white leading-none">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest leading-none">
                Administrator
              </span>
            </div>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform`}>
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-xl" /> : (user?.name?.[0] || <User className="w-4 h-4" />)}
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
