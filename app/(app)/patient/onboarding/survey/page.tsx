'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

const SURVEY_QUESTIONS = [
  {
    id: 'lifestyle',
    question: 'How would you describe your physical activity level?',
    options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']
  },
  {
    id: 'diet',
    question: 'How would you describe your diet?',
    options: ['Poor', 'Fair', 'Good', 'Excellent']
  },
  {
    id: 'sleep',
    question: 'On average, how many hours do you sleep per night?',
    options: ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours']
  },
  {
    id: 'stress',
    question: 'How would you rate your stress level?',
    options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
  },
  {
    id: 'smoking',
    question: 'Do you smoke?',
    options: ['Never', 'Former smoker', 'Occasional', 'Regular smoker']
  },
  {
    id: 'alcohol',
    question: 'How often do you consume alcohol?',
    options: ['Never', 'Rarely', 'Occasionally', 'Regularly', 'Daily']
  },
  {
    id: 'goals',
    question: 'What are your main health goals?',
    options: ['Weight Management', 'Fitness', 'Disease Management', 'General Wellness', 'All of the above']
  }
]

export default function SurveyPage() {
  const router = useRouter()
  const { getColorClasses } = useTheme()
  const colorClasses = getColorClasses()
  
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== SURVEY_QUESTIONS.length) {
      alert('Please answer all questions before continuing')
      return
    }

    setIsLoading(true)
    try {
      const surveyData = {
        answers,
        completedAt: new Date().toISOString(),
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('patient_survey', JSON.stringify(surveyData))
        localStorage.setItem('patient_onboarding_complete', 'true')
      }

      router.push('/patient')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save survey')
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercent = (Object.keys(answers).length / SURVEY_QUESTIONS.length) * 100

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Health Survey</h1>
            <span className="text-sm font-medium text-muted-foreground">{Object.keys(answers).length} of {SURVEY_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${colorClasses.primary} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <Card className="p-6 md:p-8 bg-card border-border">
          <div className="space-y-8">
            {SURVEY_QUESTIONS.map((q, index) => (
              <div key={q.id} className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${colorClasses.primary} text-white text-sm font-semibold flex-shrink-0 mt-1`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{q.question}</h3>
                  </div>
                </div>

                <RadioGroup value={answers[q.id] || ''} onValueChange={(value) => handleAnswer(q.id, value)}>
                  <div className="ml-11 space-y-2">
                    {q.options.map((option) => (
                      <label key={option} className="flex items-center p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors">
                        <RadioGroupItem value={option} id={`${q.id}-${option}`} className="mr-3" />
                        <span className="font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>

          {/* Completion Message */}
          {Object.keys(answers).length === SURVEY_QUESTIONS.length && (
            <div className="mt-8 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">Survey Complete</p>
                <p className="text-sm text-green-700 dark:text-green-200">You're all set! Click below to access your dashboard.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || Object.keys(answers).length !== SURVEY_QUESTIONS.length}
              className={`flex-1 bg-gradient-to-r ${colorClasses.primary} text-white hover:opacity-90`}
            >
              {isLoading ? 'Completing...' : 'Complete Onboarding'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
