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
  Search, Archive, AlertTriangle, TrendingUp, PieChart, LifeBuoy
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function HelpCenterPage() {
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
            <LifeBuoy className="w-4 h-4 inline mr-2" />
            Help Center
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Find <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Answers & Support
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get instant help with our comprehensive knowledge base, video tutorials, and 24/7 support resources designed for healthcare professionals.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${isDarkMode ? 'bg-card/60 border-border' : 'bg-card/80 border-border'} focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <BookOpen className="mr-2 w-5 h-5" />
              Browse Articles
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <Video className="mr-2 w-5 h-5" />
              Watch Tutorials
            </Button>
            <Link href="/support/contact-support">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
                <MessageSquare className="mr-2 w-5 h-5" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Topics Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Popular <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Help Topics</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Quick access to the most frequently asked questions and common issues.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: User,
              title: 'Getting Started',
              desc: 'Learn the basics of MediTrack+ and set up your account for the first time.',
              articles: '12 articles',
              url: '/support/getting-started'
            },
            {
              icon: Calendar,
              title: 'Appointment Scheduling',
              desc: 'Master the scheduling system, manage appointments, and handle cancellations.',
              articles: '18 articles',
              url: '/support/appointment-scheduling'
            },
            {
              icon: FileText,
              title: 'Medical Records',
              desc: 'Upload, organize, and manage patient medical records securely.',
              articles: '15 articles',
              url: '/support/medical-records'
            },
            {
              icon: PillIcon,
              title: 'Prescription Management',
              desc: 'Electronic prescribing, refill management, and medication tracking.',
              articles: '10 articles',
              url: '/support/prescription-management'
            },
            {
              icon: BarChart3,
              title: 'Analytics & Reporting',
              desc: 'Generate reports, analyze data, and track practice performance.',
              articles: '8 articles',
              url: '/support/analytics-and-reporting'
            },
            {
              icon: Shield,
              title: 'Security & Compliance',
              desc: 'HIPAA compliance, data security, and privacy best practices.',
              articles: '14 articles',
              url: '/support/security-and-compliance'
            }
          ].map((topic, i) => {
            const IconComponent = topic.icon;
            return (
              <Link key={i} href={topic.url}>
                <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group`}>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-colors">
                  <IconComponent className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">{topic.title}</h3>
                <p className="text-muted-foreground mb-4">{topic.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-400 font-medium">{topic.articles}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12 text-center`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Still Need <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Help</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our support team is here to help you succeed with MediTrack+. Get personalized assistance from healthcare technology experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support/contact-support">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
                <MessageSquare className="mr-2 w-5 h-5" />
                Contact Support
              </Button>
            </Link>
            <Button variant="outline" className="text-lg px-8 py-4">
              <Phone className="mr-2 w-5 h-5" />
              Call Us: (555) 123-4567
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