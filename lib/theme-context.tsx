'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export type ThemeColor = 'orange' | 'blue' | 'pink' | 'purple' | 'green' | 'red' | 'teal'

export interface ThemeConfig {
  color: ThemeColor
  isDarkMode: boolean
}

const COLOR_VALUES: Record<ThemeColor, { primary: string; light: string; dark: string }> = {
  orange: {
    primary: '#ea580c',
    light: '#fed7aa',
    dark: '#9a3412',
  },
  blue: {
    primary: '#2563eb',
    light: '#dbeafe',
    dark: '#1e40af',
  },
  pink: {
    primary: '#ec4899',
    light: '#fce7f3',
    dark: '#be185d',
  },
  purple: {
    primary: '#a855f7',
    light: '#ede9fe',
    dark: '#7c3aed',
  },
  green: {
    primary: '#16a34a',
    light: '#dcfce7',
    dark: '#15803d',
  },
  red: {
    primary: '#dc2626',
    light: '#fee2e2',
    dark: '#b91c1c',
  },
  teal: {
    primary: '#14b8a6',
    light: '#ccfbf1',
    dark: '#0f766e',
  },
}

const COLOR_CLASSES: Record<ThemeColor, { primary: string }> = {
  orange: {
    primary: 'from-orange-500 to-orange-600',
  },
  blue: {
    primary: 'from-blue-500 to-blue-600',
  },
  pink: {
    primary: 'from-pink-500 to-pink-600',
  },
  purple: {
    primary: 'from-purple-500 to-purple-600',
  },
  green: {
    primary: 'from-green-500 to-green-600',
  },
  red: {
    primary: 'from-red-500 to-red-600',
  },
  teal: {
    primary: 'from-teal-500 to-teal-600',
  },
}

interface ThemeContextType extends ThemeConfig {
  setThemeColor: (color: ThemeColor) => void
  setIsDarkMode: (isDark: boolean) => void
  getColorClasses: () => typeof COLOR_CLASSES[ThemeColor]
  getColorValues: () => typeof COLOR_VALUES[ThemeColor]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState<ThemeColor>('orange')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load theme from localStorage on mount and listen for system preference changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('meditrack_theme')
      const savedDarkMode = localStorage.getItem('meditrack_dark_mode')

      if (savedTheme && (savedTheme as ThemeColor) in COLOR_CLASSES) {
        setColor(savedTheme as ThemeColor)
      }

      // Function to update dark mode based on system preference or saved preference
      const updateDarkMode = () => {
        const savedDarkMode = localStorage.getItem('meditrack_dark_mode')
        if (savedDarkMode !== null) {
          const isDark = savedDarkMode === 'true'
          setIsDarkMode(isDark)
        } else {
          // No saved preference, use system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setIsDarkMode(systemPrefersDark)
          localStorage.setItem('meditrack_dark_mode', systemPrefersDark.toString())
        }
      }

      // Initial check
      updateDarkMode()

      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const savedDarkMode = localStorage.getItem('meditrack_dark_mode')
        if (savedDarkMode === null) {
          updateDarkMode()
        }
      }

      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }, [])

  const setThemeColor = useCallback((newColor: ThemeColor) => {
    setColor(newColor)
    if (typeof window !== 'undefined') {
      localStorage.setItem('meditrack_theme', newColor)
    }
  }, [])

  const setDarkModeState = useCallback((isDark: boolean) => {
    setIsDarkMode(isDark)
    if (typeof window !== 'undefined') {
      localStorage.setItem('meditrack_dark_mode', isDark.toString())
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  const getColorClasses = useCallback(() => COLOR_CLASSES[color], [color])

  const getColorValues = useCallback(() => COLOR_VALUES[color], [color])

  return (
    <ThemeContext.Provider
      value={{
        color,
        isDarkMode,
        setThemeColor,
        setIsDarkMode: setDarkModeState,
        getColorClasses,
        getColorValues,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
