'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
}

export function SuccessDialog({ open, onOpenChange, title, message }: SuccessDialogProps) {
  const { getColorValues } = useTheme()
  const colorValues = getColorValues()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/95 border border-border/30 shadow-xl rounded-xl">
        <DialogHeader className="pb-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colorValues.primary}15` }}>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-foreground">{title}</DialogTitle>
          <p className="text-muted-foreground mt-2">{message}</p>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button 
            onClick={() => onOpenChange(false)}
            style={{ backgroundColor: colorValues.primary }}
            className="text-white px-8"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}