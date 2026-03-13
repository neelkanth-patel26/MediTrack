'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X, Sparkles, Heart } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      
      // Check if user has already dismissed it this session
      const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed')
      if (!isDismissed) {
        // Delay showing the prompt for better UX
        setTimeout(() => setIsVisible(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    setIsVisible(false)
    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className={`relative overflow-hidden p-6 rounded-3xl shadow-2xl border backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800' 
          : 'bg-white/90 border-slate-200'
      } max-w-sm md:w-[380px]`}>
        {/* Decorative background blur */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>

        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>

        <div className="flex gap-4 items-start relative">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 flex-shrink-0">
            <Heart className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              Install MediTrack+
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Experience the future of healthcare as a dedicated app on your device. Faster, reliable, and always ready.
            </p>
            
            <div className="mt-5 flex gap-3">
              <Button 
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 py-5"
              >
                <Download className="w-4 h-4 mr-2" />
                Install Now
              </Button>
              <Button 
                variant="outline"
                onClick={handleDismiss}
                className="rounded-xl border-slate-200 dark:border-slate-800 py-5"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
