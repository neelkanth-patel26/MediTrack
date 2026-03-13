'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { QrCode, Shield, Smartphone, Key } from 'lucide-react'

export default function TwoFactorSetupPage() {
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const secret = 'JBSWY3DPEHPK3PXP' // Demo secret
  const qrCodeUrl = `otpauth://totp/MediTrack+:user@example.com?secret=${secret}&issuer=MediTrack+`

  const handleVerify = async () => {
    setIsLoading(true)
    // Verify the 6-digit code
    setTimeout(() => {
      setIsLoading(false)
      alert('2FA enabled successfully!')
    }, 1000)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 mx-auto mb-4 text-orange-600" />
          <h1 className="text-2xl font-bold">Enable Two-Factor Authentication</h1>
          <p className="text-muted-foreground">Secure your account with 2FA</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg border">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                  alt="2FA QR Code"
                  className="w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Scan this QR code with your authenticator app
              </p>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-2">Manual entry key:</p>
              <code className="text-xs bg-background p-2 rounded block">{secret}</code>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              <Smartphone className="w-4 h-4 mr-2" />
              I've Added the Code
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <Key className="w-8 h-8 mx-auto mb-4 text-orange-600" />
              <h3 className="font-semibold mb-2">Enter Verification Code</h3>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <Input
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleVerify}
                disabled={verificationCode.length !== 6 || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Enable 2FA'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}