'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DEMO_USERS } from '@/lib/setup-demo-users'
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [doctorsMessage, setDoctorsMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDoctorsSuccess, setIsDoctorsSuccess] = useState(false)

  const handleCreateDemoUsers = async () => {
    setIsLoading(true)
    setMessage('Creating demo users...')
    setIsSuccess(false)

    try {
      const response = await fetch('/api/setup/create-demo-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create demo users')
      }

      setMessage('✓ Demo users created successfully! You can now login with any demo account.')
      setIsSuccess(true)
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create demo users'}`)
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedDoctors = async () => {
    setIsDoctorsLoading(true)
    setDoctorsMessage('Seeding doctors...')
    setIsDoctorsSuccess(false)

    try {
      const response = await fetch('/api/setup/seed-doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to seed doctors')
      }

      setDoctorsMessage('✓ Doctors seeded successfully! They will now appear in Find Doctors.')
      setIsDoctorsSuccess(true)
    } catch (error) {
      setDoctorsMessage(`Error: ${error instanceof Error ? error.message : 'Failed to seed doctors'}`)
      setIsDoctorsSuccess(false)
    } finally {
      setIsDoctorsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">MediTrack+ Setup</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Initialize the application with demo user accounts for testing
          </p>

          {message && (
            <Alert className={`mb-6 ${isSuccess ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
              {isSuccess ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription className={isSuccess ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {doctorsMessage && (
            <Alert className={`mb-6 ${isDoctorsSuccess ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
              {isDoctorsSuccess ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription className={isDoctorsSuccess ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {doctorsMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Demo Accounts to be Created:</h2>
            <div className="space-y-3">
              {DEMO_USERS.map((user) => (
                <div
                  key={user.email}
                  className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Email: <code className="bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-xs">{user.email}</code>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Password: <code className="bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-xs">{user.password}</code>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 space-y-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Setup Requirements:</strong>
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 ml-4 list-disc">
              <li>
                <strong>SUPABASE_SERVICE_ROLE_KEY:</strong> Add this to your Vercel environment variables. Get it from Supabase Dashboard {' '}
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">Settings → API → Service Role Secret Key</code>
              </li>
              <li>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> Should already be configured
              </li>
              <li>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> Should already be configured
              </li>
            </ul>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-3">
              After adding the service role key, click the button below to create demo accounts.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleCreateDemoUsers}
              disabled={isLoading}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating Demo Users...' : 'Create Demo Users'}
            </Button>

            <Button
              onClick={handleSeedDoctors}
              disabled={isDoctorsLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              {isDoctorsLoading && <Loader className="h-4 w-4 animate-spin" />}
              {isDoctorsLoading ? 'Seeding Doctors...' : 'Seed Doctors Database'}
            </Button>
          </div>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            After creating demo users, you can{' '}
            <a href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
              proceed to login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
