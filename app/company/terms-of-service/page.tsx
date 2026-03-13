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
  Quote, Calendar as CalendarIcon, ExternalLink as ExternalLinkIcon, PenTool,
  Tag, User as UserIcon, Clock as ClockIcon2, FileText as FileTextIcon,
  Scale, Eye as EyeIcon, Mail as MailIcon, Phone as PhoneIcon, Gavel,
  AlertCircle as AlertCircleIcon, CheckCircle as CheckCircleIcon
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function TermsOfServicePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
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

  const termsSections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <CheckCircleIcon className="w-5 h-5" />,
      content: [
        'By accessing and using MediTrack+ services, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
        'These terms apply to all users, including patients, healthcare providers, administrators, and visitors.',
        'Your use of our services constitutes acceptance of these terms and our Privacy Policy.',
        'We reserve the right to modify these terms at any time without prior notice.',
        'Continued use of our services after changes constitutes acceptance of the modified terms.'
      ]
    },
    {
      id: 'description-of-service',
      title: 'Description of Service',
      icon: <DatabaseIcon className="w-5 h-5" />,
      content: [
        'MediTrack+ provides healthcare management software including patient records, appointment scheduling, prescription management, and analytics.',
        'Services are provided on an "as is" and "as available" basis without warranties of any kind.',
        'We reserve the right to modify, suspend, or discontinue services at any time.',
        'Service availability may be affected by maintenance, updates, or unforeseen circumstances.',
        'We do not guarantee uninterrupted or error-free service operation.',
        'Users are responsible for maintaining their own data backups and contingency plans.'
      ]
    },
    {
      id: 'user-obligations',
      title: 'User Obligations',
      icon: <UsersIcon className="w-5 h-5" />,
      content: [
        'Provide accurate, current, and complete information during registration and use.',
        'Maintain the confidentiality of your account credentials and access codes.',
        'Use the services only for lawful purposes and in compliance with applicable laws.',
        'Respect the privacy and rights of other users and healthcare providers.',
        'Report any security incidents, unauthorized access, or suspected breaches immediately.',
        'Comply with all healthcare regulations, including HIPAA and patient privacy requirements.',
        'Not attempt to reverse engineer, decompile, or otherwise interfere with our services.',
        'Not use automated tools or scripts to access our services without permission.'
      ]
    },
    {
      id: 'medical-disclaimer',
      title: 'Medical Disclaimer',
      icon: <AlertCircleIcon className="w-5 h-5" />,
      content: [
        'MediTrack+ is a healthcare management platform and does not provide medical advice or treatment.',
        'All medical decisions should be made by qualified healthcare professionals.',
        'We are not responsible for the accuracy, completeness, or timeliness of medical information.',
        'Users should consult with healthcare providers for medical advice and treatment decisions.',
        'Platform features are tools to assist healthcare delivery, not substitutes for professional judgment.',
        'We disclaim all liability for medical outcomes or decisions based on platform usage.',
        'Emergency situations require immediate contact with emergency services, not platform use.'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <ShieldIcon className="w-5 h-5" />,
      content: [
        'All content, features, and functionality of MediTrack+ are owned by us or our licensors.',
        'Services are protected by copyright, trademark, and other intellectual property laws.',
        'Users retain ownership of their data but grant us license to process and store it.',
        'You may not reproduce, distribute, or create derivative works without permission.',
        'Our trademarks, service marks, and trade dress may not be used without authorization.',
        'Feedback and suggestions may be used by us without compensation or attribution.',
        'Open source components are subject to their respective license terms.'
      ]
    },
    {
      id: 'data-privacy',
      title: 'Data Privacy and Security',
      icon: <LockIcon className="w-5 h-5" />,
      content: [
        'We implement industry-standard security measures to protect your data.',
        'Data handling is governed by our Privacy Policy and applicable regulations.',
        'We comply with HIPAA, GDPR, and other privacy laws as applicable.',
        'Users are responsible for maintaining confidentiality of sensitive information.',
        'Data breaches must be reported immediately to our security team.',
        'We may monitor usage for security and compliance purposes.',
        'Data retention follows legal requirements and our data retention policies.'
      ]
    },
    {
      id: 'limitation-of-liability',
      title: 'Limitation of Liability',
      icon: <Scale className="w-5 h-5" />,
      content: [
        'Our total liability for any claims arising from service use is limited to the amount paid for services.',
        'We are not liable for indirect, incidental, consequential, or punitive damages.',
        'Liability for data loss is limited to the cost of data recovery from backups.',
        'We are not responsible for third-party actions or service interruptions.',
        'Users assume all risks associated with healthcare data management.',
        'Force majeure events (natural disasters, etc.) may excuse performance obligations.',
        'Disclaimers apply to the maximum extent permitted by applicable law.'
      ]
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <XCircle className="w-5 h-5" />,
      content: [
        'Either party may terminate service with appropriate notice.',
        'We may terminate accounts for violation of these terms or illegal activity.',
        'Upon termination, access rights cease immediately.',
        'Data may be retained or deleted according to our retention policies.',
        'Outstanding payments remain due upon termination.',
        'Some provisions survive termination, including liability limitations.',
        'Users may request data export before account closure.'
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: <Gavel className="w-5 h-5" />,
      content: [
        'These terms are governed by the laws of the jurisdiction where our company is incorporated.',
        'Disputes will be resolved through binding arbitration in accordance with our arbitration agreement.',
        'Class action waivers apply to the maximum extent permitted by law.',
        'International users agree to jurisdiction in our primary courts.',
        'Applicable law includes federal and state healthcare regulations.',
        'Terms shall not be governed by the United Nations Convention on Contracts.',
        'Severability clause ensures remaining provisions remain in effect if any are found invalid.'
      ]
    },
    {
      id: 'contact-information',
      title: 'Contact Information',
      icon: <MailIcon className="w-5 h-5" />,
      content: [
        'Legal Department: legal@meditrackplus.com',
        'General Support: support@meditrackplus.com',
        'Privacy Officer: privacy@meditrackplus.com',
        'Phone: 1-800-MEDI-TRACK (1-800-633-4872)',
        'Mailing Address: 123 Healthcare Drive, Medical City, MC 12345',
        'Business Hours: Monday-Friday, 9:00 AM - 6:00 PM EST',
        'Emergency Contact: Available 24/7 for critical service issues'
      ]
    }
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
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
            <Gavel className="w-4 h-4 inline mr-2" />
            Terms of Service
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Terms & <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Conditions
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Please read these terms carefully before using our healthcare management platform. Your use constitutes acceptance of these terms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <Download className="mr-2 w-5 h-5" />
              Download PDF
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <MailIcon className="mr-2 w-5 h-5" />
              Contact Legal Team
            </Button>
            <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
              <FileTextIcon className="mr-2 w-5 h-5" />
              Accept Terms
            </Button>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            Last updated: January 15, 2024 | Effective: January 1, 2024 | Version 2.1
          </p>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          {/* Introduction */}
          <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-8`}>
            <h2 className="text-2xl font-bold mb-4">Agreement Overview</h2>
            <p className="text-muted-foreground mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and MediTrack+ ("we," "our," or "us") regarding your use of our healthcare management platform and related services.
            </p>
            <p className="text-muted-foreground mb-4">
              By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not use our services.
            </p>
            <p className="text-muted-foreground">
              These Terms apply to all users of our platform, including but not limited to patients, healthcare providers, administrators, and any other individuals or entities accessing our services.
            </p>
          </div>

          {/* Expandable Sections */}
          {termsSections.map((section) => (
            <div key={section.id} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl overflow-hidden`}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-8 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${colorClasses.primaryLight}`}>
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {expandedSection === section.id && (
                <div className="px-8 pb-8">
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full ${colorClasses.primaryLight} mt-2 flex-shrink-0`}></div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Changes to Terms */}
          <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-8`}>
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these Terms at any time. When we make material changes, we will provide notice by:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li>• Email notification to registered users</li>
              <li>• Prominent notice on our platform</li>
              <li>• Update to the "Last updated" date at the top of these Terms</li>
            </ul>
            <p className="text-muted-foreground">
              Your continued use of our services after such modifications constitutes acceptance of the updated Terms. If you disagree with the changes, you must stop using our services.
            </p>
          </div>

          {/* Severability */}
          <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-8`}>
            <h2 className="text-2xl font-bold mb-4">Severability and Entire Agreement</h2>
            <p className="text-muted-foreground mb-4">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the Terms will otherwise remain in full force and effect.
            </p>
            <p className="text-muted-foreground">
              These Terms, together with our Privacy Policy and any other legal notices published by us on the platform, constitute the entire agreement between you and us concerning the subject matter hereof.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12 text-center`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Questions About These <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Terms?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our legal team is available to answer any questions you may have about these Terms of Service or our platform usage policies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <MailIcon className="mr-2 w-5 h-5" />
              legal@meditrackplus.com
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <PhoneIcon className="mr-2 w-5 h-5" />
              1-800-MEDI-TRACK
            </Button>
            <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
              <FileTextIcon className="mr-2 w-5 h-5" />
              Contact Legal Team
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