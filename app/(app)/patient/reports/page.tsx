'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Eye, Calendar, User, Grid, List, Search, Filter, CheckCircle2, Clock, AlertTriangle, Building, X, Upload, Plus, MoreVertical } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Report {
  id: string
  test_name: string
  report_type: string
  test_date: string
  lab_name: string
  status: string
  technician_name?: string
  doctor_name?: string
  test_results?: any
  reference_ranges?: any
  abnormal_flags?: string
  report_url?: string
  created_at: string
}

export default function ReportsPage() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [uploadDialog, setUploadDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    reportType: '',
    testName: '',
    testDate: '',
    labName: ''
  })
  const colorValues = getColorValues()
  
  const isDemoUser = user?.email?.includes('@meditrack.com') || sessionStorage.getItem('isDemoUser') === 'true'

  const fetchReports = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/patient/reports?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      } else {
        setReports([])
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
      setReports([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [user?.id])

  const uploadReport = async () => {
    if (!uploadForm.file || !uploadForm.reportType || !uploadForm.testName || !user?.id) {
      toast.error('Please fill in all required fields')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadForm.file)
      formData.append('userId', user.id)
      formData.append('reportType', uploadForm.reportType)
      formData.append('testName', uploadForm.testName)
      formData.append('testDate', uploadForm.testDate || new Date().toISOString().split('T')[0])
      formData.append('labName', uploadForm.labName || 'Patient Upload')

      const response = await fetch('/api/patient/upload-report', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast.success('Report uploaded successfully!')
        setUploadDialog(false)
        setUploadForm({ file: null, reportType: '', testName: '', testDate: '', labName: '' })
        fetchReports()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to upload report')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload report')
    } finally {
      setUploading(false)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.test_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.report_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.lab_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800'
      case 'reviewed': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-3 w-3" />
      case 'pending': return <Clock className="h-3 w-3" />
      case 'reviewed': return <CheckCircle2 className="h-3 w-3" />
      default: return <AlertTriangle className="h-3 w-3" />
    }
  }

  const ViewReportDialog = ({ report }: { report: any }) => {
    const [open, setOpen] = useState(false)
    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size={viewMode === 'grid' ? 'sm' : 'sm'} className={viewMode === 'grid' ? 'flex-1 text-xs' : ''}>
            <Eye className={viewMode === 'grid' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} />
            {viewMode === 'grid' ? 'View' : 'View Report'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl bg-background/95 border border-border/30 shadow-xl rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b border-border/10">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <FileText className="h-5 w-5" style={{ color: colorValues.primary }} />
              </div>
              <div>
                <div>{report.test_name}</div>
                <div className="text-sm font-normal text-muted-foreground mt-1">
                  {report.report_type} • {new Date(report.test_date).toLocaleDateString()}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: `${colorValues.primary}08` }}>
                <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  <span className="capitalize font-medium">{report.status}</span>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: `${colorValues.primary}08` }}>
                <div className="text-sm font-medium text-muted-foreground mb-1">Test Date</div>
                <div className="font-medium">{new Date(report.test_date).toLocaleDateString()}</div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: `${colorValues.primary}08` }}>
                <div className="text-sm font-medium text-muted-foreground mb-1">Lab</div>
                <div className="font-medium">{report.lab_name}</div>
              </div>
            </div>
            
            {/* Lab and Doctor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Building className="h-5 w-5" style={{ color: colorValues.primary }} />
                  <h3 className="font-semibold">Laboratory Information</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Lab Name</div>
                    <div>{report.lab_name}</div>
                  </div>
                  {report.technician_name && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Technician</div>
                      <div>{report.technician_name}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {report.doctor_name && (
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="h-5 w-5" style={{ color: colorValues.primary }} />
                    <h3 className="font-semibold">Ordering Physician</h3>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Doctor</div>
                    <div>Dr. {report.doctor_name}</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Test Results */}
            {report.test_results && (
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: colorValues.primary }} />
                  Test Results
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {typeof report.test_results === 'object' 
                      ? JSON.stringify(report.test_results, null, 2)
                      : report.test_results}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Reference Ranges */}
            {report.reference_ranges && (
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold mb-4">Reference Ranges</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {typeof report.reference_ranges === 'object' 
                      ? JSON.stringify(report.reference_ranges, null, 2)
                      : report.reference_ranges}
                  </pre>
                </div>
              </div>
            )}
            
            {report.abnormal_flags && (
              <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Abnormal Results</h3>
                </div>
                <p className="text-red-800 dark:text-red-200">{report.abnormal_flags}</p>
              </div>
            )}
            
            {/* Report Metadata */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-3">Report Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Report ID</div>
                  <div className="font-mono">{report.id}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Generated On</div>
                  <div>{new Date(report.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-6 border-t border-border/10">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1" onClick={() => downloadTextReport(report)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const downloadOriginalFile = (report: any) => {
    if (report.report_url) {
      const link = document.createElement('a')
      link.href = report.report_url
      link.download = `${report.test_name}_${new Date(report.test_date || report.created_at).toISOString().split('T')[0]}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const downloadTextReport = (report: any) => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const content = `
═══════════════════════════════════════════════════════════════
                           MEDITRACK+
                      MEDICAL REPORT DOCUMENT
═══════════════════════════════════════════════════════════════

Generated on: ${currentDate}
Patient: ${user?.name || 'Patient Name'}

═══════════════════════════════════════════════════════════════

REPORT INFORMATION:
${'─'.repeat(30)}
Test Name: ${report.test_name}
Report Type: ${report.report_type}
Test Date: ${new Date(report.test_date).toLocaleDateString()}
Status: ${report.status.toUpperCase()}
Report ID: ${report.id}

LABORATORY INFORMATION:
${'─'.repeat(30)}
Lab Name: ${report.lab_name}
${report.technician_name ? `Technician: ${report.technician_name}` : ''}

${report.doctor_name ? `ORDERING PHYSICIAN:
${'─'.repeat(30)}
Doctor: Dr. ${report.doctor_name}

` : ''}
${report.test_results ? `TEST RESULTS:
${'─'.repeat(30)}
${typeof report.test_results === 'object' ? JSON.stringify(report.test_results, null, 2) : report.test_results}

` : ''}
${report.reference_ranges ? `REFERENCE RANGES:
${'─'.repeat(30)}
${typeof report.reference_ranges === 'object' ? JSON.stringify(report.reference_ranges, null, 2) : report.reference_ranges}

` : ''}
${report.abnormal_flags ? `ABNORMAL RESULTS:
${'─'.repeat(30)}
${report.abnormal_flags}

` : ''}
REPORT GENERATED:
${'─'.repeat(30)}
Generated Date: ${new Date(report.created_at).toLocaleDateString()}

═══════════════════════════════════════════════════════════════

This medical report was generated by MediTrack+
For medical inquiries, please consult your healthcare provider.

© ${new Date().getFullYear()} MediTrack+. All rights reserved.
`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MediTrack_${report.test_name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </Card>
        <div className="grid gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Medical Reports</h1>
            <p className="text-sm sm:text-base text-muted-foreground">View and download your lab results and medical reports</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: colorValues.primary }} className="text-white flex-1 sm:flex-none h-10">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader className="pb-6">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <Upload className="h-5 w-5" style={{ color: colorValues.primary }} />
                    </div>
                    Upload Medical Report
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-2">Upload your medical reports and lab results for your doctor to review</p>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="file" className="text-sm font-medium">Report File *</Label>
                    <div className="relative">
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testName" className="text-sm font-medium">Test/Report Name *</Label>
                      <Input
                        id="testName"
                        placeholder="e.g., Blood Test, X-Ray"
                        value={uploadForm.testName}
                        onChange={(e) => setUploadForm({...uploadForm, testName: e.target.value})}
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reportType" className="text-sm font-medium">Report Type *</Label>
                      <Select value={uploadForm.reportType} onValueChange={(value) => setUploadForm({...uploadForm, reportType: value})}>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Blood Test">🩸 Blood Test</SelectItem>
                          <SelectItem value="Imaging">📷 Imaging (X-Ray, MRI, CT)</SelectItem>
                          <SelectItem value="Pathology">🔬 Pathology</SelectItem>
                          <SelectItem value="Cardiology">❤️ Cardiology</SelectItem>
                          <SelectItem value="Other">📋 Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testDate" className="text-sm font-medium">Test Date</Label>
                      <Input
                        id="testDate"
                        type="date"
                        value={uploadForm.testDate}
                        onChange={(e) => setUploadForm({...uploadForm, testDate: e.target.value})}
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="labName" className="text-sm font-medium">Lab/Hospital Name</Label>
                      <Input
                        id="labName"
                        placeholder="e.g., City Hospital"
                        value={uploadForm.labName}
                        onChange={(e) => setUploadForm({...uploadForm, labName: e.target.value})}
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1" onClick={() => setUploadDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={uploadReport}
                      disabled={uploading || !uploadForm.file || !uploadForm.testName || !uploadForm.reportType}
                      className="flex-1 text-white font-medium"
                      style={{ backgroundColor: colorValues.primary }}
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              style={viewMode === 'list' ? { backgroundColor: colorValues.primary, color: 'white' } : {}}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              style={viewMode === 'grid' ? { backgroundColor: colorValues.primary, color: 'white' } : {}}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: colorValues.primary }}>
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ color: colorValues.primary }}>{reports.length}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: colorValues.primary }}>Total Reports</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{reports.filter(r => r.status === 'completed').length}</span>
          </div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completed</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-amber-500 rounded-full">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{reports.filter(r => r.status === 'pending').length}</span>
          </div>
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-full">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{reports.filter(r => r.status === 'reviewed').length}</span>
          </div>
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Reviewed</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search reports, tests, or labs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {filteredReports.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No reports found' : 'No reports available'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'No reports match your search criteria.' 
                : 'Your medical reports and lab results will appear here'}
            </p>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className={`group transition-all duration-300 hover:shadow-xl ${
              viewMode === 'grid' 
                ? 'p-6 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border-l-4 rounded-xl hover:scale-[1.02]' 
                : 'p-6 hover:shadow-lg bg-gradient-to-r from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-800/30 border-l-4'
            }`} style={{ borderLeftColor: report.status === 'completed' ? colorValues.primary : report.status === 'pending' ? '#f59e0b' : '#3b82f6' }}>
              {viewMode === 'grid' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                         style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <FileText className="h-6 w-6" style={{ color: colorValues.primary }} />
                    </div>
                    <Badge className={`${getStatusColor(report.status)} border flex items-center gap-1 px-2 py-1 text-xs`}>
                      {getStatusIcon(report.status)}
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground leading-tight mb-1">
                      {report.test_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{report.report_type}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{report.lab_name}</span>
                  </div>
                  
                  {report.doctor_name && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Dr. {report.doctor_name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(report.test_date).toLocaleDateString()}</span>
                  </div>
                  
                  {report.abnormal_flags && (
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      {report.abnormal_flags}
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                    <ViewReportDialog report={report} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {report.report_url && (
                          <DropdownMenuItem onClick={() => downloadOriginalFile(report)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Original File
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => downloadTextReport(report)}>
                          <Download className="h-4 w-4 mr-2" />
                          Text Summary
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex flex-col xs:flex-row items-center xs:items-start gap-4 flex-1">
                    <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <FileText className="h-6 w-6" style={{ color: colorValues.primary }} />
                    </div>
                    <div className="flex-1 text-center xs:text-left min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">{report.test_name}</h3>
                        <Badge className={`${getStatusColor(report.status)} border flex items-center justify-center gap-1 px-2 py-0.5 text-[10px] w-fit mx-auto xs:mx-0`}>
                          {getStatusIcon(report.status)}
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-base text-muted-foreground font-medium mb-4">{report.report_type}</p>
                      
                      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm mb-4">
                        <div className="flex items-center justify-center xs:justify-start gap-2 text-muted-foreground whitespace-nowrap">
                          <Calendar className="h-4 w-4 shrink-0" style={{ color: colorValues.primary }} />
                          <span>{new Date(report.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center justify-center xs:justify-start gap-2 text-muted-foreground min-w-0">
                          <Building className="h-4 w-4 shrink-0" style={{ color: colorValues.primary }} />
                          <span className="truncate">{report.lab_name}</span>
                        </div>
                        {report.doctor_name && (
                          <div className="flex items-center justify-center xs:justify-start gap-2 text-muted-foreground min-w-0">
                            <User className="h-4 w-4 shrink-0" style={{ color: colorValues.primary }} />
                            <span className="truncate">Dr. {report.doctor_name}</span>
                          </div>
                        )}
                      </div>
                      
                      {report.technician_name && (
                        <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center xs:justify-start gap-1">
                          <span className="font-semibold">Technician:</span> {report.technician_name}
                        </p>
                      )}
                      
            {report.abnormal_flags && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl mb-3 inline-block w-full">
                <div className="flex items-center justify-center xs:justify-start gap-2 text-red-700 dark:text-red-300 mb-1">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span className="font-bold text-xs uppercase tracking-wider">Abnormal Results</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 text-center xs:text-left">{report.abnormal_flags}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-row sm:flex-col gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
          <div className="flex-1 sm:flex-none">
            <ViewReportDialog report={report} />
          </div>
          <div className="flex-1 sm:flex-none">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full h-9 text-xs">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {report.report_url && (
                  <DropdownMenuItem onClick={() => downloadOriginalFile(report)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Original File
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => downloadTextReport(report)}>
                  <Download className="h-4 w-4 mr-2" />
                  Text Summary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    )}
  </Card>
))
        )}
      </div>
    </div>
  )
}