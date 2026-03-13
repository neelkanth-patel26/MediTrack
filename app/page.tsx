'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Menu, X, Heart, Brain, Shield, Users, Star, CheckCircle2,
  TrendingUp, Clock, Award, ArrowRight, MessageSquare, Download, Sparkles,
  Zap, Cloud, Lock, Code, Infinity, Activity, Pill, Stethoscope,
  Video, Bot, ChevronDown, ChevronUp, Facebook, Twitter, Linkedin, Instagram,
  Monitor, Database, Cpu, Palette, Rocket, Hospital, HelpCircle, Phone
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const TEAM_MEMBERS = [
  { name: 'Neelkanth Patel', role: 'Frontend Developer', icon: Monitor },
  { name: 'Nayak Dhruv', role: 'Backend & AI Engineer', icon: Cpu },
  { name: 'Nirmal Dhruv', role: 'Data Architect', icon: Database },
  { name: 'Nirmal Dhyey', role: 'Data Architect', icon: Database },
  { name: 'Nirmit Sheth', role: 'Backend & AI Engineer', icon: Cpu },
  { name: 'Panchal Darshil', role: 'QA & UI Enhancer', icon: Palette },
]

const FAQ_ITEMS = [
  {
    question: 'How secure is my patient data?',
    answer: 'Your patient data is protected with bank-level encryption, multi-factor authentication, and comprehensive audit trails. We\'re fully HIPAA, GDPR, and SOC 2 compliant with 99.99% uptime guarantee.'
  },
  {
    question: 'Can I use MediTrack+ offline?',
    answer: 'Yes! Our offline-first architecture ensures you can continue working seamlessly during connectivity issues. All data syncs automatically when you\'re back online.'
  },
  {
    question: 'How accurate is the AI diagnostics?',
    answer: 'Our AI achieves 99.7% diagnostic accuracy, trained on millions of medical cases. It serves as a powerful second opinion tool, not a replacement for clinical judgment.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer 24/7 technical support, comprehensive documentation, video tutorials, and dedicated account managers for enterprise clients.'
  },
  {
    question: 'Can I integrate with my existing systems?',
    answer: 'Absolutely! Our API-first design allows seamless integration with existing EHR systems, labs, pharmacies, and third-party applications.'
  },
  {
    question: 'What\'s included in the free trial?',
    answer: 'Full access to all features for 30 days, including AI diagnostics, patient management, analytics, and 24/7 support. No credit card required.'
  }
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { color, isDarkMode } = useTheme()

  // Scroll animation refs
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Animation states
  const [heroVisible, setHeroVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [howItWorksVisible, setHowItWorksVisible] = useState(false)
  const [servicesVisible, setServicesVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [testimonialsVisible, setTestimonialsVisible] = useState(false)
  const [faqVisible, setFaqVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          if (target === heroRef.current) setHeroVisible(true)
          if (target === statsRef.current) setStatsVisible(true)
          if (target === howItWorksRef.current) setHowItWorksVisible(true)
          if (target === servicesRef.current) setServicesVisible(true)
          if (target === featuresRef.current) setFeaturesVisible(true)
          if (target === testimonialsRef.current) setTestimonialsVisible(true)
          if (target === faqRef.current) setFaqVisible(true)
          if (target === contactRef.current) setContactVisible(true)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (heroRef.current) observer.observe(heroRef.current)
    if (statsRef.current) observer.observe(statsRef.current)
    if (howItWorksRef.current) observer.observe(howItWorksRef.current)
    if (servicesRef.current) observer.observe(servicesRef.current)
    if (featuresRef.current) observer.observe(featuresRef.current)
    if (testimonialsRef.current) observer.observe(testimonialsRef.current)
    if (faqRef.current) observer.observe(faqRef.current)
    if (contactRef.current) observer.observe(contactRef.current)

    return () => observer.disconnect()
  }, [])

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      })
      
      if (response.ok) {
        setShowSuccessModal(true)
        setContactForm({ name: '', email: '', phone: '', message: '' })
      } else {
        alert('Error sending message. Please try again.')
      }
    } catch (error) {
      alert('Error sending message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={`${isDarkMode ? 'bg-background text-foreground' : 'bg-background text-foreground'}`}>
      
      {/* Floating Animated Glassmorphism Navbar */}
      <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-2xl ${isDarkMode ? 'bg-background/15 border border-border/20' : 'bg-background/15 border border-border/20'} rounded-3xl shadow-2xl shadow-black/10 hover:shadow-black/20 transition-all duration-500 ease-out mx-4 max-w-screen-2xl w-[calc(100%-2rem)] animate-fade-in-down`}>
        {/* Floating Background Effects */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/3 via-transparent to-orange-600/3 animate-gradient-x"></div>
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/8 to-orange-600/8 blur opacity-40 animate-pulse"></div>

        <div className="relative max-w-screen-2xl mx-auto px-8 sm:px-10 lg:px-12 py-5 flex justify-between items-center">
          {/* Enhanced Logo Section with Floating Animation */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses.primary} rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 group-hover:shadow-orange-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out`}>
              <Heart className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:via-orange-600 group-hover:to-orange-700 transition-all duration-500 drop-shadow-sm animate-gradient">
              MediTrack+
            </span>
          </div>

          {/* Desktop Menu with Enhanced Floating Effects */}
          <div className="hidden lg:flex gap-4 items-center text-lg">
            <a href="#home" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-4 py-3 rounded-2xl hover:bg-orange-500/10">
              <span className="relative z-10">Home</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-10 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/8 group-hover:to-orange-600/8 transition-all duration-300"></div>
            </a>
            <a href="#how-it-works" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-4 py-3 rounded-2xl hover:bg-orange-500/10">
              <span className="relative z-10">How It Works</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-16 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/8 group-hover:to-orange-600/8 transition-all duration-300"></div>
            </a>
            <a href="#services" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-4 py-3 rounded-2xl hover:bg-orange-500/10">
              <span className="relative z-10">Services</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-12 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/8 group-hover:to-orange-600/8 transition-all duration-300"></div>
            </a>
            <a href="#features" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-4 py-3 rounded-2xl hover:bg-orange-500/10">
              <span className="relative z-10">Features</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-12 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/8 group-hover:to-orange-600/8 transition-all duration-300"></div>
            </a>
            <a href="#testimonials" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-4 py-3 rounded-2xl hover:bg-orange-500/10">
              <span className="relative z-10">Testimonials</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-16 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/8 group-hover:to-orange-600/8 transition-all duration-300"></div>
            </a>
            <a href="#contact" className="relative group font-medium hover:text-orange-400 transition-all duration-300 px-4 py-3 rounded-2xl hover:bg-orange-500/10">
              <span className="relative z-10">Contact</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-12 transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/8 group-hover:to-orange-600/8 transition-all duration-300"></div>
            </a>
          </div>

          <div className="hidden md:flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className={`${isDarkMode ? 'text-foreground hover:bg-accent/80 hover:text-orange-400' : 'text-foreground hover:bg-accent/80 hover:text-orange-400'} text-lg px-6 py-3 rounded-2xl transition-all duration-300`}>
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className={`bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} text-lg px-8 py-3 rounded-2xl shadow-2xl shadow-orange-500/30 transition-all duration-300 font-semibold`}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Enhanced Floating Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-2xl hover:bg-accent/80 transition-all duration-300 backdrop-blur-sm"
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

        <div className={`md:hidden overflow-hidden transition-all duration-700 ease-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className={`${isDarkMode ? 'bg-background/90' : 'bg-background/90'} backdrop-blur-2xl border-t border-border/30 p-6 space-y-4 shadow-2xl rounded-b-3xl`}>
            <a href="#home" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-2xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Home
            </a>
            <a href="#how-it-works" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-2xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </a>
            <a href="#services" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-2xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Services
            </a>
            <a href="#features" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-2xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#testimonials" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-2xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Testimonials
            </a>
            <a href="#contact" className="block hover:text-orange-400 text-lg font-medium py-3 px-4 rounded-2xl hover:bg-accent/50 transition-all duration-300 hover:translate-x-2 hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
            <div className="flex gap-3 pt-4 border-t border-border/30">
              <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className={`w-full ${isDarkMode ? 'text-foreground hover:bg-accent/80' : 'text-foreground hover:bg-accent/80'} text-lg py-3 rounded-2xl transition-all duration-300`}>
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button className={`w-full bg-gradient-to-r ${colorClasses.primary} text-lg py-3 rounded-2xl shadow-xl transition-all duration-300 font-semibold`}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for floating header */}
      <div className="h-32"></div>

      {/* Hero Section */}
      <section ref={heroRef} id="home" className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
        {/* Floating decorative elements */}
        <div className={`absolute top-20 left-10 transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Heart className="w-8 h-8 text-orange-400 animate-pulse" />
          </div>
        </div>
        <div className={`absolute top-32 right-16 transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm rotate-12">
            <Stethoscope className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
        </div>
        <div className={`absolute bottom-32 left-16 transition-all duration-1000 delay-400 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-14 h-14 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Activity className="w-7 h-7 text-green-400 animate-pulse" />
          </div>
        </div>
        <div className={`absolute bottom-20 right-20 transition-all duration-1000 delay-600 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm -rotate-12">
            <Pill className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
        </div>

        <div className={`text-center relative z-10 transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-6 transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Rocket className="w-4 h-4 inline mr-2 animate-bounce" />
            Next-Generation Healthcare Technology
          </div>
          <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight transition-all duration-1000 delay-400 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            Transform Your <span className="block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">
              Healthcare Practice
            </span> with AI
          </h1>
          <p className={`mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto transition-all duration-1000 delay-600 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Join thousands of healthcare professionals who trust MediTrack+ for intelligent patient management, AI-powered diagnostics, and seamless practice operations. Experience the future of healthcare today.
          </p>
          <div className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-800 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Link href="/signup">
              <Button className={`w-full sm:w-auto bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} h-14 text-xl px-8 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5 animate-pulse" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 relative">
        {/* Decorative background elements */}
        <div className={`absolute top-8 left-8 w-20 h-20 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-xl transition-all duration-1000 ${statsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
        <div className={`absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-lg transition-all duration-1000 delay-200 ${statsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Healthcare Professionals', icon: Users },
              { number: '99.7%', label: 'Diagnostic Accuracy', icon: Brain },
              { number: '24/7', label: 'Support Available', icon: Shield },
              { number: '100%', label: 'HIPAA Compliant', icon: CheckCircle2 }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`text-center group hover:scale-105 transition-all duration-500 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: `${i * 0.2 + 0.4}s`}}>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center group-hover:from-orange-500/40 group-hover:to-orange-600/40 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured In Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 tracking-wider uppercase">Trusted by Industry Leaders</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-60 hover:opacity-80 transition-opacity duration-300">
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors duration-300 cursor-pointer">TechCrunch</span>
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors duration-300 cursor-pointer">Forbes</span>
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors duration-300 cursor-pointer">Wired</span>
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors duration-300 cursor-pointer">The Verge</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background decorative elements */}
        <div className={`absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-orange-400/5 to-pink-400/5 rounded-full blur-2xl transition-all duration-1000 ${howItWorksVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
        <div className={`absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-xl transition-all duration-1000 delay-200 ${howItWorksVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>

        <div className={`text-center mb-16 relative z-10 transition-all duration-1000 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 transition-all duration-1000 delay-200 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Zap className="w-4 h-4 inline mr-2 animate-bounce" />
            Simple 4-Step Process
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            How <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">MediTrack+</span> Works
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-600 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Get started in minutes with our intuitive platform designed for healthcare professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative z-10">
          {[
            { icon: Users, title: '1. Sign Up & Setup', desc: 'Create your account and configure your practice settings. Our guided setup ensures you\'re ready to go in under 10 minutes.', color: 'from-blue-500 to-blue-600' },
            { icon: Shield, title: '2. Import Patient Data', desc: 'Securely import existing patient records or start fresh. Our HIPAA-compliant system ensures complete data security.', color: 'from-green-500 to-green-600' },
            { icon: Brain, title: '3. AI-Powered Care', desc: 'Leverage our AI diagnostics for faster, more accurate assessments. Access real-time insights and treatment recommendations.', color: 'from-purple-500 to-purple-600' },
            { icon: TrendingUp, title: '4. Scale & Optimize', desc: 'Monitor performance with detailed analytics. Expand your practice with mobile access, telemedicine, and automated workflows.', color: 'from-orange-500 to-orange-600' },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className={`relative p-8 rounded-2xl ${isDarkMode ? 'bg-card/50 border border-border' : 'bg-card/80 border border-border'} transition-all duration-500 hover:shadow-lg hover:-translate-y-2 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: `${i * 0.2 + 0.8}s`}}>
                <div className={`mb-4 inline-block p-4 bg-gradient-to-br ${step.color} rounded-full shadow-lg transition-all duration-300 hover:scale-110`}>
                  <Icon className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-orange-400 text-2xl animate-pulse">
                    →
                  </div>
                )}
                {/* Step number badge */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-bounce" style={{animationDelay: `${i * 0.5}s`}}>
                  {i + 1}
                </div>
              </div>
            )
          })}
        </div>
      </section>
      
      {/* Services Section */}
      <section ref={servicesRef} id="services" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background decorative elements */}
        <div className={`absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-400/5 to-pink-400/5 rounded-full blur-3xl transition-all duration-1000 ${servicesVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
        <div className={`absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-2xl transition-all duration-1000 delay-200 ${servicesVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
        <div className={`absolute top-1/2 left-0 w-32 h-32 bg-gradient-to-br from-green-400/5 to-teal-400/5 rounded-full blur-xl transition-all duration-1000 delay-400 ${servicesVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>

        <div className={`text-center mb-16 relative z-10 transition-all duration-1000 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 transition-all duration-1000 delay-200 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Hospital className="w-4 h-4 inline mr-2 animate-bounce" />
            Comprehensive Healthcare Solutions
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            Complete <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">Healthcare Platform</span>
          </h2>
          <p className={`text-xl text-muted-foreground max-w-3xl mx-auto transition-all duration-1000 delay-600 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Everything you need to manage your practice efficiently, from patient intake to treatment planning and follow-up care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            { icon: Brain, title: 'AI-Powered Diagnostics', desc: 'Advanced machine learning algorithms provide diagnostic assistance with 99.7% accuracy. Get instant second opinions and treatment recommendations.', color: 'from-blue-500/20 to-blue-600/20' },
            { icon: Users, title: 'Smart Patient Management', desc: 'Comprehensive EHR system with intelligent scheduling, automated reminders, and predictive analytics for patient no-shows.', color: 'from-green-500/20 to-green-600/20' },
            { icon: Pill, title: 'Intelligent Prescription System', desc: 'Digital prescriptions with real-time drug interaction checking, allergy alerts, and formulary compliance.', color: 'from-purple-500/20 to-purple-600/20' },
            { icon: TrendingUp, title: 'Advanced Analytics Dashboard', desc: 'Real-time insights into practice performance, patient outcomes, and operational efficiency.', color: 'from-orange-500/20 to-orange-600/20' },
            { icon: Download, title: 'Mobile-First Design', desc: 'Access patient information anywhere with our responsive mobile app. Dictate notes and manage prescriptions on-the-go.', color: 'from-pink-500/20 to-pink-600/20' },
            { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption, multi-factor authentication, and comprehensive audit trails. Fully HIPAA, GDPR, and SOC 2 compliant.', color: 'from-indigo-500/20 to-indigo-600/20' },
            { icon: Video, title: 'Telemedicine Integration', desc: 'Built-in video consultations with secure patient portals. Expand your reach and provide convenient care.', color: 'from-teal-500/20 to-teal-600/20' },
            { icon: Bot, title: 'Automation & AI', desc: 'Automate routine tasks with AI-powered workflows. From appointment scheduling to insurance claims, let our intelligent system handle the busy work.', color: 'from-cyan-500/20 to-cyan-600/20' },
          ].map((service, i) => {
            const Icon = service.icon
            return (
              <div key={i} className={`group p-8 ${isDarkMode ? 'bg-card/50 border border-border hover:border-orange-500/50' : 'bg-card/80 border border-border hover:border-orange-500/50'} rounded-2xl transition-all duration-500 cursor-pointer hover:shadow-lg hover:-translate-y-2 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: `${i * 0.1 + 0.8}s`}}>
                <div className="mb-4 inline-block p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg group-hover:from-orange-500/40 group-hover:to-orange-600/40 transition-all duration-300 relative">
                  <Icon className="w-6 h-6 text-orange-400 group-hover:animate-pulse" />
                  {/* Floating particle effect */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">{service.title}</h3>
                <p className="text-muted-foreground">{service.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Advanced Features Section */}
      <section ref={featuresRef} id="features" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background decorative elements */}
        <div className={`absolute top-12 right-12 w-48 h-48 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl transition-all duration-1000 ${featuresVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
        <div className={`absolute bottom-12 left-12 w-36 h-36 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-2xl transition-all duration-1000 delay-300 ${featuresVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>

        <div className={`text-center mb-16 relative z-10 transition-all duration-1000 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 transition-all duration-1000 delay-200 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Sparkles className="w-4 h-4 inline mr-2 animate-bounce" />
            Advanced Features
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            Built for <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">Modern Healthcare</span>
          </h2>
          <p className={`text-xl text-muted-foreground max-w-3xl mx-auto transition-all duration-1000 delay-600 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Cutting-edge features that set MediTrack+ apart from traditional EHR systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {[
            { icon: Infinity, title: 'Offline Mode', desc: 'Never lose productivity during connectivity issues. Our offline-first architecture ensures you can continue working seamlessly.' },
            { icon: Zap, title: 'Real-Time Sync', desc: 'Instant synchronization across all devices. Changes made on one device appear everywhere in real-time.' },
            { icon: Brain, title: 'AI Assistant', desc: 'Intelligent assistant that learns your preferences and automates routine tasks, freeing you to focus on patient care.' },
            { icon: Cloud, title: 'Cloud-Native', desc: 'Built for the cloud with automatic scaling, disaster recovery, and global accessibility from day one.' },
            { icon: Lock, title: 'Zero-Trust Security', desc: 'Every request is authenticated and authorized. No data leaves our secure perimeter without explicit permission.' },
            { icon: Code, title: 'API-First Design', desc: 'Comprehensive REST APIs allow seamless integration with existing systems, labs, and third-party applications.' },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className={`group p-8 ${isDarkMode ? 'bg-card/50 border border-border hover:border-orange-500/50' : 'bg-card/80 border border-border hover:border-orange-500/50'} rounded-2xl transition-all duration-500 hover:shadow-lg hover:-translate-y-2 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: `${i * 0.15 + 0.8}s`}}>
                <div className="mb-4 inline-block p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full group-hover:from-orange-500/40 group-hover:to-orange-600/40 transition-colors animate-pulse" style={{animationDelay: `${i * 0.2}s`}}>
                  <Icon className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} id="testimonials" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background decorative elements */}
        <div className={`absolute top-8 left-8 w-40 h-40 bg-gradient-to-br from-orange-400/5 to-yellow-400/5 rounded-full blur-2xl transition-all duration-1000 ${testimonialsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
        <div className={`absolute bottom-8 right-8 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-xl transition-all duration-1000 delay-200 ${testimonialsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>

        <div className={`text-center mb-16 relative z-10 transition-all duration-1000 ${testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 transition-all duration-1000 delay-200 ${testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <MessageSquare className="w-4 h-4 inline mr-2 animate-bounce" />
            What Healthcare Professionals Say
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            Trusted by <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">Thousands</span>
          </h2>
          <p className={`text-xl text-muted-foreground max-w-3xl mx-auto transition-all duration-1000 delay-600 ${testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            See what healthcare professionals are saying about MediTrack+ and how it's transforming their practice.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {[
            { name: 'Dr. Sarah Rodriguez', role: 'Chief Medical Officer', company: 'City General Hospital', rating: 5, text: 'MediTrack+ has revolutionized our clinic operations. The AI diagnostics feature has improved our accuracy by 40% and the offline mode ensures we never lose patient data.', avatar: 'SR' },
            { name: 'Dr. Michael Patel', role: 'Director', company: 'Regional Medical Center', rating: 5, text: 'The cost savings alone have been incredible. We\'ve reduced our operational costs by 60% while improving patient satisfaction scores across the board.', avatar: 'MP' },
            { name: 'Dr. Emily Johnson', role: 'Practice Manager', company: 'Family Health Clinic', rating: 5, text: 'The 24/7 support team is exceptional. They\'ve helped us through every step of implementation and continue to provide outstanding service.', avatar: 'EJ' },
          ].map((testimonial, i) => (
            <div key={i} className={`p-8 ${isDarkMode ? 'bg-card/50 border border-border' : 'bg-card/80 border border-border'} rounded-2xl relative overflow-hidden hover:shadow-lg transition-all duration-500 ${testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: `${i * 0.2 + 0.8}s`}}>
              <div className="absolute top-4 left-6 text-4xl text-orange-400/30 font-serif animate-pulse">"</div>
              <div className="flex gap-1 mb-4 pt-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500 animate-pulse" style={{animationDelay: `${j * 0.1}s`}} />
                ))}
              </div>
              <p className={`mb-6 text-muted-foreground leading-relaxed`}>{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce" style={{animationDelay: `${i * 0.3}s`}}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-orange-400">{testimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background decorative elements */}
        <div className={`absolute top-16 left-16 w-32 h-32 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-full blur-xl transition-all duration-1000 ${faqVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
        <div className={`absolute bottom-16 right-16 w-40 h-40 bg-gradient-to-br from-teal-400/5 to-cyan-400/5 rounded-full blur-2xl transition-all duration-1000 delay-300 ${faqVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>

        <div className={`text-center mb-16 relative z-10 transition-all duration-1000 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 transition-all duration-1000 delay-200 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <HelpCircle className="w-4 h-4 inline mr-2 animate-bounce" />
            Frequently Asked Questions
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            Your <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">Questions</span> Answered
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-600 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Everything you need to know about getting started with MediTrack+.
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className={`border ${isDarkMode ? 'border-border bg-card/50' : 'border-border bg-card/80'} rounded-xl overflow-hidden transition-all duration-500 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: `${i * 0.1 + 0.8}s`}}>
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-orange-500/5 transition-colors"
              >
                <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                {expandedFAQ === i ? (
                  <ChevronUp className="w-5 h-5 text-orange-400 flex-shrink-0 animate-bounce" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-orange-400 flex-shrink-0 animate-bounce" />
                )}
              </button>
              {expandedFAQ === i && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background decorative elements */}
        <div className={`absolute top-20 right-20 w-44 h-44 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full blur-3xl transition-all duration-1000 ${contactVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
        <div className={`absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-br from-pink-400/5 to-rose-400/5 rounded-full blur-2xl transition-all duration-1000 delay-400 ${contactVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>

        <div className={`text-center mb-16 relative z-10 transition-all duration-1000 ${contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 transition-all duration-1000 delay-200 ${contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Phone className="w-4 h-4 inline mr-2 animate-bounce" />
            Get In Touch
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            Contact <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">Us</span>
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-600 ${contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Ready to transform your healthcare practice? Get in touch with our team today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-8">
            {[
              { icon: MessageSquare, title: 'Email', content: 'contact@meditrack.com' },
              { icon: Clock, title: 'Phone', content: '+91 7391620584' },
              { icon: Users, title: 'Address', content: '123 Healthcare Ave, Medical District, IND 10001' },
              { icon: Shield, title: 'Support', content: '24/7 Support Available' }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className={`flex items-center gap-6 p-6 ${isDarkMode ? 'bg-card/50 border border-border' : 'bg-card/80 border border-border'} rounded-xl transition-all duration-500 hover:shadow-lg ${contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: `${i * 0.15 + 0.8}s`}}>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: `${i * 0.2}s`}}>
                    <Icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={`p-8 ${isDarkMode ? 'bg-card/50 border border-border' : 'bg-card/80 border border-border'} rounded-xl transition-all duration-1000 ${contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '1.2s'}}>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className={`w-full p-3 ${isDarkMode ? 'bg-background border-border' : 'bg-background border-border'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300`}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className={`w-full p-3 ${isDarkMode ? 'bg-background border-border' : 'bg-background border-border'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300`}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  className={`w-full p-3 ${isDarkMode ? 'bg-background border-border' : 'bg-background border-border'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300`}
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className={`w-full p-3 ${isDarkMode ? 'bg-background border-border' : 'bg-background border-border'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300`}
                  placeholder="Tell us about your healthcare needs..."
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} h-12 text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className={`${isDarkMode ? 'bg-background' : 'bg-background'} rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-border`}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your message! Our team has received it and will contact you shortly.
            </p>
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className={`bg-gradient-to-r ${colorClasses.primary} px-6`}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-background via-background to-background/95' : 'bg-gradient-to-br from-background via-background to-background/95'} backdrop-blur-xl rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-border/50 shadow-2xl`}>
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                    Meet Our Team
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    The brilliant minds behind MediTrack+ - passionate innovators revolutionizing healthcare technology
                  </p>
                </div>
                <button 
                  onClick={() => setShowTeamModal(false)}
                  className="p-2 hover:bg-orange-500/10 rounded-xl transition-colors group"
                >
                  <X className="w-6 h-6 group-hover:text-orange-400 transition-colors" />
                </button>
              </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {TEAM_MEMBERS.map((member, i) => {
                const IconComponent = member.icon;
                return (
                  <div key={i} className="group relative">
                    <div className={`${isDarkMode ? 'bg-card/60 border border-border/50' : 'bg-card/80 border border-border/50'} backdrop-blur-sm rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1`}>
                      {/* Avatar/Icon Container */}
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                            <IconComponent className="w-10 h-10 text-orange-500 group-hover:text-orange-600 transition-colors" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        {/* Name and Role */}
                        <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium px-3 py-1 bg-orange-500/10 rounded-full">
                          {member.role}
                        </p>

                        {/* Decorative element */}
                        <div className="mt-4 w-12 h-1 bg-gradient-to-r from-orange-500/50 to-orange-600/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Section */}
            <div className="relative">
              <div className={`p-8 ${isDarkMode ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10' : 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10'} rounded-2xl border border-orange-500/20`}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                  <p className={`text-muted-foreground leading-relaxed max-w-3xl mx-auto ${isDarkMode ? 'text-foreground/90' : 'text-foreground/90'}`}>
                    We're a dedicated team of healthcare technology enthusiasts committed to building innovative solutions that empower medical professionals and improve patient outcomes. Together, we're shaping the future of healthcare management through cutting-edge technology and compassionate design.
                  </p>
                </div>
              </div>

              {/* Decorative background elements */}
              <div className="absolute top-4 left-4 w-20 h-20 bg-orange-500/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-orange-600/5 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      )}
    </div>

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
            © 2026 Gaming Network Studio Media Group. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowTeamModal(true)}
              className="text-sm text-muted-foreground hover:text-orange-400 transition-colors"
            >
              Made By Group-1
            </button>
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
    </>
  )
}
