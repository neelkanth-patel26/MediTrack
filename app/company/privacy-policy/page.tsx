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
  Scale, Eye as EyeIcon, Mail as MailIcon, Phone as PhoneIcon
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function PrivacyPolicyPage() {
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

  const privacySections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <EyeIcon className="w-5 h-5" />,
      content: [
        'Personal Information: Name, email address, phone number, date of birth, medical history, and other health-related data you provide.',
        'Usage Data: Information about how you use our services, including IP addresses, browser types, and device information.',
        'Health Data: Medical records, treatment history, prescriptions, and other healthcare information shared through our platform.',
        'Communication Data: Messages, emails, and other communications sent through our system.'
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: <DatabaseIcon className="w-5 h-5" />,
      content: [
        'Provide and maintain our healthcare services',
        'Process appointments, prescriptions, and medical records',
        'Communicate with you about your healthcare needs',
        'Improve our services and develop new features',
        'Ensure compliance with legal and regulatory requirements',
        'Protect the security and integrity of our platform'
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: <UsersIcon className="w-5 h-5" />,
      content: [
        'With healthcare providers involved in your care',
        'With your explicit consent for specific purposes',
        'When required by law or to protect public safety',
        'In connection with legal proceedings or investigations',
        'With service providers who assist our operations (under strict confidentiality agreements)',
        'In the event of a business transfer or merger'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <ShieldIcon className="w-5 h-5" />,
      content: [
        'Industry-standard encryption for data transmission and storage',
        'Regular security audits and vulnerability assessments',
        'Access controls and authentication requirements',
        'Employee training on data protection and privacy',
        'Incident response procedures for potential breaches',
        'Regular backups and disaster recovery planning'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      icon: <Scale className="w-5 h-5" />,
      content: [
        'Access: Request access to your personal information',
        'Correction: Request correction of inaccurate or incomplete data',
        'Deletion: Request deletion of your personal information',
        'Portability: Request transfer of your data to another service',
        'Restriction: Request limitation of processing in certain circumstances',
        'Objection: Object to processing based on legitimate interests'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: <GlobeIcon className="w-5 h-5" />,
      content: [
        'Essential cookies for platform functionality',
        'Analytics cookies to improve user experience',
        'Preference cookies to remember your settings',
        'Marketing cookies for relevant communications',
        'Third-party cookies from integrated services',
        'Cookie management options in your account settings'
      ]
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: <GlobeIcon className="w-5 h-5" />,
      content: [
        'Data may be transferred to and processed in countries other than your own',
        'We ensure appropriate safeguards for international transfers',
        'Compliance with applicable data protection laws',
        'Standard contractual clauses and adequacy decisions',
        'Your consent where required by local laws',
        'Regular review of transfer mechanisms'
      ]
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: <ClockIcon className="w-5 h-5" />,
      content: [
        'Personal data retained only as long as necessary for stated purposes',
        'Medical records retained according to healthcare regulations',
        'Account data retained during active use and for legal compliance periods',
        'Inactive accounts may be deleted after specified periods',
        'Backup data retained for disaster recovery purposes',
        'Anonymized data may be retained indefinitely for research and analytics'
      ]
    },
    {
      id: 'contact-us',
      title: 'Contact Us',
      icon: <MailIcon className="w-5 h-5" />,
      content: [
        'Privacy Officer: privacy@meditrackplus.com',
        'Data Protection Officer: dpo@meditrackplus.com',
        'General Inquiries: support@meditrackplus.com',
        'Phone: 1-800-MEDI-TRACK (1-800-633-4872)',
        'Mailing Address: 123 Healthcare Drive, Medical City, MC 12345',
        'Response Time: We aim to respond within 30 days of receiving your request'
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
            <ShieldIcon className="w-4 h-4 inline mr-2" />
            Privacy Policy
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Your Privacy <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Matters
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We are committed to protecting your personal information and maintaining the highest standards of data privacy and security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <Download className="mr-2 w-5 h-5" />
              Download PDF
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <MailIcon className="mr-2 w-5 h-5" />
              Contact Privacy Team
            </Button>
            <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
              <FileTextIcon className="mr-2 w-5 h-5" />
              Data Request Form
            </Button>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            Last updated: January 15, 2024 | Effective: January 1, 2024
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          {/* Introduction */}
          <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-8`}>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-4">
              MediTrack+ ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare management platform.
            </p>
            <p className="text-muted-foreground mb-4">
              By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information except as described in this Privacy Policy.
            </p>
            <p className="text-muted-foreground">
              This policy applies to all users of our platform, including patients, healthcare providers, and administrators. If you have any questions about this Privacy Policy, please contact our Privacy Officer.
            </p>
          </div>

          {/* Expandable Sections */}
          {privacySections.map((section) => (
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

          {/* Changes to Policy */}
          <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-8`}>
            <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li>• Email notification to your registered email address</li>
              <li>• Prominent notice on our platform</li>
              <li>• Update to the "Last updated" date at the top of this policy</li>
            </ul>
            <p className="text-muted-foreground">
              Your continued use of our services after such modifications constitutes acceptance of the updated Privacy Policy.
            </p>
          </div>

          {/* Compliance */}
          <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-8`}>
            <h2 className="text-2xl font-bold mb-4">Regulatory Compliance</h2>
            <p className="text-muted-foreground mb-4">
              We comply with all applicable data protection and privacy laws, including:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-muted-foreground">HIPAA (Health Insurance Portability and Accountability Act)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-muted-foreground">GDPR (General Data Protection Regulation)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-muted-foreground">CCPA (California Consumer Privacy Act)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-muted-foreground">HITECH (Health Information Technology for Economic and Clinical Health)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12 text-center`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Have Questions About <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Your Privacy?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our privacy team is here to help. Contact us with any questions or concerns about your data and privacy rights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <MailIcon className="mr-2 w-5 h-5" />
              privacy@meditrackplus.com
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <PhoneIcon className="mr-2 w-5 h-5" />
              1-800-MEDI-TRACK
            </Button>
            <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
              <FileTextIcon className="mr-2 w-5 h-5" />
              Submit Data Request
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