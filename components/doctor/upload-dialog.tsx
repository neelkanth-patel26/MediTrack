'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'
import { Upload, FileText, User, Calendar, Building2 } from 'lucide-react'
import { toast } from 'sonner'

export function UploadReportDialog({ children, onSuccess }: { children: React.ReactNode, onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientId: '',
    testName: '',
    category: '',
    testDate: '',
    labName: '',
    technicianName: '',
    resultsSummary: '',
    notes: ''
  })
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  useEffect(() => {
    if (open && user?.id) {
      fetchPatients()
    }
  }, [open, user?.id])

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.testName) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      let fileUrl = ''
      
      // Upload file if selected
      if (selectedFile) {
        const fileFormData = new FormData()
        fileFormData.append('file', selectedFile)
        fileFormData.append('type', 'reports')
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          fileUrl = uploadData.url
        } else {
          toast.error('Failed to upload file')
          return
        }
      }

      const response = await fetch('/api/doctor/lab-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: user?.id,
          patientId: formData.patientId,
          testName: formData.testName,
          category: formData.category,
          testDate: formData.testDate,
          labName: formData.labName,
          technicianName: formData.technicianName,
          resultsSummary: formData.resultsSummary,
          notes: formData.notes,
          reportUrl: fileUrl
        })
      })

      if (response.ok) {
        toast.success('Lab report uploaded successfully')
        setOpen(false)
        setSelectedFile(null)
        setFormData({
          patientId: '',
          testName: '',
          category: '',
          testDate: '',
          labName: '',
          technicianName: '',
          resultsSummary: '',
          notes: ''
        })
        onSuccess?.()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload lab report')
      }
    } catch (error) {
      toast.error('Failed to upload lab report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-6xl w-[95vw] h-[80vh] p-0 gap-0 rounded-xl overflow-hidden">
        <div className="h-full flex flex-col bg-background">
          <DialogHeader className="px-6 py-4 border-b border-border/10">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <Upload className="h-5 w-5" style={{ color: colorValues.primary }} />
              </div>
              <div>
                <div>Upload Lab Report</div>
                <div className="text-xs font-normal text-muted-foreground">
                  Add new lab results for patient records
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Left Column - Patient & Test Info */}
              <div className="space-y-4">
                {/* Patient Selection */}
                <div className="p-4 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4" style={{ color: colorValues.primary }} />
                    <span className="font-medium text-sm">Patient</span>
                  </div>
                  <Select value={formData.patientId} onValueChange={(value) => setFormData({...formData, patientId: value})}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <p className="text-sm">No patients found</p>
                        </div>
                      ) : (
                        patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} ({patient.patientId})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Test Details */}
                <div className="p-4 rounded-lg border bg-muted/20 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" style={{ color: colorValues.primary }} />
                    <span className="font-medium text-sm">Test Details</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Test Name *</Label>
                      <Input 
                        placeholder="e.g., Complete Blood Count" 
                        value={formData.testName}
                        onChange={(e) => setFormData({...formData, testName: e.target.value})}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blood">Blood Test</SelectItem>
                          <SelectItem value="imaging">Imaging</SelectItem>
                          <SelectItem value="cardiac">Cardiac</SelectItem>
                          <SelectItem value="urine">Urine Analysis</SelectItem>
                          <SelectItem value="specialized">Specialized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Test Date</Label>
                      <Input 
                        type="date" 
                        value={formData.testDate}
                        onChange={(e) => setFormData({...formData, testDate: e.target.value})}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Lab/Facility</Label>
                      <Input 
                        placeholder="e.g., Quest Diagnostics" 
                        value={formData.labName}
                        onChange={(e) => setFormData({...formData, labName: e.target.value})}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Technician</Label>
                      <Input 
                        placeholder="Technician name" 
                        value={formData.technicianName}
                        onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column - File Upload */}
              <div className="flex flex-col">
                <div className="flex-1 p-6 rounded-lg border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}20` }}>
                    <Upload className="h-8 w-8" style={{ color: colorValues.primary }} />
                  </div>
                  <div className="text-center mb-4">
                    <Label className="text-lg font-semibold text-foreground cursor-pointer">
                      {selectedFile ? selectedFile.name : 'Upload Report File'}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedFile ? 
                        `File size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` :
                        'PDF, DOC, JPG, or PNG files (Max 10MB)'
                      }
                    </p>
                  </div>
                  <Input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="border-2 border-primary/50 hover:bg-primary/10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {selectedFile ? 'Change File' : 'Choose File'}
                  </Button>
                </div>
              </div>

              {/* Right Column - Results & Notes */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" style={{ color: colorValues.primary }} />
                      Results Summary
                    </Label>
                    <Textarea 
                      placeholder="Brief summary of key findings..." 
                      rows={10} 
                      value={formData.resultsSummary}
                      onChange={(e) => setFormData({...formData, resultsSummary: e.target.value})}
                      className="resize-none border-primary/20 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" style={{ color: colorValues.primary }} />
                      Additional Notes
                    </Label>
                    <Textarea 
                      placeholder="Any additional observations..." 
                      rows={10} 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="resize-none border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 p-6 border-t border-border/10">
            <Button 
              variant="outline" 
              className="flex-1 h-10" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white flex-1 h-10 font-medium"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Report
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}