'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Heart, Shield, ArrowLeft } from 'lucide-react'

export default function Verify2FAPage() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useBackupCode, setUseBackupCode] = useState(false)
  const router = useRouter()

  const handleVerify = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push('/patient')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            {useBackupCode ? 'Enter your backup code' : 'Enter the code from your authenticator app'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <Shield className="w-8 h-8 mx-auto mb-4 text-orange-600" />
          </div>

          <Input
            placeholder={useBackupCode ? "Backup code" : "000000"}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, useBackupCode ? 8 : 6))}
            className="text-center text-2xl tracking-widest h-14"
          />

          <Button 
            onClick={handleVerify}
            disabled={code.length < (useBackupCode ? 8 : 6) || isLoading}
            className="w-full h-12"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>

          <div className="text-center">
            <button
              onClick={() => setUseBackupCode(!useBackupCode)}
              className="text-sm text-orange-600 hover:underline"
            >
              {useBackupCode ? 'Use authenticator code' : 'Use backup code instead'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}