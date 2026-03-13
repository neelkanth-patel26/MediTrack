'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from './supabase-client'

export type UserRole = 'admin' | 'doctor' | 'patient'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  specialization?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  signup: (name: string, email: string, password: string, role: UserRole, specialization?: string) => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@meditrack.com': {
    password: 'admin123',
    user: { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Admin User', email: 'admin@meditrack.com', role: 'admin' },
  },
  'dr.urmi@meditrack.com': {
    password: 'doctor123',
    user: { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Dr. Urmi Thakkar', email: 'dr.urmi@meditrack.com', role: 'doctor', specialization: 'Cardiology' },
  },
  'nick@meditrack.com': {
    password: 'patient123',
    user: { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Nick Patel', email: 'nick@meditrack.com', role: 'patient' },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Check if this is a mock user (including those created during rate-limited signup)
      const mockUserRecord = MOCK_USERS[email]
      if (mockUserRecord && mockUserRecord.password === password) {
        console.log('[v0] Using mock auth for user:', email)
        setUser(mockUserRecord.user)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('meditrack_user', JSON.stringify(mockUserRecord.user))
          sessionStorage.setItem('isDemoUser', 'true')
        }
        return mockUserRecord.user
      }

      // Try Supabase auth for other emails
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (!error && data.user) {
          // Fetch user profile from the users table
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profileError) {
            console.error('[v0] Profile fetch error:', profileError.message)
            
            // Check if there's pending profile data from a failed signup
            if (typeof window !== 'undefined') {
              const pendingProfile = sessionStorage.getItem('pending_profile')
              if (pendingProfile) {
                try {
                  const profileData = JSON.parse(pendingProfile)
                  if (profileData.id === data.user.id) {
                    console.log('[v0] Found pending profile data, attempting to create profile')
                    const { error: insertError } = await supabase
                      .from('users')
                      .insert([profileData])

                    if (!insertError) {
                      console.log('[v0] Pending profile created successfully')
                      sessionStorage.removeItem('pending_profile')
                      
                      const userObj: User = {
                        id: profileData.id,
                        name: profileData.name,
                        email: profileData.email,
                        role: profileData.role,
                        specialization: profileData.specialization,
                      }

                      setUser(userObj)
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('meditrack_user', JSON.stringify(userObj))
                      }
                      return userObj
                    } else {
                      console.error('[v0] Failed to create pending profile:', insertError.message)
                    }
                  }
                } catch (e) {
                  console.error('[v0] Error parsing pending profile:', e)
                }
              }
            }
            
            // If profile doesn't exist, try to create it from auth metadata
            if (profileError.code === 'PGRST116' || profileError.message.includes('No rows found')) {
              console.log('[v0] Profile not found, attempting to create from auth metadata')
              
              const { data: authUser } = await supabase.auth.getUser()
              if (authUser.user?.email) {
                const { error: insertError } = await supabase
                  .from('users')
                  .insert([
                    {
                      id: data.user.id,
                      name: authUser.user.user_metadata?.name || 'User',
                      email: authUser.user.email,
                      role: authUser.user.user_metadata?.role || 'patient',
                      specialization: authUser.user.user_metadata?.specialization || null,
                    },
                  ])

                if (!insertError) {
                  console.log('[v0] Profile created successfully during login')
                  // Fetch the newly created profile
                  const { data: newProfile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single()

                  if (newProfile) {
                    const userObj: User = {
                      id: newProfile.id,
                      name: newProfile.name,
                      email: newProfile.email,
                      role: newProfile.role,
                      specialization: newProfile.specialization,
                    }

                    setUser(userObj)
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('meditrack_user', JSON.stringify(userObj))
                    }
                    return userObj
                  }
                } else {
                  console.error('[v0] Failed to create profile during login:', insertError.message)
                }
              }
            }
            
            // If we can't create profile, fall back to mock auth or throw error
            console.log('[v0] Falling back to mock auth due to profile issues')
            throw new Error('Profile setup incomplete. Please try signing up again or use demo accounts.')
          }

          if (!profileError && userProfile) {
            const userObj: User = {
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              role: userProfile.role,
              specialization: userProfile.specialization,
            }

            setUser(userObj)
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('meditrack_user', JSON.stringify(userObj))
              sessionStorage.setItem('isDemoUser', 'false')
            }
            return userObj
          } else {
            console.error('[v0] Profile not found for authenticated user')
            throw new Error('User profile not found. Please contact support.')
          }
        }
      }

      // If Supabase not configured or failed, check for any newly created users in session
      if (typeof window !== 'undefined') {
        const recentSignup = sessionStorage.getItem('recent_signup_' + email)
        if (recentSignup) {
          try {
            const userData = JSON.parse(recentSignup)
            if (userData.password === password) {
              console.log('[v0] Using recent signup data for:', email)
              setUser(userData.user)
              sessionStorage.setItem('meditrack_user', JSON.stringify(userData.user))
              sessionStorage.setItem('isDemoUser', 'false')
              return userData.user
            }
          } catch (e) {
            console.error('Failed to parse recent signup data', e)
          }
        }
      }
      
      throw new Error('Invalid login credentials')
    } catch (error) {
      console.error('[v0] Login error:', error instanceof Error ? error.message : error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
    setUser(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('meditrack_user')
    }
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string, role: UserRole, specialization?: string) => {
      setIsLoading(true)
      try {
        // Check if email already exists in mock users (for demo accounts)
        if (MOCK_USERS[email] && !email.includes('@meditrack.com')) {
          throw new Error('Email already registered')
        }

        // Try API route first for database signup
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, specialization })
          })
          
          const result = await response.json()
          if (result.success) {
            console.log('[v0] Database signup successful')
            setUser(result.user)
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('meditrack_user', JSON.stringify(result.user))
              sessionStorage.setItem('isDemoUser', 'false')
            }
            return
          } else {
            console.log('[v0] Database signup failed, falling back to mock auth:', result.message)
          }
        } catch (apiError) {
          console.log('[v0] API signup failed, falling back to mock auth:', apiError)
        }

        // Fallback to mock signup for demo purposes (if Supabase not configured or rate limited)
        console.log('[v0] Using mock signup (Supabase not configured or rate limited)')
        
        // Generate a proper UUID for the new user
        const generateUUID = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0
            const v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
          })
        }
        
        const newUser: User = {
          id: generateUUID(),
          name,
          email,
          role,
          specialization,
        }

        MOCK_USERS[email] = { password, user: newUser }
        setUser(newUser)

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('meditrack_user', JSON.stringify(newUser))
          // Store recent signup for login fallback
          sessionStorage.setItem('recent_signup_' + email, JSON.stringify({ user: newUser, password }))
          // Only demo accounts get demo data
          sessionStorage.setItem('isDemoUser', email.includes('@meditrack.com') ? 'true' : 'false')
        }
      } catch (error) {
        console.error('[v0] Signup error:', error instanceof Error ? error.message : error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('meditrack_user', JSON.stringify(updatedUser))
      }
    }
  }, [user])

  // Restore user and dark mode from session storage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('meditrack_user')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to restore user session', e)
        }
      }
      
      const darkMode = sessionStorage.getItem('meditrack_dark_mode') === 'true'
      setIsDarkMode(darkMode)
      if (darkMode) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  // Update dark mode
  const setDarkModeState = React.useCallback((isDark: boolean) => {
    setIsDarkMode(isDark)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('meditrack_dark_mode', isDark.toString())
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isDarkMode, setIsDarkMode: setDarkModeState, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
