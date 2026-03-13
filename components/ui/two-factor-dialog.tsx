'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Shield, Smartphone, Key, Copy, CheckCircle, ArrowLeft, Download } from 'lucide-react'

export function TwoFactorSetupDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
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

  const resetDialog = () => {
    setStep(1)
    setVerificationCode('')
    setBackupCodes([])
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetDialog()
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/20">
              <Shield className="h-4 w-4 text-orange-600" />
            </div>
            Enable Two-Factor Authentication
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: QR Code */}
        {step === 1 && (
          <div className="space-y-6 pt-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">Install Authenticator App</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Google Authenticator</Badge>
                <Badge variant="outline" className="text-xs">Microsoft Authenticator</Badge>
                <Badge variant="outline" className="text-xs">Authy</Badge>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-4">Scan QR Code</h3>
              <div className="w-40 h-40 mx-auto bg-white p-3 rounded-lg border">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrCodeUrl)}`}
                  alt="2FA QR Code"
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Open your authenticator app and scan this code
              </p>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">Manual key:</p>
                  <code className="text-xs text-muted-foreground">{secret}</code>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(secret)}>
                  <Copy className="w-3 h-3" />
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
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <Key className="w-10 h-10 mx-auto mb-4 text-orange-600" />
              <h3 className="font-semibold mb-2">Verify Setup</h3>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your app
              </p>
            </div>

            <Input
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-xl tracking-widest h-12"
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
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success & Backup Codes */}
        {step === 3 && (
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <CheckCircle className="w-10 h-10 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">2FA Enabled!</h3>
              <p className="text-sm text-muted-foreground">Save these backup codes</p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Keep these codes safe. Each can only be used once if you lose your device.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Backup Codes:</h4>
              <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                {backupCodes.map((code, i) => (
                  <div key={i} className="p-2 bg-muted/30 rounded text-center font-mono text-xs">
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
                size="sm"
              >
                <Copy className="w-3 h-3 mr-2" />
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
                size="sm"
              >
                <Download className="w-3 h-3 mr-2" />
                Save
              </Button>
            </div>

            <Button onClick={() => setOpen(false)} className="w-full">
              Complete Setup
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}