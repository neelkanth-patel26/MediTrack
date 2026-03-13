'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileText, Eye, Search, Download, Calendar, Activity, TrendingUp, AlertCircle, Clock, Filter, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ViewDetailsDialog, LabReportDetailsDialog } from '@/components/doctor/dialogs'
import { UploadReportDialog } from '@/components/doctor/upload-dialog'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'

export default function DoctorReports() {
  const [searchTerm, setSearchTerm] = useState('')
  const [labReports, setLabReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    status: 'all',
    reportType: 'all',
    priority: 'all',
    dateRange: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [doctorStats, setDoctorStats] = useState({ 
    totalPatients: 0, 
    totalAppointments: 0, 
    completedAppointments: 0,
    totalRevenue: 0,
    doctorEarnings: 0,
    adminCut: 0,
    consultationFee: 0
  })
  const { getColorValues } = useTheme()
  const { user } = useAuth()
  const colorValues = getColorValues()

  useEffect(() => {
    if (user?.id) {
      fetchLabReports()
      fetchDoctorStats()
    }
  }, [user?.id])

  const fetchLabReports = async () => {
    try {
      const response = await fetch(`/api/doctor/lab-reports?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setLabReports(data.labReports)
      }
    } catch (error) {
      console.error('Error fetching lab reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctorStats = async () => {
    try {
      const response = await fetch(`/api/doctor/stats?doctorId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setDoctorStats(data)
      }
    } catch (error) {
      console.error('Error fetching doctor stats:', error)
    }
  }

  const updateReportStatus = async (reportId: string, status: string) => {
    try {
      const response = await fetch('/api/doctor/lab-reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status })
      })
      if (response.ok) {
        fetchLabReports()
      }
    } catch (error) {
      console.error('Error updating report:', error)
    }
  }

  const filteredReports = labReports.filter(report => {
    const matchesSearch = report.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportType?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filters.status === 'all' || report.status === filters.status
    const matchesType = filters.reportType === 'all' || report.reportType?.toLowerCase().includes(filters.reportType.toLowerCase())
    const matchesPriority = filters.priority === 'all' || 
      (filters.priority === 'critical' && report.abnormalFlags) ||
      (filters.priority === 'normal' && !report.abnormalFlags)
    
    let matchesDate = true
    if (filters.dateRange !== 'all') {
      const reportDate = new Date(report.testDate || report.createdAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (filters.dateRange) {
        case 'today': matchesDate = daysDiff === 0; break
        case 'week': matchesDate = daysDiff <= 7; break
        case 'month': matchesDate = daysDiff <= 30; break
        case '3months': matchesDate = daysDiff <= 90; break
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesDate
  })

  const clearFilters = () => {
    setFilters({ status: 'all', reportType: 'all', priority: 'all', dateRange: 'all' })
    setSearchTerm('')
  }

  const hasActiveFilters = filters.status !== 'all' || filters.reportType !== 'all' || 
    filters.priority !== 'all' || filters.dateRange !== 'all' || searchTerm !== ''

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reviewed': return 'default'
      case 'pending': return 'secondary'
      case 'completed': return 'outline'
      default: return 'default'
    }
  }

  const getPriorityColor = (abnormalFlags: string) => {
    if (!abnormalFlags) return 'text-green-600'
    if (abnormalFlags.toLowerCase().includes('critical')) return 'text-red-600'
    if (abnormalFlags.toLowerCase().includes('high') || abnormalFlags.toLowerCase().includes('low')) return 'text-orange-600'
    return 'text-green-600'
  }

  const getCategoryIcon = (reportType: string) => {
    if (reportType?.toLowerCase().includes('blood')) return <Activity className="h-4 w-4" style={{ color: colorValues.primary }} />
    if (reportType?.toLowerCase().includes('imaging') || reportType?.toLowerCase().includes('scan') || reportType?.toLowerCase().includes('ray')) return <FileText className="h-4 w-4" style={{ color: colorValues.primary }} />
    if (reportType?.toLowerCase().includes('cardiac') || reportType?.toLowerCase().includes('echo')) return <TrendingUp className="h-4 w-4" style={{ color: colorValues.primary }} />
    return <FileText className="h-4 w-4" style={{ color: colorValues.primary }} />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </Card>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-20 bg-muted rounded"></div>
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
            <h1 className="text-3xl font-bold text-foreground">Lab Reports</h1>
            <p className="text-muted-foreground">Review and manage patient lab results</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{labReports.filter(r => r.abnormalFlags).length}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{labReports.filter(r => r.status === 'pending').length}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{labReports.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
            <UploadReportDialog onSuccess={fetchLabReports}>
              <Button 
                size="lg"
                className="gap-2 text-white font-medium"
                style={{ backgroundColor: colorValues.primary }}
              >
                <Upload className="h-4 w-4" />
                Upload Report
              </Button>
            </UploadReportDialog>
          </div>
        </div>
      </Card>

      {/* Search and Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by patient name, test type, or lab..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">Filter Reports</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Report Type</label>
                  <Select value={filters.reportType} onValueChange={(value) => setFilters(prev => ({ ...prev, reportType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="blood">Blood Tests</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="cardiac">Cardiac</SelectItem>
                      <SelectItem value="urine">Urine Tests</SelectItem>
                      <SelectItem value="pathology">Pathology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Reports Grid/List */}
      {filteredReports.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
          {filteredReports.map((report) => (
            viewMode === 'grid' ? (
              /* Grid Cards */
              <Card key={report.id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted">
                      {getCategoryIcon(report.reportType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{report.testName}</h3>
                      <p className="text-sm text-muted-foreground">{report.patientName}</p>
                      <p className="text-xs text-muted-foreground">{report.patientId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusColor(report.status)} className="text-xs">
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                    {report.abnormalFlags && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Critical
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-2 font-medium">{report.reportType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <span className="ml-2 font-medium">{report.testDate || new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    {report.labName && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Lab:</span>
                        <span className="ml-2 font-medium">{report.labName}</span>
                      </div>
                    )}
                    {report.technicianName && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Technician:</span>
                        <span className="ml-2 font-medium">{report.technicianName}</span>
                      </div>
                    )}
                    {report.testResults && typeof report.testResults === 'object' && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Results:</span>
                        <span className="ml-2 font-medium">{Object.keys(report.testResults).length} tests</span>
                      </div>
                    )}
                  </div>
                  
                  {(report.testResults?.summary || report.resultsSummary) && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Summary</div>
                      <p className="text-sm text-foreground">
                        {(report.testResults?.summary || report.resultsSummary)?.slice(0, 120)}...
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <LabReportDetailsDialog report={report}>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </LabReportDetailsDialog>
                  {report.reportUrl && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = report.reportUrl
                        link.download = `${report.testName}-${report.patientName}.${report.reportUrl.split('.').pop()}`
                        link.target = '_blank'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {report.status === 'pending' && (
                    <Button 
                      size="sm" 
                      style={{ backgroundColor: colorValues.primary }}
                      className="text-white"
                      onClick={() => updateReportStatus(report.id, 'reviewed')}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              /* List View */
              <Card key={report.id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted flex-shrink-0">
                    {getCategoryIcon(report.reportType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{report.testName}</h3>
                        <p className="text-sm text-muted-foreground">{report.patientName} • {report.patientId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(report.status)} className="text-xs">
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                        {report.abnormalFlags && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Critical
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2 font-medium">{report.reportType}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <span className="ml-2 font-medium">{report.testDate || new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Lab:</span>
                        <span className="ml-2 font-medium">{report.labName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tests:</span>
                        <span className="ml-2 font-medium">
                          {report.testResults && typeof report.testResults === 'object' 
                            ? `${Object.keys(report.testResults).length} results`
                            : 'Available'
                          }
                        </span>
                      </div>
                      {report.technicianName && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Technician:</span>
                          <span className="ml-2 font-medium">{report.technicianName}</span>
                        </div>
                      )}
                      {report.referenceRanges && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Reference Ranges:</span>
                          <span className="ml-2 font-medium">Available</span>
                        </div>
                      )}
                    </div>
                    
                    {(report.testResults?.summary || report.resultsSummary) && (
                      <div className="p-3 bg-muted rounded-lg mb-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Summary</div>
                        <p className="text-sm text-foreground">
                          {(report.testResults?.summary || report.resultsSummary)?.slice(0, 200)}...
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <LabReportDetailsDialog report={report}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </LabReportDetailsDialog>
                    {report.reportUrl && (
                      <Button size="sm" variant="outline" onClick={() => {
                        const link = document.createElement('a')
                        link.href = report.reportUrl
                        link.download = `${report.testName}-${report.patientName}.${report.reportUrl.split('.').pop()}`
                        link.target = '_blank'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {report.status === 'pending' && (
                      <Button 
                        size="sm" 
                        style={{ backgroundColor: colorValues.primary }}
                        className="text-white"
                        onClick={() => updateReportStatus(report.id, 'reviewed')}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? 'No reports found' : 'No lab reports yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? 'No reports match your search criteria.' : 'Upload your first lab report to get started.'}
          </p>
          <UploadReportDialog onSuccess={fetchLabReports}>
            <Button 
              className="text-white"
              style={{ backgroundColor: colorValues.primary }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Report
            </Button>
          </UploadReportDialog>
        </Card>
      )}
    </div>
  )
}
