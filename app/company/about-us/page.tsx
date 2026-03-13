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
  Target, Award, TrendingUp as TrendingUpIcon, Heart as HeartIcon, Building, Crown
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function AboutUsPage() {
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
            <Building className="w-4 h-4 inline mr-2" />
            About Us
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Transforming <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Healthcare Together
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Founded in 2018, MediTrack+ has been at the forefront of healthcare innovation, empowering medical professionals with cutting-edge technology to deliver exceptional patient care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/meet-our-team">
              <Button variant="outline" className="text-lg px-8 py-4">
                <Users className="mr-2 w-5 h-5" />
                Meet Our Team
              </Button>
            </Link>
            <Link href="/company/careers">
              <Button variant="outline" className="text-lg px-8 py-4">
                <Briefcase className="mr-2 w-5 h-5" />
                Join Our Mission
              </Button>
            </Link>
            <Link href="/company/press">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
                <Award className="mr-2 w-5 h-5" />
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Mission</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              To revolutionize healthcare delivery by providing medical professionals with intelligent, secure, and user-friendly tools that enhance patient care and streamline clinical workflows.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Patient-Centered Care</h3>
                  <p className="text-muted-foreground">Every feature we build prioritizes patient safety and clinical outcomes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Innovation First</h3>
                  <p className="text-muted-foreground">We leverage cutting-edge technology to solve real healthcare challenges.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Trust & Security</h3>
                  <p className="text-muted-foreground">Healthcare-grade security ensures patient data remains protected and compliant.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-3xl p-8`}>
            <div className="text-center">
              <HeartIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-orange-400 mb-1">Integrity</div>
                  <div className="text-muted-foreground">Ethical practices in all we do</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-400 mb-1">Excellence</div>
                  <div className="text-muted-foreground">Highest quality in our solutions</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-400 mb-1">Innovation</div>
                  <div className="text-muted-foreground">Pushing healthcare technology forward</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-400 mb-1">Compassion</div>
                  <div className="text-muted-foreground">Caring for patients and providers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              By the <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Numbers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our impact on healthcare delivery and the communities we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '50,000+',
                label: 'Healthcare Providers',
                desc: 'Doctors, nurses, and staff using our platform'
              },
              {
                number: '2M+',
                label: 'Patients Served',
                desc: 'Lives improved through better care coordination'
              },
              {
                number: '99.9%',
                label: 'Uptime',
                desc: 'Reliable service availability'
              },
              {
                number: '150+',
                label: 'Countries',
                desc: 'Global healthcare impact'
              }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">{stat.number}</div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                <div className="text-muted-foreground">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Story</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From a small startup to a healthcare technology leader.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              year: '2018',
              title: 'The Beginning',
              desc: 'Founded by healthcare professionals frustrated with outdated systems. Started with a vision to modernize patient care.',
              icon: Sparkles
            },
            {
              year: '2019',
              title: 'First Product Launch',
              desc: 'Released our initial patient management platform, serving 500+ healthcare providers in our first year.',
              icon: Rocket
            },
            {
              year: '2020',
              title: 'Scaling During Crisis',
              desc: 'Pivoted to support telemedicine during COVID-19, helping providers transition to remote care seamlessly.',
              icon: TrendingUpIcon
            },
            {
              year: '2021',
              title: 'Global Expansion',
              desc: 'Expanded to 50+ countries, earning recognition for healthcare innovation and patient safety.',
              icon: Globe
            },
            {
              year: '2022',
              title: 'AI Integration',
              desc: 'Launched AI-powered features for diagnostics and treatment recommendations, revolutionizing clinical workflows.',
              icon: Bot
            },
            {
              year: '2023',
              title: 'Industry Leadership',
              desc: 'Achieved SOC 2 Type II compliance and became the trusted choice for enterprise healthcare organizations.',
              icon: Award
            }
          ].map((milestone, i) => {
            const IconComponent = milestone.icon;
            return (
              <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-orange-400">{milestone.year}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{milestone.title}</h3>
                <p className="text-muted-foreground">{milestone.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Leadership <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experienced healthcare and technology leaders driving our mission forward.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'Neelkanth Patel',
              role: 'CEO & Founder',
              desc: 'Visionary leader driving innovation in healthcare technology and patient care solutions.',
              icon: Crown
            },
            {
              name: 'Urmi Thakkar',
              role: 'COO & CMO',
              desc: 'Chief Operating Officer overseeing business operations and Chief Marketing Officer leading brand strategy.',
              icon: TrendingUp
            },
            {
              name: 'Nayak Dhruv',
              role: 'CTO & Co-Founder',
              desc: 'Technical architect overseeing AI and backend systems development.',
              icon: Cpu
            },
            {
              name: 'Nirmal Dhruv',
              role: 'Chief Data Officer',
              desc: 'Leads data strategy and infrastructure for healthcare analytics and insights.',
              icon: Database
            },
            {
              name: 'Nirmal Dhyey',
              role: 'VP of Engineering',
              desc: 'Manages engineering teams and oversees product development lifecycle.',
              icon: Code2
            },
            {
              name: 'Nirmit Sheth',
              role: 'Head of AI & ML',
              desc: 'Directs AI research and machine learning initiatives for medical applications.',
              icon: Bot
            },
            {
              name: 'Panchal Darshil',
              role: 'Chief Product Officer',
              desc: 'Drives product strategy and ensures exceptional user experience across all platforms.',
              icon: Target
            },
            {
              name: 'Reese Whiteman',
              role: 'Head of Design',
              desc: 'Oversees user experience and interface design for medical applications.',
              icon: Palette
            },
            {
              name: 'Jay Shah',
              role: 'Senior Developer',
              desc: 'Full-stack developer specializing in healthcare software solutions.',
              icon: Code
            },
            {
              name: 'Trap Airer',
              role: 'DevOps Engineer',
              desc: 'Manages infrastructure and deployment pipelines for scalable healthcare systems.',
              icon: Server
            },
            {
              name: 'Aditi Panchal',
              role: 'QA Lead',
              desc: 'Ensures quality assurance and testing standards for medical software.',
              icon: CheckCircle
            }
          ].map((leader, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 text-center hover:border-orange-500/30 transition-all duration-300`}>
              <div className="flex justify-center mb-4">
                <leader.icon className="w-16 h-16 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">{leader.name}</h3>
              <div className="text-orange-400 font-medium mb-3">{leader.role}</div>
              <p className="text-muted-foreground text-sm">{leader.desc}</p>
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