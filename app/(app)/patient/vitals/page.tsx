'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Activity, Thermometer, Weight, Plus, TrendingUp, Calendar, Droplets, Gauge } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { AddVitalDialog } from '@/components/patient/dialogs'
import { useTheme } from '@/lib/theme-context'

export default function VitalsPage() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const [vitals, setVitals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const colorValues = getColorValues()
  
  const isDemoUser = user?.email?.includes('@meditrack.com') || sessionStorage.getItem('isDemoUser') === 'true'

  useEffect(() => {
    const fetchVitals = async () => {
      if (!user) return
      
      try {
        const response = await fetch(`/api/patient/data?userId=${user.id}&isDemoUser=${isDemoUser}`)
        const data = await response.json()
        setVitals(data.vitals || [])
      } catch (error) {
        console.error('Failed to fetch vitals:', error)
        setVitals([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVitals()
  }, [user, isDemoUser])

  const getVitalStatus = (type, value) => {
    switch (type) {
      case 'bp':
        if (!value.systolic || !value.diastolic) return { status: 'unknown', color: 'text-gray-500' }
        if (value.systolic > 140 || value.diastolic > 90) return { status: 'high', color: 'text-red-600' }
        if (value.systolic < 90 || value.diastolic < 60) return { status: 'low', color: 'text-blue-600' }
        return { status: 'normal', color: 'text-green-600' }
      case 'hr':
        if (!value) return { status: 'unknown', color: 'text-gray-500' }
        if (value > 100) return { status: 'high', color: 'text-red-600' }
        if (value < 60) return { status: 'low', color: 'text-blue-600' }
        return { status: 'normal', color: 'text-green-600' }
      case 'temp':
        if (!value) return { status: 'unknown', color: 'text-gray-500' }
        if (value > 37.5) return { status: 'high', color: 'text-red-600' }
        if (value < 36) return { status: 'low', color: 'text-blue-600' }
        return { status: 'normal', color: 'text-green-600' }
      default:
        return { status: 'normal', color: 'text-green-600' }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </Card>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const latestVital = vitals[0]
  const stats = [
    { 
      label: 'Total Records', 
      value: vitals.length.toString(), 
      icon: Activity, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      label: 'This Month', 
      value: vitals.filter(v => new Date(v.recorded_at).getMonth() === new Date().getMonth()).length.toString(), 
      icon: Calendar, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      label: 'Last Reading', 
      value: latestVital ? new Date(latestVital.recorded_at).toLocaleDateString() : 'None', 
      icon: TrendingUp, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Vital Signs</h1>
            <p className="text-muted-foreground">Monitor and track your health measurements</p>
          </div>
          <AddVitalDialog>
            <Button 
              size="lg"
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-5 w-5 mr-2" />
              Log New Vitals
            </Button>
          </AddVitalDialog>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {vitals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Activity className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">No vital signs recorded</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start monitoring your health by recording your first vital signs measurement
          </p>
          <AddVitalDialog>
            <Button 
              size="lg"
              style={{ backgroundColor: colorValues.primary }} 
              className="text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Record First Measurement
            </Button>
          </AddVitalDialog>
        </Card>
      ) : (
        <>
          {/* Latest Vitals Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Blood Pressure</p>
                  <p className="text-2xl font-bold text-foreground">
                    {latestVital?.blood_pressure_systolic && latestVital?.blood_pressure_diastolic 
                      ? `${latestVital.blood_pressure_systolic}/${latestVital.blood_pressure_diastolic}` 
                      : '--/--'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        getVitalStatus('bp', {
                          systolic: latestVital?.blood_pressure_systolic,
                          diastolic: latestVital?.blood_pressure_diastolic
                        }).color
                      }`}
                    >
                      {getVitalStatus('bp', {
                        systolic: latestVital?.blood_pressure_systolic,
                        diastolic: latestVital?.blood_pressure_diastolic
                      }).status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Heart Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {latestVital?.heart_rate || '--'}
                    {latestVital?.heart_rate && <span className="text-sm font-normal ml-1">bpm</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getVitalStatus('hr', latestVital?.heart_rate).color}`}
                    >
                      {getVitalStatus('hr', latestVital?.heart_rate).status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  <Thermometer className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Temperature</p>
                  <p className="text-2xl font-bold text-foreground">
                    {latestVital?.temperature || '--'}
                    {latestVital?.temperature && <span className="text-sm font-normal ml-1">°C</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getVitalStatus('temp', latestVital?.temperature).color}`}
                    >
                      {getVitalStatus('temp', latestVital?.temperature).status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20">
                  <Weight className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Weight</p>
                  <p className="text-2xl font-bold text-foreground">
                    {latestVital?.weight || '--'}
                    {latestVital?.weight && <span className="text-sm font-normal ml-1">kg</span>}
                  </p>
                  {latestVital?.bmi && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs text-purple-600">
                        BMI: {latestVital.bmi}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Measurements */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Recent Measurements</h3>
              <Badge variant="outline" className="text-sm">
                {vitals.length} Total Records
              </Badge>
            </div>
            <div className="space-y-4">
              {vitals.slice(0, 10).map((vital, index) => (
                <div key={vital.id} className="group p-5 border border-border rounded-xl hover:shadow-md transition-all duration-200 hover:border-primary/30">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <Heart className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Blood Pressure</p>
                          <p className="text-lg font-semibold text-foreground">
                            {vital.blood_pressure_systolic && vital.blood_pressure_diastolic 
                              ? `${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}` 
                              : '--/--'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                          <Activity className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Heart Rate</p>
                          <p className="text-lg font-semibold text-foreground">
                            {vital.heart_rate || '--'}
                            {vital.heart_rate && <span className="text-sm font-normal ml-1">bpm</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <Thermometer className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Temperature</p>
                          <p className="text-lg font-semibold text-foreground">
                            {vital.temperature || '--'}
                            {vital.temperature && <span className="text-sm font-normal ml-1">°C</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                          <Weight className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weight</p>
                          <p className="text-lg font-semibold text-foreground">
                            {vital.weight || '--'}
                            {vital.weight && <span className="text-sm font-normal ml-1">kg</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          {new Date(vital.recorded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(vital.recorded_at).toLocaleTimeString()}
                      </p>
                      {index === 0 && (
                        <Badge className="mt-2 text-xs" style={{ backgroundColor: `${colorValues.primary}15`, color: colorValues.primary }}>
                          Latest
                        </Badge>
                      )}
                    </div>
                  </div>
                  {vital.notes && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {vital.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {vitals.length > 10 && (
              <div className="text-center mt-6">
                <Button variant="outline" size="sm">
                  View All {vitals.length} Records
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}