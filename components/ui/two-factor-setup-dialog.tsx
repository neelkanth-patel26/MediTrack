'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, Smartphone, Key, Copy, Check, QrCode } from 'lucide-react'
import { toast } from 'sonner'

interface TwoFactorSetupDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function TwoFactorSetupDialog({ isOpen, onClose, onComplete }: TwoFactorSetupDialogProps) {
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock secret key and QR code URL - in real implementation, these would come from your backend
  const secretKey = 'JBSWY3DPEHPK3PXP'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/MediTrack:user@example.com?secret=${secretKey}&issuer=MediTrack`

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey)
    setCopiedSecret(true)
    toast.success('Secret key copied to clipboard')
    setTimeout(() => setCopiedSecret(false), 2000)
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setLoading(true)
    try {
      // Mock API call - replace with actual 2FA verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock backup codes
      const codes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      )
      setBackupCodes(codes)
      setStep(3)
      toast.success('2FA verified successfully!')
    } catch (error) {
      toast.error('Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    onComplete()
    onClose()
    setStep(1)
    setVerificationCode('')
    setBackupCodes([])
    toast.success('Two-factor authentication enabled!')
  }

  const handleClose = () => {
    onClose()
    setStep(1)
    setVerificationCode('')
    setBackupCodes([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Set Up Two-Factor Authentication
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Your Account</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account with two-factor authentication.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Authenticator App</p>
                  <p className="text-xs text-muted-foreground">Google Authenticator, Authy, etc.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code with your authenticator app
              </p>
              
              <div className="bg-white p-4 rounded-lg border inline-block">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Or enter this key manually:</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={secretKey} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySecret}
                  className="shrink-0"
                >
                  {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="verification-code">Enter verification code from your app:</Label>
              <Input
                id="verification-code"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleVerifyCode} 
                disabled={loading || verificationCode.length !== 6}
                className="flex-1"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Almost Done!</h3>
              <p className="text-sm text-muted-foreground">
                Save these backup codes in a secure location. You can use them to access your account if you lose your device.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Backup Codes</Label>
                <Badge variant="outline" className="text-xs">
                  <Key className="h-3 w-3 mr-1" />
                  Keep Safe
                </Badge>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg border">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="p-2 bg-background rounded border text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Each backup code can only be used once. Store them securely.
              </p>
            </div>

            <Button onClick={handleComplete} className="w-full">
              Complete Setup
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}