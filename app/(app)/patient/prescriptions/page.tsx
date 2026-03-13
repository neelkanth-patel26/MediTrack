'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pill, Calendar, RefreshCw, Search, User, Clock, FileText, AlertTriangle, CheckCircle, Eye, Download, Grid, List, XCircle, Timer } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

export default function PrescriptionsPage() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const [prescriptions, setPrescriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const colorValues = getColorValues()

  useEffect(() => {
    if (user?.id) {
      fetchPrescriptions()
    }
  }, [user?.id])

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(`/api/patient/prescriptions?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setPrescriptions(data.prescriptions || [])
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error)
      setPrescriptions([])
    } finally {
      setIsLoading(false)
    }
  }

  const exportToPDF = () => {
    const pdf = new jsPDF()
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    // Orange gradient header
    pdf.setFillColor(251, 146, 60) // Orange
    pdf.rect(0, 0, 210, 30, 'F')
    pdf.setFillColor(234, 88, 12) // Darker orange
    pdf.rect(0, 25, 210, 5, 'F')
    
    // Header text
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(22)
    pdf.setFont('helvetica', 'bold')
    pdf.text('MediTrack+', 105, 18, { align: 'center' })
    pdf.setFontSize(10)
    pdf.text('Prescription Summary Report', 105, 26, { align: 'center' })
    
    // Patient info - compact
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(9)
    pdf.text(`Patient: ${user?.name || 'Patient Name'} | Generated: ${currentDate} | Total: ${filteredPrescriptions.length} prescriptions`, 15, 40)
    
    let yPosition = 50
    
    filteredPrescriptions.forEach((prescription, index) => {
      // Check if we need a new page
      if (yPosition > 210) {
        pdf.addPage()
        yPosition = 20
      }
      
      // Prescription card with orange accent
      pdf.setDrawColor(251, 146, 60)
      pdf.setLineWidth(0.8)
      pdf.rect(15, yPosition, 180, 85, 'S')
      
      // Orange left border
      pdf.setFillColor(251, 146, 60)
      pdf.rect(15, yPosition, 3, 85, 'F')
      
      // Header with prescription number and status
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`#${index + 1} ${prescription.medicationName}`, 25, yPosition + 8)
      
      // Status badge
      const statusColor = prescription.status === 'active' ? [34, 197, 94] : 
                         prescription.status === 'completed' ? [59, 130, 246] : [239, 68, 68]
      pdf.setFillColor(...statusColor)
      pdf.rect(170, yPosition + 2, 20, 8, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(7)
      pdf.text(prescription.status.toUpperCase(), 180, yPosition + 7, { align: 'center' })
      
      // Medication details - comprehensive
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      
      // Left column
      pdf.text(`Dosage: ${prescription.dosage}`, 25, yPosition + 18)
      pdf.text(`Frequency: ${prescription.frequency}`, 25, yPosition + 25)
      pdf.text(`Duration: ${prescription.duration || 'Not specified'}`, 25, yPosition + 32)
      pdf.text(`Refills: ${prescription.refills} remaining`, 25, yPosition + 39)
      
      // Right column - Doctor info
      pdf.text(`Prescribed by: Dr. ${prescription.doctorName}`, 110, yPosition + 18)
      pdf.text(`Specialization: ${prescription.doctorSpecialization}`, 110, yPosition + 25)
      pdf.text(`Issued: ${new Date(prescription.issuedAt).toLocaleDateString()}`, 110, yPosition + 32)
      pdf.text(`ID: ${prescription.id.slice(0, 8)}...`, 110, yPosition + 39)
      
      // Instructions if available
      if (prescription.instructions) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Instructions:', 25, yPosition + 50)
        pdf.setFont('helvetica', 'normal')
        const instructions = pdf.splitTextToSize(prescription.instructions, 160)
        pdf.text(instructions, 25, yPosition + 57)
        yPosition += Math.max(7, instructions.length * 4)
      }
      
      yPosition += 95
    })
    
    // Footer on each page
    const pageCount = pdf.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFillColor(251, 146, 60)
      pdf.rect(0, 285, 210, 12, 'F')
      pdf.setFontSize(7)
      pdf.setTextColor(255, 255, 255)
      pdf.text('MediTrack+ Digital Health Platform', 105, 292, { align: 'center' })
      pdf.text(`Page ${i}/${pageCount}`, 190, 292, { align: 'right' })
    }
    
    pdf.save(`MediTrack_Prescriptions_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('All prescriptions exported to PDF successfully')
  }

  const exportSinglePrescriptionToPDF = (prescription: any) => {
    const pdf = new jsPDF()
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    // Simple orange header
    pdf.setFillColor(251, 146, 60)
    pdf.rect(0, 0, 210, 40, 'F')
    
    // Simple brand text
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(28)
    pdf.setFont('helvetica', 'bold')
    pdf.text('MediTrack+', 105, 20, { align: 'center' })
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Digital Prescription', 105, 32, { align: 'center' })
    
    // Simple patient info
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.text(`Patient: ${user?.name || 'Patient Name'}`, 15, 52)
    pdf.text(`Generated: ${currentDate}`, 15, 60)
    
    // Simple status badge
    const statusColor = prescription.status === 'active' ? [34, 197, 94] : 
                       prescription.status === 'completed' ? [59, 130, 246] : [239, 68, 68]
    pdf.setFillColor(...statusColor)
    pdf.rect(160, 50, 30, 12, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.text(prescription.status.toUpperCase(), 175, 58, { align: 'center' })
    
    // Simple medication section
    pdf.setTextColor(0, 0, 0)
    pdf.setDrawColor(251, 146, 60)
    pdf.setLineWidth(1)
    pdf.rect(15, 70, 180, 120, 'S')
    
    // Medication name
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text(prescription.medicationName, 25, 85)
    
    // Simple medication details
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    
    // Left column
    pdf.text(`Dosage: ${prescription.dosage}`, 25, 100)
    pdf.text(`Frequency: ${prescription.frequency}`, 25, 108)
    pdf.text(`Duration: ${prescription.duration || 'Not specified'}`, 25, 116)
    pdf.text(`Refills: ${prescription.refills}`, 25, 124)
    pdf.text(`Status: ${prescription.status}`, 25, 132)
    
    // Right column
    pdf.text(`Doctor: Dr. ${prescription.doctorName}`, 110, 100)
    pdf.text(`Specialization: ${prescription.doctorSpecialization}`, 110, 108)
    pdf.text(`Issued: ${new Date(prescription.issuedAt).toLocaleDateString()}`, 110, 116)
    
    // Prescription ID
    pdf.setFontSize(9)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`ID: ${prescription.id}`, 25, 145)
    
    let yPosition = 200
    
    // Simple instructions section
    if (prescription.instructions) {
      pdf.setTextColor(0, 0, 0)
      pdf.setDrawColor(251, 146, 60)
      pdf.rect(15, yPosition, 180, Math.max(25, pdf.splitTextToSize(prescription.instructions, 160).length * 5 + 15), 'S')
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Instructions:', 25, yPosition + 12)
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const instructions = pdf.splitTextToSize(prescription.instructions, 160)
      pdf.text(instructions, 25, yPosition + 20)
      yPosition += Math.max(30, instructions.length * 5 + 20)
    }
    
    // Simple footer
    pdf.setFillColor(251, 146, 60)
    pdf.rect(0, 285, 210, 12, 'F')
    pdf.setFontSize(8)
    pdf.setTextColor(255, 255, 255)
    pdf.text('MediTrack+ - Digital Health Platform', 105, 292, { align: 'center' })
    
    pdf.save(`MediTrack_${prescription.medicationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success(`${prescription.medicationName} prescription exported to PDF successfully`)
  }

  const handleRefillRequest = async (prescriptionId: string, medicationName: string) => {
    try {
      const response = await fetch('/api/prescriptions/refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prescriptionId, patientId: user?.id })
      })
      
      if (response.ok) {
        toast.success(`Refill request sent for ${medicationName}`)
      } else {
        toast.error('Failed to request refill')
      }
    } catch (error) {
      toast.error('Failed to request refill')
    }
  }

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />
      case 'completed': return <CheckCircle className="h-3 w-3" />
      case 'cancelled': return <XCircle className="h-3 w-3" />
      default: return <Timer className="h-3 w-3" />
    }
  }

  const ViewDetailsDialog = ({ prescription }: { prescription: any }) => {
    const [open, setOpen] = useState(false)
    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size={viewMode === 'grid' ? 'sm' : 'sm'}
            className={viewMode === 'grid' ? 'flex-1 text-xs' : ''}
          >
            <Eye className="h-3 w-3 mr-1" />
            {viewMode === 'grid' ? 'View' : 'View Details'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-background/95 border border-border/30 shadow-xl rounded-xl">
          <DialogHeader className="pb-6 border-b border-border/10">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                <Pill className="h-5 w-5" style={{ color: colorValues.primary }} />
              </div>
              <div>
                <div>{prescription.medicationName}</div>
                <div className="text-xs font-normal text-muted-foreground">
                  Prescription Details
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-6">
            {/* Medication Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Medication</div>
                <div className="text-foreground font-medium">{prescription.medicationName}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(prescription.status)}
                  <span className="capitalize font-medium">{prescription.status}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Dosage</div>
                <div className="text-foreground">{prescription.dosage}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Frequency</div>
                <div className="text-foreground">{prescription.frequency}</div>
              </div>
            </div>
            
            {prescription.duration && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Duration</div>
                <div className="text-foreground">{prescription.duration}</div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Refills Remaining</div>
                <div className={`font-medium ${
                  prescription.refills === 0 ? 'text-red-600' : 'text-foreground'
                }`}>
                  {prescription.refills}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Issued Date</div>
                <div className="text-foreground">{new Date(prescription.issuedAt).toLocaleDateString()}</div>
              </div>
            </div>
            
            {/* Doctor Info */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${colorValues.primary}08` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorValues.primary}15` }}>
                  <User className="h-5 w-5" style={{ color: colorValues.primary }} />
                </div>
                <div>
                  <div className="font-medium text-foreground">Dr. {prescription.doctorName}</div>
                  <div className="text-sm text-muted-foreground">{prescription.doctorSpecialization}</div>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            {prescription.instructions && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Special Instructions
                </div>
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: `${colorValues.primary}05` }}>
                  {prescription.instructions}
                </div>
              </div>
            )}
            
            {/* Prescription ID */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Prescription ID</div>
              <div className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
                {prescription.id}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const stats = [
    { label: 'Total Prescriptions', value: prescriptions.length.toString(), icon: Pill, color: 'text-blue-600' },
    { label: 'Active', value: prescriptions.filter(p => p.status === 'active').length.toString(), icon: CheckCircle, color: 'text-green-600' },
    { label: 'Need Refill', value: prescriptions.filter(p => p.refills === 0 && p.status === 'active').length.toString(), icon: RefreshCw, color: 'text-orange-600' },
    { label: 'Completed', value: prescriptions.filter(p => p.status === 'completed').length.toString(), icon: FileText, color: 'text-purple-600' }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 text-center">
              <div className="animate-pulse">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-5 w-5 bg-muted rounded"></div>
                  <div className="h-5 w-8 bg-muted rounded"></div>
                </div>
                <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg"></div>
                    <div>
                      <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                      <div className="h-4 bg-muted rounded w-40"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
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
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Prescriptions</h1>
            <p className="text-muted-foreground">Manage your medications and request refills</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportToPDF}
              disabled={filteredPrescriptions.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All to PDF
            </Button>
            <Badge variant="outline" className="text-sm">
              {prescriptions.length} Total
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-full">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{prescriptions.length}</span>
          </div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Prescriptions</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500 rounded-full">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{prescriptions.filter(p => p.status === 'active').length}</span>
          </div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-amber-500 rounded-full">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{prescriptions.filter(p => p.refills === 0 && p.status === 'active').length}</span>
          </div>
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Need Refill</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-full">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{prescriptions.filter(p => p.status === 'completed').length}</span>
          </div>
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completed</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search medications or doctors..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Prescriptions List */}
      <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {filteredPrescriptions.length === 0 ? (
          <Card className="p-12 text-center">
            <Pill className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No prescriptions found' : 'No prescriptions yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'No prescriptions match your search criteria.' 
                : 'Your prescriptions will appear here once prescribed by a doctor.'}
            </p>
          </Card>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className={`group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
              viewMode === 'grid' 
                ? 'p-6 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border-l-4 rounded-xl' 
                : 'p-6 hover:shadow-lg bg-gradient-to-r from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-800/30 border-l-4'
            }`} style={{ borderLeftColor: prescription.status === 'active' ? colorValues.primary : prescription.status === 'completed' ? '#3b82f6' : '#ef4444' }}>
              {/* Header */}
              {viewMode === 'grid' ? (
                <div className="space-y-4">
                  {/* Top Row: Icon and Status */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                         style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <Pill className="h-6 w-6" style={{ color: colorValues.primary }} />
                    </div>
                    <Badge variant={getStatusColor(prescription.status)} className="border flex items-center gap-1 px-2 py-1 text-xs">
                      {getStatusIcon(prescription.status)}
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </Badge>
                  </div>
                  
                  {/* Medication Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground leading-tight mb-1">
                      {prescription.medicationName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {prescription.dosage} • {prescription.frequency}
                    </p>
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Dr. {prescription.doctorName}</span>
                  </div>
                  
                  {/* Refills */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Refills:</span>
                    <span className={`font-medium ${
                      prescription.refills === 0 ? 'text-red-600' : 'text-foreground'
                    }`}>
                      {prescription.refills} left
                    </span>
                  </div>
                  
                  {/* Issue Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(prescription.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${colorValues.primary}15` }}>
                      <Pill className="h-6 w-6" style={{ color: colorValues.primary }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{prescription.medicationName}</h3>
                        <Badge variant={getStatusColor(prescription.status)} className="border flex items-center gap-1 px-2 py-1">
                          {getStatusIcon(prescription.status)}
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-lg text-muted-foreground mb-1">{prescription.dosage} • {prescription.frequency}</p>
                      {prescription.duration && (
                        <p className="text-sm text-muted-foreground mb-2">Duration: {prescription.duration}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <span className={`font-medium ${
                        prescription.refills === 0 ? 'text-red-600' : 'text-foreground'
                      }`}>
                        {prescription.refills} refills left
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Issued: {new Date(prescription.issuedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className={viewMode === 'grid' ? 'pt-4 border-t border-gray-200 dark:border-gray-700' : 'flex items-center justify-between pt-4 border-t border-border'}>
                {viewMode === 'list' && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Prescription ID: {prescription.id.slice(0, 8)}...</span>
                  </div>
                )}
                <div className={`flex gap-2 ${
                  viewMode === 'grid' ? 'w-full' : ''
                }`}>
                  {prescription.refills === 0 && prescription.status === 'active' && (
                    <Button 
                      variant="outline" 
                      size={viewMode === 'grid' ? 'sm' : 'sm'}
                      className={`text-orange-600 border-orange-600 hover:bg-orange-50 ${
                        viewMode === 'grid' ? 'flex-1 text-xs' : ''
                      }`}
                      onClick={() => handleRefillRequest(prescription.id, prescription.medicationName)}
                    >
                      <AlertTriangle className={`${viewMode === 'grid' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                      {viewMode === 'grid' ? 'Refill' : 'Request Refill'}
                    </Button>
                  )}
                  {prescription.refills > 0 && prescription.status === 'active' && (
                    <Button 
                      size={viewMode === 'grid' ? 'sm' : 'sm'} 
                      style={{ backgroundColor: colorValues.primary }} 
                      className={`text-white ${
                        viewMode === 'grid' ? 'flex-1 text-xs' : ''
                      }`}
                      onClick={() => handleRefillRequest(prescription.id, prescription.medicationName)}
                    >
                      <RefreshCw className={`${viewMode === 'grid' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                      {viewMode === 'grid' ? 'Refill' : 'Request Refill'}
                    </Button>
                  )}
                  <ViewDetailsDialog prescription={prescription} />
                  <Button 
                    variant="outline" 
                    size={viewMode === 'grid' ? 'sm' : 'sm'}
                    onClick={() => exportSinglePrescriptionToPDF(prescription)}
                    className={viewMode === 'grid' ? 'flex-1 text-xs' : ''}
                  >
                    <Download className={`${viewMode === 'grid' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                    {viewMode === 'grid' ? 'Export PDF' : 'Export to PDF'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
