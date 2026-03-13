'use client'

import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, AlertCircle, Eye, EyeOff, Shield, Users, Activity } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const { color, getColorClasses } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const colorClasses = getColorClasses()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const loggedInUser = await login(email, password)
      if (loggedInUser.role === 'admin') {
        router.push('/admin')
      } else if (loggedInUser.role === 'doctor') {
        router.push('/doctor')
      } else {
        router.push('/patient')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed'
      
      if (errorMsg.includes('Invalid login credentials')) {
        setError('Invalid email or password. If you just signed up, try using demo accounts or wait a few minutes if you encountered rate limiting.')
      } else if (errorMsg.includes('rate limit') || errorMsg.includes('Too many')) {
        setError('Too many login attempts. Please wait a few minutes before trying again.')
      } else if (errorMsg.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.')
      } else {
        setError(errorMsg)
      }
    }
  }

  const demoCredentials = [
    { role: 'Patient', email: 'nick@meditrack.com', password: 'patient123' },
    { role: 'Doctor', email: 'dr.urmi@meditrack.com', password: 'doctor123' },
    { role: 'Admin', email: 'admin@meditrack.com', password: 'admin123' },
  ]

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
    try {
      const loggedInUser = await login(demoEmail, demoPassword)
      if (loggedInUser.role === 'admin') {
        router.push('/admin')
      } else if (loggedInUser.role === 'doctor') {
        router.push('/doctor')
      } else {
        router.push('/patient')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 backdrop-blur-3xl">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-orange-600/90"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold">MediTrack+</h1>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-4xl font-bold leading-tight">Welcome Back to Healthcare Excellence</h2>
                <p className="text-white/90 text-lg leading-relaxed max-w-md">
                  Sign in to access your personalized healthcare dashboard with AI-powered insights and seamless patient management.
                </p>
                
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white/80" />
                    <span className="text-white/90">Bank-level Security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-white/80" />
                    <span className="text-white/90">Real-time Health Monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span className="text-white/90">24/7 Support Available</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-white/60 text-sm">
              © 2026 Gaming Network Studio Media Group. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MediTrack+</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-slate-600 dark:text-slate-400">Sign in to your healthcare dashboard</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Try Demo Accounts</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {demoCredentials.map((demo) => (
                  <Button
                    key={demo.email}
                    type="button"
                    onClick={() => handleDemoLogin(demo.email, demo.password)}
                    disabled={isLoading}
                    variant="outline"
                    className="h-auto py-3 px-2 flex flex-col items-center text-center border-slate-200 dark:border-slate-700 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                  >
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{demo.role}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{demo.email.split('@')[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                Sign up
              </Link>
            </p>

            <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-4">
              Need to create demo users?{' '}
              <Link href="/setup" className="font-semibold hover:underline">
                Run setup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
