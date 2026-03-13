'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stethoscope, Send, Search, Brain, CheckCircle, AlertTriangle, Clock, Sparkles, Trash2, Edit } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'

export default function DoctorDiagnosis() {
  const [symptoms, setSymptoms] = useState('')
  const [selectedPatient, setSelectedPatient] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [patientGender, setPatientGender] = useState('')
  const [medicalHistory, setMedicalHistory] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [finalDiagnosis, setFinalDiagnosis] = useState('')
  const [treatmentPlan, setTreatmentPlan] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [recentDiagnoses, setRecentDiagnoses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, diagnosisId: '' })
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  useEffect(() => {
    if (user?.id) {
      fetchPatients()
      fetchRecentDiagnoses()
    }
  }, [user?.id])

  const fetchPatients = async () => {
    try {
      const response = await fetch(`/api/doctor/patients?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const fetchRecentDiagnoses = async () => {
    try {
      const response = await fetch(`/api/doctor/ai-diagnoses?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setRecentDiagnoses(data.diagnoses)
      }
    } catch (error) {
      console.error('Error fetching diagnoses:', error)
    }
  }

  const handleAnalyze = async () => {
    if (!symptoms.trim() || !selectedPatient) return

    setAnalyzing(true)
    try {
      const response = await fetch('/api/doctor/ai-diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: user?.id,
          patientId: selectedPatient,
          symptoms: symptoms.trim(),
          patientAge,
          patientGender,
          medicalHistory
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiSuggestion(data.aiSuggestion)
        setAiAnalysis(data.analysis)
        setConfidence(data.confidence)
        toast.success('AI analysis completed')
      } else {
        toast.error('Failed to analyze symptoms')
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error)
      toast.error('Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleConfirmDiagnosis = async () => {
    if (!finalDiagnosis.trim()) {
      toast.error('Please provide your clinical assessment')
      return
    }

    setLoading(true)
    try {
      const isEditing = editingRecord !== null
      const url = isEditing 
        ? `/api/doctor/ai-diagnoses?diagnosisId=${editingRecord.id}`
        : '/api/doctor/ai-diagnoses'
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEditing ? {} : { doctorId: user?.id }),
          patientId: selectedPatient,
          symptoms,
          aiSuggestion,
          confidence,
          finalDiagnosis,
          treatmentPlan,
          status: 'confirmed'
        })
      })

      if (response.ok) {
        toast.success(isEditing ? 'Diagnosis updated successfully' : 'Diagnosis confirmed and saved')
        clearForm()
        fetchRecentDiagnoses()
      } else {
        toast.error(isEditing ? 'Failed to update diagnosis' : 'Failed to save diagnosis')
      }
    } catch (error) {
      console.error('Error saving diagnosis:', error)
      toast.error('Failed to save diagnosis')
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setSymptoms('')
    setSelectedPatient('')
    setPatientAge('')
    setPatientGender('')
    setMedicalHistory('')
    setAiSuggestion(null)
    setAiAnalysis(null)
    setConfidence(null)
    setFinalDiagnosis('')
    setTreatmentPlan('')
    setEditingRecord(null)
  }

  const handleDeleteDiagnosis = (diagnosisId: string) => {
    setDeleteDialog({ isOpen: true, diagnosisId })
  }

  const handleEditDiagnosis = (record: any) => {
    setEditingRecord(record)
    setSelectedPatient(record.patientId)
    setSymptoms(record.symptoms)
    setAiSuggestion(record.aiSuggestion)
    setFinalDiagnosis(record.finalDiagnosis || '')
    setTreatmentPlan(record.treatmentPlan || '')
    setConfidence(parseInt(record.confidenceScore))
    
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/doctor/ai-diagnoses?diagnosisId=${deleteDialog.diagnosisId}&doctorId=${user?.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('AI diagnosis deleted successfully')
        fetchRecentDiagnoses()
      } else {
        toast.error('Failed to delete diagnosis')
      }
    } catch (error) {
      console.error('Error deleting diagnosis:', error)
      toast.error('Failed to delete diagnosis')
    } finally {
      setDeleteDialog({ isOpen: false, diagnosisId: '' })
    }
  }

  const filteredDiagnoses = recentDiagnoses.filter(diagnosis =>
    diagnosis.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagnosis.symptoms?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl border p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${colorValues.primary}20` }}>
              <Brain className="h-8 w-8" style={{ color: colorValues.primary }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Diagnosis Assistant</h1>
              <p className="text-muted-foreground mt-1">Advanced AI-powered diagnostic analysis for clinical decision support</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <Badge variant="outline">
                {recentDiagnoses.filter(d => d.status === 'pending').length} Pending Reviews
              </Badge>
            </div>
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={clearForm}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="p-8 shadow-lg border">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colorValues.primary}20` }}>
              <Stethoscope className="h-6 w-6" style={{ color: colorValues.primary }} />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {editingRecord ? 'Edit Diagnosis' : 'Patient Analysis'}
            </h2>
            {editingRecord && (
              <Badge variant="outline" className="ml-2">
                Editing: {editingRecord.patientName}
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="patient" className="text-sm font-semibold text-foreground">Select Patient</Label>
              <Select value={selectedPatient} onValueChange={(value) => {
                setSelectedPatient(value)
                const patient = patients.find(p => p.id === value)
                if (patient) {
                  setPatientAge(patient.age || '')
                  setPatientGender(patient.gender || '')
                  setMedicalHistory(patient.allergies || '')
                }
              }}>
                <SelectTrigger className="h-12 border-2 focus:border-primary">
                  <SelectValue placeholder="Choose patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {patient.name} ({patient.patientId})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPatient && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="age" className="text-sm font-semibold text-foreground">Age</Label>
                  <Input
                    id="age"
                    placeholder="Patient age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="h-12 border-2 focus:border-primary"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="gender" className="text-sm font-semibold text-foreground">Gender</Label>
                  <Select value={patientGender} onValueChange={setPatientGender}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedPatient && (
              <div className="space-y-2">
                <Label htmlFor="history">Medical History</Label>
                <Textarea
                  id="history"
                  placeholder="Relevant medical history, allergies, current medications..."
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="h-20 resize-none"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms & Clinical Observations</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe patient symptoms, vital signs, and clinical observations in detail..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="h-32 resize-none"
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI Recognition Keywords</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Chest pain, shortness of breath → Cardiac • Fever, cough → Respiratory • Headache, neck stiffness → Neurological
              </p>
            </div>

            <Button
              onClick={handleAnalyze}
              className="w-full h-14 gap-3 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              style={{ backgroundColor: colorValues.primary }}
              disabled={!symptoms.trim() || !selectedPatient || analyzing}
            >
              <Brain className="h-5 w-5" />
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Analyzing...
                </>
              ) : (
                'Analyze with AI'
              )}
            </Button>
          </div>
        </Card>

        {/* AI Results Section */}
        <Card className="p-8 shadow-lg border">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colorValues.primary}20` }}>
              <Brain className="h-6 w-6" style={{ color: colorValues.primary }} />
            </div>
            <h2 className="text-xl font-bold text-foreground">AI Analysis Results</h2>
          </div>

          {aiAnalysis || aiSuggestion ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Analysis
                  </span>
                  <Badge variant="outline">{aiAnalysis?.confidenceScore || confidence}% confidence</Badge>
                </div>
                
                <div className="space-y-3">
                  {aiAnalysis ? (
                    <>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold text-sm text-foreground mb-1">Primary Diagnosis</h4>
                        <p className="text-sm text-muted-foreground">{aiAnalysis.primaryDiagnosis}</p>
                      </div>
                      
                      {aiAnalysis.differentialDiagnoses && aiAnalysis.differentialDiagnoses.length > 0 && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold text-sm text-foreground mb-1">Differential Diagnoses</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {aiAnalysis.differentialDiagnoses.map((diagnosis: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {diagnosis}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {aiAnalysis.recommendedTests && aiAnalysis.recommendedTests.length > 0 && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold text-sm text-foreground mb-1">Recommended Tests</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {aiAnalysis.recommendedTests.map((test: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {test}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {aiAnalysis.treatmentRecommendations && aiAnalysis.treatmentRecommendations.length > 0 && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold text-sm text-foreground mb-1">Treatment Recommendations</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {aiAnalysis.treatmentRecommendations.map((treatment: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className={`p-3 rounded-lg border ${
                        aiAnalysis.urgencyLevel === 'Critical' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                        aiAnalysis.urgencyLevel === 'High' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' :
                        aiAnalysis.urgencyLevel === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                        'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                      }`}>
                        <h4 className={`font-semibold text-sm mb-1 ${
                          aiAnalysis.urgencyLevel === 'Critical' ? 'text-red-700 dark:text-red-300' :
                          aiAnalysis.urgencyLevel === 'High' ? 'text-orange-700 dark:text-orange-300' :
                          aiAnalysis.urgencyLevel === 'Medium' ? 'text-yellow-700 dark:text-yellow-300' :
                          'text-green-700 dark:text-green-300'
                        }`}>Urgency Level: {aiAnalysis.urgencyLevel}</h4>
                        {aiAnalysis.reasoning && (
                          <p className={`text-sm ${
                            aiAnalysis.urgencyLevel === 'Critical' ? 'text-red-600 dark:text-red-400' :
                            aiAnalysis.urgencyLevel === 'High' ? 'text-orange-600 dark:text-orange-400' :
                            aiAnalysis.urgencyLevel === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>{aiAnalysis.reasoning}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold text-sm text-foreground mb-1">AI Suggestion</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{aiSuggestion}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-diagnosis">Your Clinical Assessment</Label>
                <Textarea
                  id="final-diagnosis"
                  placeholder="Confirm, modify, or provide your clinical diagnosis..."
                  className="h-24 resize-none"
                  value={finalDiagnosis}
                  onChange={(e) => setFinalDiagnosis(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment Plan</Label>
                <Textarea
                  id="treatment"
                  placeholder="Outline treatment plan, medications, follow-up..."
                  className="h-20 resize-none"
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                  onClick={handleConfirmDiagnosis}
                  disabled={loading || !finalDiagnosis.trim()}
                >
                  <CheckCircle className="h-4 w-4" />
                  {loading ? 'Saving...' : (editingRecord ? 'Update Diagnosis' : 'Confirm Diagnosis')}
                </Button>
                {editingRecord && (
                  <Button 
                    variant="outline"
                    onClick={clearForm}
                    disabled={loading}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Select patient and enter symptoms to get AI analysis</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Diagnoses */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent AI Diagnoses</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search diagnoses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDiagnoses.length > 0 ? filteredDiagnoses.map((record) => (
            <Card key={record.id} className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{record.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(record.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={record.status === 'confirmed' ? 'default' : 'secondary'}>
                  {record.confidenceScore}%
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">{record.symptoms}</p>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded text-xs">
                  <span className="font-medium text-orange-900 dark:text-orange-100">AI: </span>
                  <span className="text-orange-800 dark:text-orange-200">{record.aiSuggestion}</span>
                </div>
                {record.finalDiagnosis && (
                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded text-xs">
                    <span className="font-medium text-green-900 dark:text-green-100">Final: </span>
                    <span className="text-green-800 dark:text-green-200">{record.finalDiagnosis}</span>
                  </div>
                )}
              </div>
              
              {record.treatmentPlan && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">{record.treatmentPlan}</p>
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t border-border flex justify-between">
                {record.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditDiagnosis(record)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDeleteDiagnosis(record.id)
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          )) : (
            <div className="col-span-full text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No diagnoses found matching your search.' : 'No AI diagnoses yet.'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-600">
              {recentDiagnoses.length > 0 
                ? Math.round((recentDiagnoses.filter(d => d.status === 'confirmed').length / recentDiagnoses.length) * 100)
                : 0}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Confirmation Rate</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-5 w-5" style={{ color: colorValues.primary }} />
            <span className="font-semibold" style={{ color: colorValues.primary }}>{recentDiagnoses.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Analyses</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-600">
              {recentDiagnoses.length > 0 
                ? Math.round(recentDiagnoses.reduce((acc, d) => acc + (d.confidenceScore || 0), 0) / recentDiagnoses.length)
                : 0}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Avg Confidence</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-yellow-600">{recentDiagnoses.filter(d => d.status === 'pending').length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Pending Review</p>
        </Card>
      </div>
      
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, diagnosisId: '' })}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
