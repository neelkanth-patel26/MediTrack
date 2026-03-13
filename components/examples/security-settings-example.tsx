'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, ShieldCheck, Settings } from 'lucide-react'
import { TwoFactorSetupDialog } from '@/components/ui/two-factor-setup-dialog'

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showSetupDialog, setShowSetupDialog] = useState(false)

  const handleSetupComplete = () => {
    setTwoFactorEnabled(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Security Settings</h1>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              {twoFactorEnabled ? (
                <ShieldCheck className="h-6 w-6 text-green-600" />
              ) : (
                <Shield className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
            <Button
              variant={twoFactorEnabled ? 'outline' : 'default'}
              onClick={() => setShowSetupDialog(true)}
            >
              {twoFactorEnabled ? 'Manage' : 'Enable 2FA'}
            </Button>
          </div>
        </div>
      </Card>

      <TwoFactorSetupDialog
        isOpen={showSetupDialog}
        onClose={() => setShowSetupDialog(false)}
        onComplete={handleSetupComplete}
      />
    </div>
  )
}