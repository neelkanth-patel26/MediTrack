'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const MEDICAL_CONDITIONS = [
  'Diabetes', 'Hypertension', 'Asthma', 'COPD',
  'Heart Disease', 'Thyroid Disease', 'Arthritis',
  'Cancer History', 'Mental Health Disorders', 'Allergies'
]

const MEDICATIONS_CATEGORIES = [
  'Blood Pressure Medication', 'Diabetes Medication', 'Thyroid Medication',
  'Heart Medication', 'Asthma/Respiratory', 'Mental Health Medication'
]

export default function MedicalHistoryPage() {
  const router = useRouter()
  const { color, getColorClasses } = useTheme()
  const colorClasses = getColorClasses()
  
  const [step, setStep] = useState(1)
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [surgeries, setSurgeries] = useState('')
  const [medications, setMedications] = useState('')
  const [allergies, setAllergies] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    )
  }

  const handleNext = () => {
    if (step === 1 && selectedConditions.length === 0) {
      setError('Please select at least one condition or confirm you have none')
      return
    }
    setError('')
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Save medical history to localStorage temporarily
      const medicalHistory = {
        conditions: selectedConditions,
        surgeries,
        medications,
        allergies,
        additionalNotes,
        completedAt: new Date().toISOString(),
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('patient_medical_history', JSON.stringify(medicalHistory))
      }

      // Move to survey page
      router.push('/patient/onboarding/survey')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save medical history')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Medical History</h1>
            <span className="text-sm font-medium text-muted-foreground">Step {step} of 3</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${colorClasses.primary} transition-all duration-300`}
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="p-6 md:p-8 bg-card border-border">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Medical Conditions</h2>
                <p className="text-muted-foreground mb-6">Select any conditions you currently have or have had in the past</p>
              </div>

              <div className="space-y-3">
                {MEDICAL_CONDITIONS.map((condition) => (
                  <label key={condition} className="flex items-center p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors">
                    <Checkbox
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                      className="mr-3"
                    />
                    <span className="font-medium">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Medical History Details</h2>
                <p className="text-muted-foreground mb-6">Provide additional information about your medical history</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="surgeries">Previous Surgeries or Procedures</Label>
                  <Textarea
                    id="surgeries"
                    placeholder="List any surgeries or major procedures you've had..."
                    value={surgeries}
                    onChange={(e) => setSurgeries(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    placeholder="List all medications you're currently taking..."
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    className="min-h-24"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Additional Information</h2>
                <p className="text-muted-foreground mb-6">Help us understand your health better</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="List any medication or food allergies..."
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any other health information you'd like to share..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="min-h-24"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className={`flex-1 bg-gradient-to-r ${colorClasses.primary} text-white hover:opacity-90`}
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex-1 bg-gradient-to-r ${colorClasses.primary} text-white hover:opacity-90`}
              >
                {isLoading ? 'Saving...' : 'Continue to Survey'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
