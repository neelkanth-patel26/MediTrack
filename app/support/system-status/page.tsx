'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Menu, X, Heart, Users, Star, CheckCircle2,
  ArrowRight, MessageSquare, Download, Sparkles,
  Zap, Cloud, Lock, Code, Infinity, Activity, Pill, Stethoscope,
  Video, Bot, ChevronDown, ChevronUp, Facebook, Twitter, Linkedin, Instagram,
  Monitor, Database, Cpu, Palette, Rocket, Hospital, HelpCircle, Phone,
  User, Calendar, FileText, Pill as PillIcon, BarChart3, Shield, BookOpen,
  Settings, AlertCircle, Globe, Briefcase, Microscope, Clock, Smartphone,
  Search, Archive, AlertTriangle, TrendingUp, PieChart, LifeBuoy, Code2,
  FileCode, Terminal, Database as DatabaseIcon, Key, Webhook, Layers,
  Play, Copy, Check, ExternalLink, Mail, Send, Headphones, MessageCircle,
  Activity as ActivityIcon, CheckCircle, XCircle, AlertTriangle as AlertIcon,
  Clock as ClockIcon, Server, Wifi, Globe as GlobeIcon
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function SystemStatusPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { color, isDarkMode } = useTheme()

  const getColorClasses = () => {
    const classes = {
      primary: 'from-orange-500 to-orange-600',
      primaryHover: 'hover:from-orange-600 hover:to-orange-700',
      primaryLight: 'bg-orange-500/20',
      primaryText: 'text-orange-400',
      primaryBorder: 'border-orange-500/50'
    }
    return classes
  }

  const colorClasses = getColorClasses()

  const systemStatus = {
    overall: 'operational',
    lastUpdated: '2024-01-15 14:30 UTC',
    uptime: '99.9%'
  }

  const services = [
    {
      name: 'Web Application',
      status: 'operational',
      uptime: '99.98%',
      lastIncident: 'None in 45 days'
    },
    {
      name: 'API Services',
      status: 'operational',
      uptime: '99.95%',
      lastIncident: 'None in 30 days'
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.99%',
      lastIncident: 'None in 60 days'
    },
    {
      name: 'File Storage',
      status: 'operational',
      uptime: '99.97%',
      lastIncident: 'None in 20 days'
    },
    {
      name: 'Email Services',
      status: 'operational',
      uptime: '99.92%',
      lastIncident: 'None in 15 days'
    },
    {
      name: 'Mobile App',
      status: 'operational',
      uptime: '99.94%',
      lastIncident: 'None in 25 days'
    },
    {
      name: 'Analytics Engine',
      status: 'operational',
      uptime: '99.96%',
      lastIncident: 'None in 35 days'
    },
    {
      name: 'Backup Systems',
      status: 'operational',
      uptime: '100%',
      lastIncident: 'None in 90 days'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400'
      case 'degraded':
        return 'text-yellow-400'
      case 'outage':
        return 'text-red-400'
      default:
        return 'text-green-400'
    }
  }

  return (
    <div className={`${isDarkMode ? 'bg-background text-foreground' : 'bg-background text-foreground'} overflow-x-hidden min-h-screen`}>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Sticky Glassmorphism Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-lg ${isDarkMode ? 'bg-background/50 border-b border-border' : 'bg-background/50 border-b border-border'}`}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses.primary} rounded-lg flex items-center justify-center`}>
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              MediTrack+
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center text-lg">
            <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <Link href="/services" className="hover:text-orange-400 transition-colors">Services</Link>
            <Link href="/support" className="hover:text-orange-400 transition-colors">Support</Link>
            <Link href="/company" className="hover:text-orange-400 transition-colors">Company</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className={`${isDarkMode ? 'text-foreground hover:bg-accent' : 'text-foreground hover:bg-accent'} text-lg`}>
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-6 py-3`}>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${isDarkMode ? 'bg-background/80' : 'bg-background/80'} backdrop-blur-md border-t border-border p-4 space-y-3`}>
            <Link href="/" className="block hover:text-orange-400 text-lg">Home</Link>
            <Link href="/services" className="block hover:text-orange-400 text-lg">Services</Link>
            <Link href="/support" className="block hover:text-orange-400 text-lg">Support</Link>
            <Link href="/company" className="block hover:text-orange-400 text-lg">Company</Link>
            <div className="flex gap-2 pt-4">
              <Link href="/auth/login" className="flex-1">
                <Button variant="ghost" className={`w-full ${isDarkMode ? 'text-foreground' : 'text-foreground'} text-lg`}>Login</Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button className={`w-full bg-gradient-to-r ${colorClasses.primary} text-lg`}>Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-6">
            <ActivityIcon className="w-4 h-4 inline mr-2" />
            System Status
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            System <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Status
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Real-time monitoring of MediTrack+ services and infrastructure. Stay informed about system health and planned maintenance.
          </p>

          {/* Overall Status */}
          <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto mb-8`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-green-400">All Systems Operational</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Last updated:</span>
                <span>{systemStatus.lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span>Overall uptime:</span>
                <span className="text-green-400 font-medium">{systemStatus.uptime}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <GlobeIcon className="mr-2 w-5 h-5" />
              Subscribe to Updates
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <ClockIcon className="mr-2 w-5 h-5" />
              Maintenance Schedule
            </Button>
            <Link href="/support/contact-support">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
                <AlertIcon className="mr-2 w-5 h-5" />
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Status Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Service <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Status</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Detailed status information for all MediTrack+ services and components.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{service.name}</h3>
                {getStatusIcon(service.status)}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium capitalize ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Uptime (30 days):</span>
                  <span className="text-green-400 font-medium">{service.uptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last incident:</span>
                  <span className="text-muted-foreground text-sm">{service.lastIncident}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incident History */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Incident <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">History</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Past incidents and maintenance windows. All systems are currently operating normally.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-8`}>
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Active Incidents</h3>
                <p className="text-muted-foreground">
                  All MediTrack+ services are operating normally. Check back here for real-time updates.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                For the latest updates, follow us on social media or subscribe to our status page.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="text-lg px-8 py-4">
                  <Mail className="mr-2 w-5 h-5" />
                  Email Notifications
                </Button>
                <Button variant="outline" className="text-lg px-8 py-4">
                  <GlobeIcon className="mr-2 w-5 h-5" />
                  RSS Feed
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-card/80 border-t border-border' : 'bg-card/80 border-t border-border'} backdrop-blur-sm mt-20`}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MediTrack+</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Revolutionizing healthcare management with cutting-edge technology and compassionate care.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-orange-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/services/patient-management" className="hover:text-orange-400 transition-colors">Patient Management</Link></li>
                <li><Link href="/services/doctor-portal" className="hover:text-orange-400 transition-colors">Doctor Portal</Link></li>
                <li><Link href="/services/appointment-scheduling" className="hover:text-orange-400 transition-colors">Appointment Scheduling</Link></li>
                <li><Link href="/services/medical-records" className="hover:text-orange-400 transition-colors">Medical Records</Link></li>
                <li><Link href="/services/prescription-management" className="hover:text-orange-400 transition-colors">Prescription Management</Link></li>
                <li><Link href="/services/health-analytics" className="hover:text-orange-400 transition-colors">Health Analytics</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/support/help-center" className="hover:text-orange-400 transition-colors">Help Center</Link></li>
                <li><Link href="/support/documentation" className="hover:text-orange-400 transition-colors">Documentation</Link></li>
                <li><Link href="/support/api-reference" className="hover:text-orange-400 transition-colors">API Reference</Link></li>
                <li><Link href="/support/contact-support" className="hover:text-orange-400 transition-colors">Contact Support</Link></li>
                <li><Link href="/support/system-status" className="hover:text-orange-400 transition-colors">System Status</Link></li>
                <li><Link href="/support/security" className="hover:text-orange-400 transition-colors">Security</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/company/about-us" className="hover:text-orange-400 transition-colors">About Us</Link></li>
                <li><Link href="/company/careers" className="hover:text-orange-400 transition-colors">Careers</Link></li>
                <li><Link href="/company/press" className="hover:text-orange-400 transition-colors">Press</Link></li>
                <li><Link href="/company/blog" className="hover:text-orange-400 transition-colors">Blog</Link></li>
                <li><Link href="/company/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/company/terms-of-service" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 MediTrack+. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="/company/meet-our-team" className="text-sm text-muted-foreground hover:text-orange-400 transition-colors">
                Meet Our Team
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/company/privacy-policy" className="text-sm text-muted-foreground hover:text-orange-400 transition-colors">
                Privacy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/company/terms-of-service" className="text-sm text-muted-foreground hover:text-orange-400 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}