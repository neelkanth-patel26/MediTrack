'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Menu, X, Heart, Brain, Shield, Users, Star, CheckCircle2,
  TrendingUp, Clock, Award, ArrowRight, MessageSquare, Download, Sparkles,
  Zap, Cloud, Lock, Code, Infinity, Activity, Pill, Stethoscope,
  Video, Bot, ChevronDown, ChevronUp, Facebook, Twitter, Linkedin, Instagram,
  Monitor, Database, Cpu, Palette, Rocket, Hospital, HelpCircle, Phone, Music, Headphones
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { InstallPrompt } from '@/components/PWA/InstallPrompt'

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
  const { color, isDarkMode, getColorValues } = useTheme()
  const colorValues = getColorValues()

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
      <InstallPrompt />
      <div className={`${isDarkMode ? 'bg-background text-foreground' : 'bg-background text-foreground'}`}>

        {/* Floating Animated Glassmorphism Navbar */}
        <nav className={`fixed top-4 left-4 right-4 z-50 backdrop-blur-2xl ${isDarkMode ? 'bg-slate-900/40 border border-white/10' : 'bg-white/40 border border-black/5'} rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out max-w-screen-2xl mx-auto flex flex-col animate-fade-in-down overflow-hidden`}>
          {/* Floating Background Effects */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-orange-500/5 via-transparent to-orange-600/5 animate-pulse"></div>

          <div className="relative w-full h-16 sm:h-20 lg:h-24">
            {/* Mobile Header Layout - 3-Column Grid for perfect centering */}
            <div className="lg:hidden grid grid-cols-3 items-center w-full h-full px-6">
              {/* Left Column - Empty for balance */}
              <div></div>

              {/* Center Column - Branding Logo */}
              <div className="flex justify-center">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className={`w-9 h-9 bg-gradient-to-br ${colorClasses.primary} rounded-xl flex items-center justify-center shadow-lg group-active:scale-95 transition-transform`}>
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent tracking-tighter">
                    MediTrack+
                  </span>
                </Link>
              </div>

              {/* Right Column - Menu Button */}
              <div className="flex justify-end">
                <button
                  className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 active:scale-95 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Desktop View Header Content - Strictly preserved */}
            <div className="hidden lg:flex items-center justify-between w-full h-full px-10 lg:px-12">
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses.primary} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent tracking-tighter leading-none">
                    MediTrack+
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 leading-none mt-1">
                    Precision Healthcare
                  </span>
                </div>
              </Link>

              <div className="flex items-center bg-slate-500/5 dark:bg-white/5 p-1 rounded-2xl border border-white/5">
                {[
                  { label: 'Home', href: '#home' },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Services', href: '#services' },
                  { label: 'Features', href: '#features' },
                  { label: 'Contact', href: '#contact' }
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="relative px-6 py-2.5 font-bold text-sm text-foreground/70 hover:text-orange-500 transition-all duration-300 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 group"
                  >
                    {item.label}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-2xl px-6 font-bold text-foreground/80 hover:text-orange-500 hover:bg-orange-500/5">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className={`bg-gradient-to-r ${colorClasses.primary} rounded-2xl px-8 py-6 text-base font-black shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-300`}>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Content - Premium Slide Down */}
          <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-screen border-t border-border/10' : 'max-h-0'}`}>
            <div className="p-6 space-y-2 bg-background/90 backdrop-blur-3xl rounded-b-[2rem]">
              {[
                { label: 'Home', href: '#home' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Services', href: '#services' },
                { label: 'Features', href: '#features' },
                { label: 'Contact', href: '#contact' }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-4 px-6 text-xl font-bold hover:bg-orange-500/10 hover:text-orange-500 rounded-2xl transition-all duration-300 border border-transparent hover:border-orange-500/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-border/10">
                <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold">Login</Button>
                </Link>
                <Link href="/signup" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button className={`w-full h-14 bg-gradient-to-r ${colorClasses.primary} rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20`}>Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Spacer for floating header - Responsive spacing */}
        <div className="h-20 sm:h-24 lg:h-28"></div>

        {/* Hero Section */}
        <section ref={heroRef} id="home" className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 lg:py-32 overflow-hidden">
          {/* Floating decorative elements - Hide on small mobile to reduce clutter */}
          <div className={`hidden sm:block absolute top-20 left-10 transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Heart className="w-8 h-8 text-orange-400 animate-pulse" />
            </div>
          </div>
          <div className={`hidden sm:block absolute top-32 right-16 transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm rotate-12">
              <Stethoscope className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div className={`hidden sm:block absolute bottom-32 left-16 transition-all duration-1000 delay-400 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="w-14 h-14 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-7 h-7 text-green-400 animate-pulse" />
            </div>
          </div>

          <div className={`text-center relative z-10 transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-6 transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} text-sm sm:text-base`}>
              <Rocket className="w-4 h-4 inline mr-2 animate-bounce" />
              Next-Gen AI Healthcare
            </div>
            <h1 className={`text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight transition-all duration-1000 delay-400 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Transform Your <span className="inline sm:block bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">
                Healthcare Practice
              </span> with AI
            </h1>
            <p className={`mt-6 text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0 transition-all duration-1000 delay-600 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Join thousands of professionals using MediTrack+ for intelligent patient management and AI-powered diagnostics.
            </p>
            <div className={`mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-800 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button className={`w-full sm:w-auto bg-gradient-to-r ${colorClasses.primary} ${colorClasses.primaryHover} h-14 text-lg sm:text-xl px-10 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl`}>
                  Start Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <div className="flex -space-x-3 items-center mt-4 sm:mt-0">
                {[
                  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop"
                ].map((url, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
                    <img src={url} alt={`Doctor ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="ml-4 text-sm font-medium text-muted-foreground">
                  <span className="text-foreground font-bold">500+</span> doctors joined this week
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-12 sm:py-20 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className={`absolute top-8 left-8 w-20 h-20 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-xl transition-all duration-1000 ${statsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>
          <div className={`absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-lg transition-all duration-1000 delay-200 ${statsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></div>

          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {[
                { number: '50K+', label: 'Doctors', icon: Users },
                { number: '99.7%', label: 'Accuracy', icon: Brain },
                { number: '24/7', label: 'Support', icon: Shield },
                { number: '100%', label: 'Secure', icon: CheckCircle2 }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className={`p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-500 rounded-2xl bg-slate-500/5 border border-slate-500/10 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${i * 0.1 + 0.2}s` }}>
                    <div className="w-12 h-12 sm:w-16 h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center group-hover:from-orange-500/40 group-hover:to-orange-600/40 transition-all duration-300">
                      <Icon className="w-6 h-6 sm:w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
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
            <div className="flex justify-center items-center gap-6 sm:gap-12 flex-wrap opacity-60 hover:opacity-80 transition-opacity duration-300">
              <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors duration-300 cursor-pointer">TechCrunch</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors duration-300 cursor-pointer">Forbes</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors duration-300 cursor-pointer">Wired</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors duration-300 cursor-pointer">Verge</span>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} id="how-it-works" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">
          <div className={`text-center mb-12 sm:mb-20 relative z-10 transition-all duration-1000 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 transition-all duration-1000 delay-200 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} text-sm sm:text-base`}>
              <Zap className="w-4 h-4 inline mr-2" />
              Simple Process
            </div>
            <h2 className={`text-3xl sm:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              How <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">MediTrack+</span> Works
            </h2>
            <p className={`text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2 transition-all duration-1000 delay-600 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Get started in minutes with our intuitive platform designed for professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {[
              { icon: Users, title: 'Setup', desc: 'Create your account and configure settings in under 10 mins.', color: 'from-blue-500 to-blue-600' },
              { icon: Shield, title: 'Import', desc: 'Securely sync records via our HIPAA-compliant system.', color: 'from-green-500 to-green-600' },
              { icon: Brain, title: 'Care', desc: 'Leverage AI diagnostics for faster, accurate assessments.', color: 'from-purple-500 to-purple-600' },
              { icon: TrendingUp, title: 'Scale', desc: 'Monitor performance and expand with automated workflows.', color: 'from-orange-500 to-orange-600' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className={`relative p-6 sm:p-8 rounded-3xl ${isDarkMode ? 'bg-card/40 border border-border' : 'bg-white border border-border'} transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${i * 0.1 + 0.6}s` }}>
                  <div className={`mb-6 inline-block p-4 bg-gradient-to-br ${step.color} rounded-2xl shadow-lg transition-all duration-300`}>
                    <Icon className="w-6 h-6 sm:w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                  <div className="absolute top-6 right-6 text-4xl font-bold opacity-5 select-none">
                    0{i + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} id="services" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className={`text-center mb-12 sm:mb-20 relative z-10 transition-all duration-1000 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 text-sm sm:text-base`}>
              <Hospital className="w-4 h-4 inline mr-2" />
              Healthcare Solutions
            </div>
            <h2 className={`text-3xl sm:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Complete <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Healthcare Platform</span>
            </h2>
            <p className={`text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2 transition-all duration-1000 delay-600 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Everything you need to manage your practice efficiently, from patient intake to treatment planning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {[
              { icon: Brain, title: 'AI Diagnostics', desc: 'Assistive ML providing diagnostic insights with high accuracy.', color: 'from-blue-500/20 to-blue-600/20' },
              { icon: Users, title: 'Patient Management', desc: 'Secure EHR system with smart scheduling and analytics.', color: 'from-green-500/20 to-green-600/20' },
              { icon: Pill, title: 'Digital Prescriptions', desc: 'Smart prescribing with real-time interaction and allergy alerts.', color: 'from-purple-500/20 to-purple-600/20' },
              { icon: TrendingUp, title: 'Advanced Analytics', desc: 'Real-time practice performance and patient outcome tracking.', color: 'from-orange-500/20 to-orange-600/20' },
              { icon: Sparkles, title: 'Mobile-First', desc: 'Responsive experience designed for native feel on any device.', color: 'from-pink-500/20 to-pink-600/20' },
              { icon: Shield, title: 'Secure & HIPAA', desc: 'Enterprise security with full compliance and data encryption.', color: 'from-indigo-500/20 to-indigo-600/20' },
              { icon: Video, title: 'Telemedicine', desc: 'Built-in secure video consultations with patient portals.', color: 'from-teal-500/20 to-teal-600/20' },
              { icon: Bot, title: 'Workflow AI', desc: 'Automate scheduling, insurance claims, and routine tasks.', color: 'from-cyan-500/20 to-cyan-600/20' },
            ].map((service, i) => {
              const Icon = service.icon
              return (
                <div key={i} className={`group p-6 sm:p-8 ${isDarkMode ? 'bg-card/40 border border-border hover:border-orange-500/50' : 'bg-white border border-border hover:border-orange-500/50'} rounded-3xl transition-all duration-500 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${i * 0.05 + 0.6}s` }}>
                  <div className="mb-5 inline-block p-4 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-all duration-300">
                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{service.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Advanced Features Section */}
        <section ref={featuresRef} id="features" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">
          <div className={`text-center mb-12 sm:mb-20 relative z-10 transition-all duration-1000 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 text-sm sm:text-base`}>
              <Sparkles className="w-4 h-4 inline mr-2" />
              Cutting-Edge Features
            </div>
            <h2 className={`text-3xl sm:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Built for <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Modern Healthcare</span>
            </h2>
            <p className={`text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2 transition-all duration-1000 delay-600 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Cutting-edge features that set MediTrack+ apart from traditional systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {[
              { icon: Infinity, title: 'Offline Mode', desc: 'Maintain productivity during connectivity issues. Our offline-first tech ensures seamless work.' },
              { icon: Zap, title: 'Real-Time Sync', desc: 'Instant synchronization across devices. Changes appear everywhere in real-time.' },
              { icon: Brain, title: 'AI Assistant', desc: 'Intelligent assistant that learns your workflow and automates routine practice tasks.' },
              { icon: Cloud, title: 'Cloud-Native', desc: 'Built for scale with automatic disaster recovery and global accessibility from day one.' },
              { icon: Lock, title: 'Zero-Trust', desc: 'Every request is authenticated and authorized within our secure perimeter.' },
              { icon: Code, title: 'API-First', desc: 'REST APIs allow seamless integration with existing labs and third-party apps.' },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className={`group p-6 sm:p-8 ${isDarkMode ? 'bg-card/40 border border-border hover:border-orange-500/50' : 'bg-white border border-border hover:border-orange-500/50'} rounded-3xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${i * 0.1 + 0.6}s` }}>
                  <div className="mb-5 inline-block p-4 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-all duration-300">
                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              { name: 'Dr. Sarah Rodriguez', role: 'Chief Medical Officer', company: 'City General Hospital', rating: 5, text: 'MediTrack+ has revolutionized our clinic operations. The AI diagnostics feature has improved our accuracy by 40% and the offline mode ensures we never lose patient data.', avatar: 'SR' },
              { name: 'Dr. Michael Patel', role: 'Director', company: 'Regional Medical Center', rating: 5, text: 'The cost savings alone have been incredible. We\'ve reduced our operational costs by 60% while improving patient satisfaction scores across the board.', avatar: 'MP' },
              { name: 'Dr. Emily Johnson', role: 'Practice Manager', company: 'Family Health Clinic', rating: 5, text: 'The 24/7 support team is exceptional. They\'ve helped us through every step of implementation and continue to provide outstanding service.', avatar: 'EJ' },
            ].map((testimonial, i) => (
              <div key={i} className={`p-8 ${isDarkMode ? 'bg-card/50 border border-border' : 'bg-card/80 border border-border'} rounded-2xl relative overflow-hidden hover:shadow-lg transition-all duration-500 ${testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${i * 0.2 + 0.8}s` }}>
                <div className="absolute top-4 left-6 text-4xl text-orange-400/30 font-serif animate-pulse">"</div>
                <div className="flex gap-1 mb-4 pt-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500 animate-pulse" style={{ animationDelay: `${j * 0.1}s` }} />
                  ))}
                </div>
                <p className={`mb-6 text-muted-foreground leading-relaxed`}>{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce" style={{ animationDelay: `${i * 0.3}s` }}>
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
        <section ref={faqRef} className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className={`text-center mb-12 sm:mb-20 relative z-10 transition-all duration-1000 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className={`inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-medium mb-4 text-sm sm:text-base`}>
              <HelpCircle className="w-4 h-4 inline mr-2" />
              Support & FAQ
            </div>
            <h2 className={`text-3xl sm:text-5xl font-bold mb-4 transition-all duration-1000 delay-400 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Your <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Questions</span> Answered
            </h2>
            <p className={`text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 transition-all duration-1000 delay-600 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Everything you need to know about getting started with MediTrack+.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className={`border ${isDarkMode ? 'border-border bg-card/30' : 'border-border bg-white'} rounded-2xl overflow-hidden transition-all duration-500 ${faqVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${i * 0.05 + 0.6}s` }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full p-5 sm:p-6 text-left flex justify-between items-center hover:bg-orange-500/5 transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-semibold pr-4 leading-snug">{faq.question}</h3>
                  <div className={`p-2 rounded-full transition-all duration-300 ${expandedFAQ === i ? 'bg-orange-500 text-white rotate-180' : 'bg-orange-500/10 text-orange-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedFAQ === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              {[
                { icon: MessageSquare, title: 'Email', content: 'contact@meditrack.com' },
                { icon: Clock, title: 'Phone', content: '+91 7391620584' },
                { icon: Users, title: 'Address', content: '123 Healthcare Ave, Medical District, IND 10001' },
                { icon: Shield, title: 'Support', content: '24/7 Support Available' }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className={`flex items-center gap-6 p-6 ${isDarkMode ? 'bg-card/50 border border-border' : 'bg-card/80 border border-border'} rounded-xl transition-all duration-500 hover:shadow-lg ${contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${i * 0.15 + 0.8}s` }}>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
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

            <div className={`p-8 ${isDarkMode ? 'bg-card/50 border border-border' : 'bg-card/80 border border-border'} rounded-xl transition-all duration-1000 ${contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '1.2s' }}>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
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
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
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
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className={`w-full p-3 ${isDarkMode ? 'bg-background border-border' : 'bg-background border-border'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300`}
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
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
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16">
            {/* Company Info */}
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">MediTrack<span className="text-orange-500">+</span></span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <a href="https://facebook.com/profile.php?id=61554819718152" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-black/20"><Facebook className="w-5 h-5" /></a>
                <a href="https://twitter.com/ReeseWhiteman" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-black/20"><Twitter className="w-5 h-5" /></a>
                <a href="https://linkedin.com/in/gaming-network-studio" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-black/20"><Linkedin className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/unbound.music.official/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-black/20"><Instagram className="w-5 h-5" /></a>
                <a href="https://discord.gg/44KVhEGEUp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#5865F2] transition-all duration-300 shadow-lg shadow-black/20"><MessageSquare className="w-5 h-5" /></a>
              </div>
            </div>

            {/* Quick Links & Partners */}
            <div className="grid grid-cols-2 gap-8 lg:gap-12 sm:col-span-1">
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">Services</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Patient Management', href: '/services/patient-management' },
                    { label: 'Doctor Portal', href: '/services/doctor-portal' },
                    { label: 'Scheduling', href: '/services/appointment-scheduling' },
                    { label: 'Records', href: '/services/medical-records' }
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-slate-400 hover:text-orange-500 transition-colors text-sm font-medium">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">Network</h4>
                <ul className="space-y-4">
                  <li>
                    <a href="https://gnstudioxrage.wixsite.com/gamingnetworkstudio" target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-1">
                      <span className="text-slate-400 group-hover:text-white transition-colors text-sm font-bold">GamingNetworkStudio</span>
                      <span className="text-[10px] text-slate-600 uppercase tracking-widest group-hover:text-orange-500 font-bold">Official Partner</span>
                    </a>
                  </li>
                  { [
                    { label: 'About Us', href: '/company/about-us' },
                    { label: 'Careers', href: '/company/careers' },
                    { label: 'Press', href: '/company/press' },
                    { label: 'Blog', href: '/company/blog' }
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-slate-400 hover:text-orange-500 transition-colors text-sm font-medium">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="space-y-6 text-center md:text-left sm:col-span-1">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Support</h4>
              <ul className="space-y-4">
                <li className="flex items-center justify-center md:justify-start gap-3 text-slate-400 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span>gns.media.group@outlook.com</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3 text-slate-400 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span>Privacy & Security</span>
                </li>
              </ul>
            </div>

            {/* Newsletter / Action */}
            <div className="space-y-6 text-center md:text-left">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Newsletter</h4>
              <p className="text-slate-400 text-sm">Stay updated with healthcare innovations.</p>
              <div className="flex flex-col gap-3">
                <input
                  placeholder="Your email"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11 px-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
                <Button style={{ background: `linear-gradient(135deg, ${colorValues.primary}, ${colorValues.primary}dd)` }} className="text-white h-11 rounded-xl font-bold font-semibold shadow-lg shadow-orange-500/20">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} MediTrack+. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              <button
                onClick={() => setShowTeamModal(true)}
                className="hover:text-orange-400 transition-colors"
              >
                Made By Group-1
              </button>
              <Link href="/company/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/company/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
