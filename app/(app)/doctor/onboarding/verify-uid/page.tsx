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
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

const VERIFIED_DOCTORS = {
  'MED123456': { name: 'Dr. Smith', specialty: 'Cardiology' },
  'MED789012': { name: 'Dr. Johnson', specialty: 'Neurology' },
  'MED345678': { name: 'Dr. Williams', specialty: 'Pediatrics' },
}

export default function DoctorUIDVerification() {
  const router = useRouter()
  const { user } = useAuth()
  const { isDarkMode, getColorClasses } = useTheme()
  const [uid, setUid] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifiedDoctor, setVerifiedDoctor] = useState<{ name: string; specialty: string } | null>(null)
  const [error, setError] = useState('')

  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">This page is only for healthcare providers.</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const colorClasses = getColorClasses()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const upperUID = uid.toUpperCase()
    if (VERIFIED_DOCTORS[upperUID as keyof typeof VERIFIED_DOCTORS]) {
      const doctor = VERIFIED_DOCTORS[upperUID as keyof typeof VERIFIED_DOCTORS]
      setVerified(true)
      setVerifiedDoctor(doctor)
      
      // Save verification to session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('doctorVerified', 'true')
        sessionStorage.setItem('doctorUID', upperUID)
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/doctor')
      }, 2000)
    } else {
      setError('Invalid UID. Please check and try again. Try: MED123456')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 border-blue-200 dark:border-slate-800">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses.primary} mb-4`}>
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Verification</h1>
            <p className="text-muted-foreground">Enter your medical registration UID to verify your credentials</p>
          </div>

          {!verified ? (
            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="uid" className="font-medium">
                  Medical Registration UID
                </Label>
                <Input
                  id="uid"
                  placeholder="e.g., MED123456"
                  value={uid}
                  onChange={(e) => setUid(e.target.value.toUpperCase())}
                  className="h-11 uppercase"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This is your unique medical identification number from your registration board.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-slate-800 rounded-lg p-4 border border-blue-200 dark:border-slate-700">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Demo UIDs for testing:</strong>
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                  <li>• MED123456 - Dr. Smith (Cardiology)</li>
                  <li>• MED789012 - Dr. Johnson (Neurology)</li>
                  <li>• MED345678 - Dr. Williams (Pediatrics)</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !uid}
                className={`w-full h-11 font-semibold text-white bg-gradient-to-r ${colorClasses.primary} hover:opacity-90 disabled:opacity-50`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  'Verify UID'
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Verification Successful!</h2>
                <p className="text-muted-foreground mb-4">
                  Your credentials have been verified successfully.
                </p>
              </div>

              {verifiedDoctor && (
                <div className="bg-blue-50 dark:bg-slate-800 rounded-lg p-4 border border-blue-200 dark:border-slate-700 text-left">
                  <p className="text-sm font-semibold text-foreground mb-2">Verified Doctor Information:</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {verifiedDoctor.name}</p>
                    <p><strong>Specialty:</strong> {verifiedDoctor.specialty}</p>
                    <p><strong>UID:</strong> {uid}</p>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </div>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have a UID? <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Contact support</Link>
        </p>
      </div>
    </div>
  )
}
