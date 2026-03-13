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
  MapPin, Coffee, Gamepad2, DollarSign, UserPlus
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function CareersPage() {
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
            <Briefcase className="w-4 h-4 inline mr-2" />
            Careers
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Join Our <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Mission
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Help us transform healthcare by building technology that saves lives. We're looking for passionate individuals who want to make a real impact in healthcare.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <Search className="mr-2 w-5 h-5" />
              View Open Positions
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <UserPlus className="mr-2 w-5 h-5" />
              Meet Our Team
            </Button>
            <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
              <Heart className="mr-2 w-5 h-5" />
              Why MediTrack+
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">MediTrack+</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join a team that's revolutionizing healthcare with purpose-driven work and cutting-edge technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: HeartIcon,
              title: 'Meaningful Impact',
              desc: 'Your work directly improves patient outcomes and saves lives every day.',
              color: 'from-red-500 to-red-600'
            },
            {
              icon: TrendingUpIcon,
              title: 'Growth Opportunities',
              desc: 'Fast-paced environment with continuous learning and career advancement.',
              color: 'from-green-500 to-green-600'
            },
            {
              icon: Users,
              title: 'Collaborative Culture',
              desc: 'Work with talented professionals from healthcare and technology backgrounds.',
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: Coffee,
              title: 'Work-Life Balance',
              desc: 'Flexible schedules, remote work options, and comprehensive benefits.',
              color: 'from-orange-500 to-orange-600'
            },
            {
              icon: Award,
              title: 'Innovation Focus',
              desc: 'Access to cutting-edge tools and the freedom to experiment with new ideas.',
              color: 'from-purple-500 to-purple-600'
            },
            {
              icon: Globe,
              title: 'Global Impact',
              desc: 'Our platform serves healthcare providers in 150+ countries worldwide.',
              color: 'from-cyan-500 to-cyan-600'
            }
          ].map((benefit, i) => {
            const IconComponent = benefit.icon;
            return (
              <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Open <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Positions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our growing team and help shape the future of healthcare technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: 'Senior Software Engineer',
              department: 'Engineering',
              location: 'Remote / San Francisco',
              type: 'Full-time',
              salary: '$120k - $180k',
              desc: 'Build scalable healthcare platforms using modern technologies. Experience with React, Node.js, and cloud platforms required.'
            },
            {
              title: 'Product Manager',
              department: 'Product',
              location: 'New York / Remote',
              type: 'Full-time',
              salary: '$110k - $150k',
              desc: 'Drive product strategy for our healthcare solutions. 3+ years of product management experience in SaaS required.'
            },
            {
              title: 'Clinical Solutions Architect',
              department: 'Healthcare',
              location: 'Remote',
              type: 'Full-time',
              salary: '$130k - $170k',
              desc: 'Bridge clinical workflows with technology. Healthcare background and technical expertise required.'
            },
            {
              title: 'DevOps Engineer',
              department: 'Engineering',
              location: 'Austin / Remote',
              type: 'Full-time',
              salary: '$100k - $140k',
              desc: 'Manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Kubernetes, and monitoring tools.'
            },
            {
              title: 'UX/UI Designer',
              department: 'Design',
              location: 'Remote',
              type: 'Full-time',
              salary: '$90k - $130k',
              desc: 'Design intuitive healthcare interfaces. Portfolio showcasing user-centered design for complex applications required.'
            },
            {
              title: 'Data Scientist',
              department: 'Analytics',
              location: 'Boston / Remote',
              type: 'Full-time',
              salary: '$115k - $155k',
              desc: 'Build ML models for healthcare analytics. PhD in relevant field or equivalent experience with Python and statistics.'
            }
          ].map((job, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">{job.department}</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">{job.type}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-muted-foreground mb-4">{job.desc}</p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1 text-green-400 font-medium">
                  <DollarSign className="w-4 h-4" />
                  {job.salary}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Culture & Perks */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Culture & <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Perks</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We foster a supportive environment where innovation thrives and work-life balance is prioritized.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Coffee,
                title: 'Flexible Hours',
                desc: 'Work when you\'re most productive with our flexible scheduling.'
              },
              {
                icon: Users,
                title: 'Team Building',
                desc: 'Regular virtual and in-person team events and celebrations.'
              },
              {
                icon: Gamepad2,
                title: 'Fun Environment',
                desc: 'Game rooms, virtual game nights, and creative outlets.'
              },
              {
                icon: Heart,
                title: 'Health Benefits',
                desc: 'Comprehensive health, dental, and vision coverage for you and your family.'
              },
              {
                icon: BookOpen,
                title: 'Learning Budget',
                desc: '$2,000 annual budget for courses, conferences, and books.'
              },
              {
                icon: Globe,
                title: 'Remote Work',
                desc: 'Work from anywhere with our distributed team model.'
              },
              {
                icon: TrendingUp,
                title: 'Career Growth',
                desc: 'Clear paths for advancement and professional development.'
              },
              {
                icon: Award,
                title: 'Recognition',
                desc: 'Spot bonuses, peer recognition, and performance rewards.'
              }
            ].map((perk, i) => {
              const IconComponent = perk.icon;
              return (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{perk.title}</h3>
                  <p className="text-muted-foreground text-sm">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Application <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Process</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined hiring process ensures we find the best talent while respecting your time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Apply',
              desc: 'Submit your application with your resume and portfolio.',
              time: '5 minutes'
            },
            {
              step: '02',
              title: 'Screening',
              desc: 'Initial review by our talent team within 2 business days.',
              time: '2 days'
            },
            {
              step: '03',
              title: 'Interview',
              desc: 'Technical and cultural fit interviews with the team.',
              time: '1-2 weeks'
            },
            {
              step: '04',
              title: 'Offer',
              desc: 'Receive competitive offer with comprehensive benefits.',
              time: '1 week'
            }
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-3">{step.desc}</p>
              <div className="text-sm text-orange-400 font-medium">{step.time}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Don't see a position that matches your skills? We're always looking for talented individuals.
          </p>
          <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
            <Mail className="mr-2 w-5 h-5" />
            Send Us Your Resume
          </Button>
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