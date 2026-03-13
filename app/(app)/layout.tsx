'use client'

import React from "react"

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SidebarNav } from '@/components/sidebar-nav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex-row">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-6 md:ml-[250px] pb-20 md:pb-6">
        <div className="space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}
