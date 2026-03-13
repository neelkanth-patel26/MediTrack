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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stethoscope, AlertCircle, Eye, EyeOff, Heart, Shield, Users } from 'lucide-react'
import type { UserRole } from '@/lib/auth-context'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const { color, getColorClasses } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('patient')
  const [specialization, setSpecialization] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const colorClasses = getColorClasses()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      const result = await signup(name, email, password, role, role === 'doctor' ? specialization : undefined)
      
      // Redirect based on role
      if (role === 'doctor') {
        router.push('/doctor')
      } else if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/patient')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sign up failed'
      
      if (errorMsg.includes('rate limit') || errorMsg.includes('Too many') || errorMsg.includes('email rate limit exceeded')) {
        setError('Too many signup attempts. Your account has been created locally - please try logging in with your credentials, or use demo accounts for immediate access.')
      } else if (errorMsg.includes('already registered')) {
        setError('This email is already registered. Please use a different email or try logging in.')
      } else if (errorMsg.includes('Invalid email')) {
        setError('Please enter a valid email address.')
      } else {
        setError(errorMsg)
      }
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
                <h2 className="text-4xl font-bold leading-tight">Join the Future of Healthcare</h2>
                <p className="text-white/90 text-lg leading-relaxed max-w-md">
                  Create your account and experience next-generation healthcare management with AI-powered diagnostics and seamless patient care.
                </p>
                
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white/80" />
                    <span className="text-white/90">HIPAA Compliant & Secure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span className="text-white/90">Trusted by 50K+ Professionals</span>
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
              <p className="text-slate-600 dark:text-slate-400">Join thousands of healthcare professionals</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

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
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
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

              <div>
                <Label htmlFor="confirm-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Account Type</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                      Patient - Access medical records and connect with doctors
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                      Healthcare Provider - Manage patients and practice
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {role === 'doctor' && (
                <div>
                  <Label htmlFor="specialization" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Medical Specialization
                  </Label>
                  <Input
                    id="specialization"
                    placeholder="e.g., Cardiology, Neurology, General Practice"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="mt-1 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg mt-6"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
