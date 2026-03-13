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
  Tag, User as UserIcon, Clock as ClockIcon2
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function BlogPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
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

  const categories = [
    { id: 'all', label: 'All Posts', count: 24 },
    { id: 'technology', label: 'Technology', count: 8 },
    { id: 'healthcare', label: 'Healthcare', count: 6 },
    { id: 'innovation', label: 'Innovation', count: 5 },
    { id: 'research', label: 'Research', count: 3 },
    { id: 'company', label: 'Company', count: 2 }
  ]

  const blogPosts = [
    {
      title: 'The Future of AI in Healthcare: Transforming Patient Care',
      excerpt: 'Explore how artificial intelligence is revolutionizing diagnostics, treatment planning, and patient monitoring in modern healthcare facilities.',
      author: 'Dr. Sarah Chen',
      date: 'Jan 15, 2024',
      readTime: '8 min read',
      category: 'technology',
      image: '🤖',
      featured: true
    },
    {
      title: 'Building Trust: The Importance of Data Security in Healthcare',
      excerpt: 'Understanding the critical role of robust security measures in maintaining patient trust and regulatory compliance.',
      author: 'Michael Rodriguez',
      date: 'Jan 12, 2024',
      readTime: '6 min read',
      category: 'healthcare',
      image: '🔒',
      featured: false
    },
    {
      title: 'Telemedicine Trends: What to Expect in 2024',
      excerpt: 'Latest developments in remote healthcare delivery and their impact on patient outcomes worldwide.',
      author: 'Dr. James Wilson',
      date: 'Jan 10, 2024',
      readTime: '5 min read',
      category: 'innovation',
      image: '📱',
      featured: false
    },
    {
      title: 'Clinical Research: Advancing Medical Knowledge Through Technology',
      excerpt: 'How digital platforms are accelerating clinical trials and medical research initiatives.',
      author: 'Dr. Lisa Park',
      date: 'Jan 8, 2024',
      readTime: '7 min read',
      category: 'research',
      image: '🔬',
      featured: false
    },
    {
      title: 'Our Journey: Five Years of Healthcare Innovation',
      excerpt: 'Reflecting on our growth, achievements, and the road ahead in transforming healthcare delivery.',
      author: 'MediTrack+ Team',
      date: 'Jan 5, 2024',
      readTime: '4 min read',
      category: 'company',
      image: '🎯',
      featured: false
    },
    {
      title: 'Digital Health Records: Improving Care Coordination',
      excerpt: 'The benefits of integrated electronic health records in enhancing patient care and clinical efficiency.',
      author: 'Dr. Robert Kim',
      date: 'Jan 3, 2024',
      readTime: '6 min read',
      category: 'healthcare',
      image: '📋',
      featured: false
    }
  ]

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

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
            <PenTool className="w-4 h-4 inline mr-2" />
            Blog
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Insights & <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Perspectives
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stay informed with the latest trends, research, and insights from the world of healthcare technology and innovation.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, insights, and research..."
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${isDarkMode ? 'bg-card/60 border-border' : 'bg-card/80 border-border'} focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-lg px-8 py-4">
              <Tag className="mr-2 w-5 h-5" />
              Browse Topics
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <Mail className="mr-2 w-5 h-5" />
              Subscribe
            </Button>
            <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-4`}>
              <PenTool className="mr-2 w-5 h-5" />
              Write for Us
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {blogPosts.find(post => post.featured) && (
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">Featured</span>
                  <span className="text-muted-foreground">{blogPosts.find(post => post.featured)?.date}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {blogPosts.find(post => post.featured)?.title}
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  {blogPosts.find(post => post.featured)?.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{blogPosts.find(post => post.featured)?.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{blogPosts.find(post => post.featured)?.readTime}</span>
                  </div>
                </div>
                <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-6 py-3`}>
                  <ArrowRight className="mr-2 w-4 h-4" />
                  Read Article
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">{blogPosts.find(post => post.featured)?.image}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${colorClasses.primary} text-white`
                  : `${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} text-muted-foreground hover:border-orange-500/30`
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(post => !post.featured).map((post, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 cursor-pointer group`}>
              <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <span className="text-4xl">{post.image}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                    post.category === 'technology' ? 'bg-blue-500/20 text-blue-400' :
                    post.category === 'healthcare' ? 'bg-green-500/20 text-green-400' :
                    post.category === 'innovation' ? 'bg-purple-500/20 text-purple-400' :
                    post.category === 'research' ? 'bg-red-500/20 text-red-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {post.category}
                  </span>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-orange-400 transition-colors">{post.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-3xl p-12 text-center`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stay <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Informed</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the latest healthcare technology insights, research findings, and industry trends delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-card/60 border-border' : 'bg-card/80 border-border'} focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
            />
            <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} px-6 py-3`}>
              <Mail className="mr-2 w-4 h-4" />
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
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