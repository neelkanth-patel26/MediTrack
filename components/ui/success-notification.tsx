'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X, User } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

interface SuccessNotificationProps {
  message: string
  patientName?: string
  isVisible: boolean
  onClose: () => void
}

export function SuccessNotification({ message, patientName, isVisible, onClose }: SuccessNotificationProps) {
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto close after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-xl shadow-2xl p-6 max-w-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              Appointment Confirmed!
            </h3>
            <div className="space-y-2">
              {patientName && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {patientName} has been added to your patients list
                  </span>
                </div>
              )}
              <p className="text-sm text-green-700 dark:text-green-300">
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-600 dark:text-green-500 dark:hover:text-green-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}