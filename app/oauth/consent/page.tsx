'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Shield, User, Mail, Calendar, FileText, CheckCircle, X } from 'lucide-react'

function ConsentContent() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  
  const clientId = searchParams.get('client_id') || 'demo-app'
  const redirectUri = searchParams.get('redirect_uri') || 'https://example.com/callback'
  const scope = searchParams.get('scope') || 'read:profile read:appointments'
  const state = searchParams.get('state') || ''
  
  const appName = 'HealthConnect Mobile'
  const scopes = scope.split(' ').map(s => {
    const [action, resource] = s.split(':')
    return { action, resource, description: getScopeDescription(s) }
  })

  function getScopeDescription(scope: string) {
    const descriptions: Record<string, string> = {
      'read:profile': 'View your basic profile information',
      'read:appointments': 'View your appointment history',
      'read:prescriptions': 'View your prescription information',
      'read:vitals': 'View your health vitals and measurements',
      'write:appointments': 'Create and modify appointments on your behalf',
      'write:messages': 'Send messages to your healthcare providers'
    }
    return descriptions[scope] || 'Access your account information'
  }

  const handleAllow = async () => {
    setIsLoading(true)
    
    // Generate authorization code
    const authCode = Math.random().toString(36).substring(2, 15)
    
    const redirectUrl = new URL(redirectUri)
    redirectUrl.searchParams.set('code', authCode)
    if (state) redirectUrl.searchParams.set('state', state)
    
    setTimeout(() => {
      window.location.href = redirectUrl.toString()
    }, 1000)
  }

  const handleDeny = () => {
    const redirectUrl = new URL(redirectUri)
    redirectUrl.searchParams.set('error', 'access_denied')
    if (state) redirectUrl.searchParams.set('state', state)
    
    window.location.href = redirectUrl.toString()
  }

  return (
    <Card className="w-full max-w-md p-6 bg-white/95 dark:bg-slate-900/95 border border-border/30 shadow-xl rounded-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">MediTrack+</h1>
        <p className="text-sm text-muted-foreground">OAuth Authorization</p>
      </div>

      {/* App Info */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{appName}</h3>
            <p className="text-xs text-muted-foreground">wants to access your MediTrack+ account</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Client ID: {clientId}
        </Badge>
      </div>

      {/* Permissions */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          This app will be able to:
        </h4>
        <div className="space-y-2">
          {scopes.map((scope, i) => (
            <div key={i} className="flex items-start gap-3 p-2 bg-muted/20 rounded">
              {scope.resource === 'profile' && <User className="w-4 h-4 text-blue-600 mt-0.5" />}
              {scope.resource === 'appointments' && <Calendar className="w-4 h-4 text-green-600 mt-0.5" />}
              {scope.resource === 'prescriptions' && <FileText className="w-4 h-4 text-purple-600 mt-0.5" />}
              {scope.resource === 'vitals' && <Heart className="w-4 h-4 text-red-600 mt-0.5" />}
              {scope.resource === 'messages' && <Mail className="w-4 h-4 text-orange-600 mt-0.5" />}
              <div>
                <p className="text-sm font-medium text-foreground">{scope.description}</p>
                <p className="text-xs text-muted-foreground">{scope.action}:{scope.resource}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex gap-2">
          <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">Security Notice</p>
            <p>Only authorize apps you trust. You can revoke access anytime in your account settings.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 h-11" 
          onClick={handleDeny}
          disabled={isLoading}
        >
          <X className="w-4 h-4 mr-2" />
          Deny
        </Button>
        <Button 
          className="flex-1 h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
          onClick={handleAllow}
          disabled={isLoading}
        >
          {isLoading ? (
            'Authorizing...'
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Allow
            </>
          )}
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border/10 text-center">
        <p className="text-xs text-muted-foreground">
          By clicking "Allow", you agree to share the requested information with {appName}.
        </p>
      </div>
    </Card>
  )
}

export default function OAuthConsentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      <Suspense fallback={
        <Card className="w-full max-w-md p-6 bg-white/95 dark:bg-slate-900/95 border border-border/30 shadow-xl rounded-xl animate-pulse">
          <div className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground italic">Loading authorization request...</div>
          </div>
        </Card>
      }>
        <ConsentContent />
      </Suspense>
    </div>
  )
}