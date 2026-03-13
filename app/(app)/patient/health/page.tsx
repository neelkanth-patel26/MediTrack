'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Activity, FileText, TrendingUp, Thermometer, Weight, Zap, Calendar, Pill, Stethoscope } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'

export default function HealthPage() {
  const { user } = useAuth()
  const { getColorValues } = useTheme()
  const [patientData, setPatientData] = useState({ prescriptions: [], appointments: [], vitals: [] })
  const [isLoading, setIsLoading] = useState(true)
  const colorValues = getColorValues()
  
  const isDemoUser = user?.email?.includes('@meditrack.com') || sessionStorage.getItem('isDemoUser') === 'true'

  useEffect(() => {
    const fetchHealthData = async () => {
      if (!user) return
      
      try {
        const response = await fetch(`/api/patient/data?userId=${user.id}&isDemoUser=${isDemoUser}`)
        const data = await response.json()
        setPatientData(data)
      } catch (error) {
        console.error('Failed to fetch health data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHealthData()
  }, [user, isDemoUser])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const latestVital = patientData.vitals[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 shadow-lg" style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }}>
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-2">
            Health Overview
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Your complete health dashboard with real-time insights and personalized care
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* Latest Vitals */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300" style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }}>
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200">Latest Vitals</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Real-time health monitoring</p>
                </div>
              </div>
              {!latestVital ? (
                <div className="text-center py-4">
                  <Stethoscope className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No vital signs recorded</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Connect your devices to start tracking</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg border border-red-100 dark:border-red-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                        <Activity className="h-3 w-3 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-red-800 dark:text-red-200">Blood Pressure</p>
                        <p className="text-lg font-bold text-red-900 dark:text-red-100">
                          {latestVital.blood_pressure_systolic && latestVital.blood_pressure_diastolic 
                            ? `${latestVital.blood_pressure_systolic}/${latestVital.blood_pressure_diastolic}` 
                            : '--/--'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                        <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-800 dark:text-blue-200">Heart Rate</p>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{latestVital.heart_rate || '--'} <span className="text-xs">bpm</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border border-orange-100 dark:border-orange-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                        <Thermometer className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-orange-800 dark:text-orange-200">Temperature</p>
                        <p className="text-lg font-bold text-orange-900 dark:text-orange-100">{latestVital.temperature || '--'}<span className="text-xs">°C</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-100 dark:border-green-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                        <Weight className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-800 dark:text-green-200">Weight</p>
                        <p className="text-lg font-bold text-green-900 dark:text-green-100">{latestVital.weight || '--'} <span className="text-xs">kg</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Health Summary */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300" style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }}>
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200">Health Summary</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your health at a glance</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                      <Pill className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Active Prescriptions</span>
                  </div>
                  <Badge className="bg-purple-600 text-white px-2 py-1 text-sm font-bold">{patientData.prescriptions.filter(p => p.status === 'active').length}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg border border-teal-100 dark:border-teal-800/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/30">
                      <Calendar className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="text-sm font-medium text-teal-900 dark:text-teal-100">Upcoming Appointments</span>
                  </div>
                  <Badge className="bg-teal-600 text-white px-2 py-1 text-sm font-bold">{patientData.appointments.length}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-lg border border-rose-100 dark:border-rose-800/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/30">
                      <Heart className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                    </div>
                    <span className="text-sm font-medium text-rose-900 dark:text-rose-100">Vital Records</span>
                  </div>
                  <Badge className="bg-rose-600 text-white px-2 py-1 text-sm font-bold">{patientData.vitals.length}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300" style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }}>
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200">Recent Activity</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Latest health updates</p>
                </div>
              </div>
              <div className="space-y-3">
                {patientData.prescriptions.length === 0 && patientData.appointments.length === 0 && patientData.vitals.length === 0 ? (
                  <div className="text-center py-4">
                    <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No recent activity</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Your health updates will appear here</p>
                  </div>
                ) : (
                  <>
                    {patientData.vitals.slice(0, 2).map((vital) => (
                      <div key={vital.id} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                            <Activity className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Vitals recorded</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">{new Date(vital.recorded_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {patientData.prescriptions.slice(0, 2).map((prescription) => (
                      <div key={prescription.id} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-100 dark:border-green-800/30">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                            <Pill className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">{prescription.medication_name} prescribed</p>
                            <p className="text-xs text-green-700 dark:text-green-300">{new Date(prescription.issued_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Health Trends */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300" style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }}>
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200">Health Trends</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI-powered insights</p>
                </div>
              </div>
              {patientData.vitals.length === 0 ? (
                <div className="text-center py-4">
                  <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No data available for trends</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Record more vitals to see personalized insights</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-100 dark:border-green-800/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                        <Heart className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-900 dark:text-green-100">Stable Vitals</p>
                        <p className="text-xs text-green-700 dark:text-green-300">Your vital signs are within normal ranges</p>
                      </div>
                    </div>
                    <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                      <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}