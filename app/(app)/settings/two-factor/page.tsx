'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Smartphone, Key, Download, Copy, CheckCircle, ArrowLeft } from 'lucide-react'

export default function TwoFactorSetupPage() {
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const secret = 'JBSWY3DPEHPK3PXP'
  const qrCodeUrl = `otpauth://totp/MediTrack+:user@example.com?secret=${secret}&issuer=MediTrack+`

  const generateBackupCodes = () => {
    const codes = []
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
    }
    setBackupCodes(codes)
  }

  const handleVerify = async () => {
    setIsLoading(true)
    setTimeout(() => {
      generateBackupCodes()
      setIsLoading(false)
      setStep(3)
    }, 1000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="p-6">
        {/* Step 1: QR Code */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h1 className="text-2xl font-bold mb-2">Enable Two-Factor Authentication</h1>
              <p className="text-muted-foreground">Add an extra layer of security</p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">Step 1: Install Authenticator App</h3>
              <div className="space-y-2">
                <Badge variant="outline">Google Authenticator</Badge>
                <Badge variant="outline">Microsoft Authenticator</Badge>
                <Badge variant="outline">Authy</Badge>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-4">Step 2: Scan QR Code</h3>
              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg border">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                  alt="2FA QR Code"
                  className="w-full h-full"
                />
              </div>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Manual key:</p>
                  <code className="text-xs">{secret}</code>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(secret)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              <Smartphone className="w-4 h-4 mr-2" />
              I've Scanned the Code
            </Button>
          </div>
        )}

        {/* Step 2: Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <Key className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h2 className="text-xl font-bold mb-2">Verify Setup</h2>
              <p className="text-muted-foreground">
                Enter the 6-digit code from your app
              </p>
            </div>

            <Input
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest h-14"
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleVerify}
                disabled={verificationCode.length !== 6 || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-xl font-bold mb-2">2FA Enabled!</h2>
              <p className="text-muted-foreground">Save these backup codes</p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                These codes can be used if you lose your device. Each code works only once.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Backup Codes:</h3>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, i) => (
                  <div key={i} className="p-2 bg-muted/30 rounded text-center font-mono text-sm">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button 
                onClick={() => {
                  const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'meditrack-backup-codes.txt'
                  a.click()
                }}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <Button onClick={() => router.push('/settings')} className="w-full">
              Continue to Settings
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}