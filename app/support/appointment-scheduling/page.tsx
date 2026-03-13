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
  Search, Archive, AlertTriangle, TrendingUp, PieChart, LifeBuoy, Play,
  Check, ExternalLink, Mail, Send, Headphones, MessageCircle
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function AppointmentSchedulingPage() {
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

  const articles = [
    {
      title: 'Setting Up Appointment Types',
      desc: 'Configure different appointment types, durations, and required resources.',
      readTime: '6 min read',
      difficulty: 'Beginner'
    },
    {
      title: 'Calendar Management Basics',
      desc: 'Learn to navigate and manage your practice calendar effectively.',
      readTime: '5 min read',
      difficulty: 'Beginner'
    },
    {
      title: 'Booking Appointments Online',
      desc: 'Guide for patients to book appointments through the patient portal.',
      readTime: '4 min read',
      difficulty: 'Beginner'
    },
    {
      title: 'Managing Provider Schedules',
      desc: 'Set up and modify individual provider availability and working hours.',
      readTime: '8 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Appointment Reminders Setup',
      desc: 'Configure automated SMS and email reminders for appointments.',
      readTime: '5 min read',
      difficulty: 'Beginner'
    },
    {
      title: 'Handling Cancellations & Rescheduling',
      desc: 'Process for managing appointment cancellations and rescheduling requests.',
      readTime: '6 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Waitlist Management',
      desc: 'Set up and manage patient waitlists for popular appointment slots.',
      readTime: '7 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Recurring Appointments',
      desc: 'Schedule and manage recurring appointments for ongoing treatments.',
      readTime: '5 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Calendar Sync with External Systems',
      desc: 'Integrate MediTrack+ calendar with Google Calendar and Outlook.',
      readTime: '9 min read',
      difficulty: 'Advanced'
    },
    {
      title: 'Appointment Templates',
      desc: 'Create reusable appointment templates for common procedures.',
      readTime: '6 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Managing No-Shows',
      desc: 'Strategies and tools for reducing and handling appointment no-shows.',
      readTime: '7 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Group Appointments',
      desc: 'Schedule and manage appointments for multiple patients simultaneously.',
      readTime: '8 min read',
      difficulty: 'Advanced'
    },
    {
      title: 'Emergency Appointment Slots',
      desc: 'Reserve and manage emergency appointment availability.',
      readTime: '5 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Appointment Analytics',
      desc: 'Track and analyze appointment scheduling patterns and performance.',
      readTime: '10 min read',
      difficulty: 'Advanced'
    },
    {
      title: 'Patient Communication Templates',
      desc: 'Create standardized messages for appointment confirmations and updates.',
      readTime: '6 min read',
      difficulty: 'Beginner'
    },
    {
      title: 'Telemedicine Appointments',
      desc: 'Set up and manage virtual appointments with video conferencing.',
      readTime: '8 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Appointment Rules & Policies',
      desc: 'Configure practice policies for appointment booking and cancellation.',
      readTime: '7 min read',
      difficulty: 'Intermediate'
    },
    {
      title: 'Calendar Sharing & Permissions',
      desc: 'Control who can view and edit calendar information in your practice.',
      readTime: '6 min read',
      difficulty: 'Intermediate'
    }
  ]

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
            <Link href="/">
              <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses.primary} rounded-lg flex items-center justify-center`}>
                <Heart className="w-6 h-6 text-white" />
              </div>
            </Link>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              MediTrack+
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/support/help-center" className="text-muted-foreground hover:text-orange-400 transition-colors">
              Help Center
            </Link>
            <Link href="/support/documentation" className="text-muted-foreground hover:text-orange-400 transition-colors">
              Documentation
            </Link>
            <Link href="/support/contact-support" className="text-muted-foreground hover:text-orange-400 transition-colors">
              Contact Support
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="px-4 py-4 space-y-4">
              <Link href="/support/help-center" className="block text-muted-foreground hover:text-orange-400 transition-colors">
                Help Center
              </Link>
              <Link href="/support/documentation" className="block text-muted-foreground hover:text-orange-400 transition-colors">
                Documentation
              </Link>
              <Link href="/support/contact-support" className="block text-muted-foreground hover:text-orange-400 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-6">
            <Calendar className="w-4 h-4 inline mr-2" />
            Appointment Scheduling
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Master <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Scheduling
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Master the scheduling system, manage appointments, and handle cancellations. Learn to optimize your practice calendar for maximum efficiency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
              <Calendar className="mr-2 w-5 h-5" />
              Schedule Demo
            </Button>
            <Link href="/support/help-center">
              <Button variant="outline" className="text-lg px-8 py-4">
                <BookOpen className="mr-2 w-5 h-5" />
                Browse All Topics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Scheduling <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Guides</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides to help you master appointment scheduling and calendar management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-colors">
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    article.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    article.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {article.difficulty}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">{article.title}</h3>
              <p className="text-muted-foreground mb-4">{article.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-400 font-medium">{article.readTime}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
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