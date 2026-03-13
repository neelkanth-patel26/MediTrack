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
  Settings, AlertCircle, Globe
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function PatientManagementPage() {
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

  return (
    <div className={`${isDarkMode ? 'bg-background text-foreground' : 'bg-background text-foreground'} overflow-x-hidden min-h-screen`}>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Animated Glassmorphism Navbar */}
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-2xl ${isDarkMode ? 'bg-background/20 border border-border/30' : 'bg-background/20 border border-border/30'} rounded-2xl shadow-2xl shadow-black/10 hover:shadow-black/20 transition-all duration-500 ease-out mx-4 max-w-screen-2xl w-[calc(100%-2rem)] animate-fade-in-down`}>
        {/* Floating Background Effects */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 via-transparent to-orange-600/5 animate-gradient-x"></div>
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 blur opacity-50 animate-pulse"></div>

        <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex justify-between items-center">
          {/* Enhanced Logo Section with Floating Animation */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses.primary} rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30 group-hover:shadow-orange-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out animate-float`}>
              <Heart className="w-8 h-8 text-white group-hover:animate-bounce drop-shadow-lg" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:via-orange-600 group-hover:to-orange-700 transition-all duration-500 drop-shadow-sm animate-gradient">
              MediTrack+
            </span>
          </div>

          {/* Desktop Menu with Enhanced Floating Effects */}
          <div className="hidden md:flex gap-8 items-center text-lg">
            <Link href="/" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-orange-500/10">
              <span className="relative z-10">Home</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-8 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-300"></div>
            </Link>
            <Link href="/services" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-orange-500/10">
              <span className="relative z-10">Services</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-8 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-300"></div>
            </Link>
            <Link href="/support" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-orange-500/10">
              <span className="relative z-10">Support</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-8 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-300"></div>
            </Link>
            <Link href="/company" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-orange-500/10">
              <span className="relative z-10">Company</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-8 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-300"></div>
            </Link>
          </div>

          {/* Enhanced Floating Auth Buttons */}
          <div className="hidden md:flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className={`${isDarkMode ? 'text-foreground hover:bg-accent/80 hover:text-orange-400 hover:shadow-lg hover:shadow-orange-500/20' : 'text-foreground hover:bg-accent/80 hover:text-orange-400 hover:shadow-lg hover:shadow-orange-500/20'} text-lg px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm`}>
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-6 py-2.5 rounded-xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 font-semibold group relative overflow-hidden`}>
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>

          {/* Enhanced Floating Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-xl hover:bg-accent/80 transition-all duration-300 hover:scale-110 hover:rotate-180 backdrop-blur-sm shadow-lg hover:shadow-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute inset-0 transition-all duration-500 ${mobileMenuOpen ? 'rotate-180 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'}`}>
                <Menu className="w-6 h-6 drop-shadow-sm" />
              </span>
              <span className={`absolute inset-0 transition-all duration-500 ${mobileMenuOpen ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-75'}`}>
                <X className="w-6 h-6 drop-shadow-sm" />
              </span>
            </div>
          </button>
        </div>

        {/* Enhanced Floating Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-700 ease-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className={`${isDarkMode ? 'bg-background/90' : 'bg-background/90'} backdrop-blur-2xl border-t border-border/30 p-6 space-y-4 shadow-2xl rounded-b-2xl`}>
            <Link href="/" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/services" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/support" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Support
            </Link>
            <Link href="/company" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Company
            </Link>
            <div className="flex gap-3 pt-4 border-t border-border/30">
              <Link href="/auth/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className={`w-full ${isDarkMode ? 'text-foreground hover:bg-accent/80 hover:shadow-lg' : 'text-foreground hover:bg-accent/80 hover:shadow-lg'} text-lg py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm`}>
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button className={`w-full bg-gradient-to-r ${colorClasses.primary} text-lg py-3 rounded-xl shadow-xl hover:shadow-orange-500/50 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 font-semibold group relative overflow-hidden`}>
                  <span className="relative z-10 flex items-center justify-center">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for floating header */}
      <div className="h-28"></div>

      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-6">
            <Users className="w-4 h-4 inline mr-2" />
            Patient Management
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Comprehensive <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Patient Care
            </span> Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Streamline patient intake, manage records, and provide exceptional care with our integrated patient management system designed for modern healthcare practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="text-lg px-8 py-4">
              <MessageSquare className="mr-2 w-5 h-5" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need for <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Patient Management</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools to manage patient relationships, streamline workflows, and improve care quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: User,
              title: 'Patient Profiles',
              desc: 'Complete patient profiles with medical history, allergies, medications, and contact information all in one place.'
            },
            {
              icon: Calendar,
              title: 'Appointment Management',
              desc: 'Schedule, reschedule, and manage appointments with automated reminders and waitlist management.'
            },
            {
              icon: FileText,
              title: 'Medical Records',
              desc: 'Digital medical records with secure storage, easy access, and comprehensive documentation capabilities.'
            },
            {
              icon: MessageSquare,
              title: 'Patient Communication',
              desc: 'Secure messaging, email notifications, and SMS alerts to keep patients informed and engaged.'
            },
            {
              icon: BarChart3,
              title: 'Analytics & Reporting',
              desc: 'Track patient outcomes, practice performance, and generate detailed reports for better decision making.'
            },
            {
              icon: Shield,
              title: 'HIPAA Compliance',
              desc: 'Bank-level security with full HIPAA compliance, audit trails, and encrypted data storage.'
            }
          ].map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300`}>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12 text-center`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Patient Management</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare providers who trust MediTrack+ for comprehensive patient care solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="text-lg px-8 py-4">
              <MessageSquare className="mr-2 w-5 h-5" />
              Schedule Demo
            </Button>
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