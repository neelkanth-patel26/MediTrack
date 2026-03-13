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
  Clock as ClockIcon, Server, Wifi, Globe as GlobeIcon, Eye, Fingerprint,
  Shield as ShieldIcon, Lock as LockIcon, Key as KeyIcon, FileCheck, Users as UsersIcon,
  Target, Award, TrendingUp as TrendingUpIcon, Heart as HeartIcon, Building,
  MapPin, Coffee, Gamepad2, DollarSign, UserPlus, Newspaper, Camera,
  Quote, Calendar as CalendarIcon, ExternalLink as ExternalLinkIcon
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function PressPage() {
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
            <Newspaper className="w-4 h-4 inline mr-2" />
            Press
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            MediTrack+ in the <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              News
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stay updated with the latest news, announcements, and media coverage about MediTrack+ and our mission to transform healthcare.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <Newspaper className="mr-2 w-5 h-5" />
              Latest News
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <Download className="mr-2 w-5 h-5" />
              Press Kit
            </Button>
            <Link href="/support/contact-support">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
                <Mail className="mr-2 w-5 h-5" />
                Media Inquiries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Story */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">Featured</span>
                <span className="text-muted-foreground">January 15, 2024</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                MediTrack+ Raises $50M Series C to Accelerate Global Healthcare Innovation
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Leading healthcare technology company secures major funding to expand AI-powered platform and serve more patients worldwide.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">TechCrunch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">5 min read</span>
                </div>
              </div>
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-6 py-3`}>
                <ExternalLinkIcon className="mr-2 w-4 h-4" />
                Read Full Article
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center">
                <Newspaper className="w-24 h-24 text-orange-500/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Recent <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">News</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Latest announcements, product updates, and industry recognition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'MediTrack+ Launches AI-Powered Diagnostic Assistant',
              outlet: 'Healthcare IT News',
              date: 'Dec 20, 2023',
              excerpt: 'New AI feature helps physicians with preliminary diagnoses and treatment recommendations.',
              category: 'Product'
            },
            {
              title: 'Named Best Healthcare Innovation of 2023',
              outlet: 'Forbes',
              date: 'Dec 15, 2023',
              excerpt: 'MediTrack+ recognized for revolutionary approach to patient data management.',
              category: 'Award'
            },
            {
              title: 'Partnership with Mayo Clinic Announced',
              outlet: 'Reuters',
              date: 'Dec 10, 2023',
              excerpt: 'Strategic collaboration to advance clinical research and patient care.',
              category: 'Partnership'
            },
            {
              title: 'MediTrack+ Achieves SOC 2 Type II Compliance',
              outlet: 'Security Magazine',
              date: 'Nov 28, 2023',
              excerpt: 'Platform meets highest standards for data security and privacy protection.',
              category: 'Security'
            },
            {
              title: 'Global Expansion Reaches 150 Countries',
              outlet: 'Bloomberg',
              date: 'Nov 15, 2023',
              excerpt: 'Healthcare providers in emerging markets gain access to advanced platform.',
              category: 'Expansion'
            },
            {
              title: 'New Research Shows 40% Improvement in Patient Outcomes',
              outlet: 'JAMA Network',
              date: 'Nov 5, 2023',
              excerpt: 'Independent study validates effectiveness of MediTrack+ care coordination.',
              category: 'Research'
            }
          ].map((news, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  news.category === 'Product' ? 'bg-blue-500/20 text-blue-400' :
                  news.category === 'Award' ? 'bg-yellow-500/20 text-yellow-400' :
                  news.category === 'Partnership' ? 'bg-green-500/20 text-green-400' :
                  news.category === 'Security' ? 'bg-purple-500/20 text-purple-400' :
                  news.category === 'Expansion' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {news.category}
                </span>
                <span className="text-sm text-muted-foreground">{news.date}</span>
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-orange-400 transition-colors">{news.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{news.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-400 font-medium">{news.outlet}</span>
                <ExternalLinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-orange-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Press Kit */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Press <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Resources</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Download our press kit, logos, and high-resolution images for media use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Company Logos',
              desc: 'High-resolution PNG and SVG formats',
              icon: Download,
              size: '2.3 MB'
            },
            {
              title: 'Product Screenshots',
              desc: 'Interface mockups and feature highlights',
              icon: Camera,
              size: '15.7 MB'
            },
            {
              title: 'Press Kit PDF',
              desc: 'Complete media information package',
              icon: FileText,
              size: '5.2 MB'
            },
            {
              title: 'Brand Guidelines',
              desc: 'Color palette and usage standards',
              icon: Palette,
              size: '1.8 MB'
            }
          ].map((resource, i) => {
            const IconComponent = resource.icon;
            return (
              <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 text-center hover:border-orange-500/30 transition-all duration-300 cursor-pointer group`}>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors">{resource.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{resource.desc}</p>
                <div className="text-xs text-orange-400 font-medium">{resource.size}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Media Contact */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12 text-center`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Media <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Inquiries</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            For press releases, interviews, or media opportunities, please contact our communications team.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Press Releases</h3>
              <p className="text-muted-foreground mb-3">press@meditrack.com</p>
              <p className="text-sm text-muted-foreground">For official announcements and news</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Media Relations</h3>
              <p className="text-muted-foreground mb-3">media@meditrack.com</p>
              <p className="text-sm text-muted-foreground">For interview requests and features</p>
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