import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
  QrCode, Mic, RefreshCw, Smartphone, Palette, LayoutTemplate,
  Star, ChevronDown, ChevronRight, Check, ArrowRight,
  MapPin, Clock, Share2, Zap, Shield, Globe
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

// ─── Hero Section ───────────────────────────────────────────────────────────
function HeroSection() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-teal/20 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-brand-blue/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white/90">
              <Zap size={14} className="text-brand-teal-light" />
              Free digital menu — no printing needed
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Create your restaurant's{' '}
              <span className="text-brand-teal-light">digital menu</span>{' '}
              in minutes
            </h1>

            <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl">
              Choose a design, add your menu, publish it, and share one QR code.
              <strong className="text-white"> Update your menu anytime</strong> — your QR stays the same.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-brand-teal text-white font-bold text-base hover:bg-brand-teal-dark transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Create Your Menu Free'}
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => document.querySelector('#templates')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 border border-white/30 text-white font-semibold text-base hover:bg-white/20 transition-all"
              >
                Explore Templates
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-brand-teal-light" /> Free to start</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-brand-teal-light" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-brand-teal-light" /> Live in minutes</span>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
        <ChevronDown size={24} />
      </div>
    </section>
  )
}

function PhoneMockup() {
  return (
    <div className="relative w-64 sm:w-72">
      {/* Phone frame */}
      <div className="relative bg-gray-900 rounded-[40px] p-3 shadow-2xl border border-white/10">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10" />
        {/* Screen */}
        <div className="bg-white rounded-[32px] overflow-hidden" style={{ minHeight: '520px' }}>
          {/* Menu header */}
          <div className="bg-gradient-brand p-5 text-white text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="font-bold text-base">Spice Garden</h3>
            <p className="text-xs text-white/70 mt-0.5">South Indian Cuisine</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-white/60">
              <MapPin size={10} /> Chennai, TN
            </div>
          </div>
          {/* Menu categories */}
          <div className="p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Starters</p>
            {[
              { name: 'Chicken 65', price: '₹160', veg: false, tag: 'Bestseller' },
              { name: 'Paneer Tikka', price: '₹140', veg: true, tag: null },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                    {item.tag && <span className="text-[10px] text-amber-600 font-medium">{item.tag}</span>}
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-teal">{item.price}</span>
              </div>
            ))}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-1">Biryani</p>
            {[
              { name: 'Chicken Biryani', price: '₹200', veg: false, tag: 'Special' },
              { name: 'Veg Biryani', price: '₹150', veg: true, tag: null },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                    {item.tag && <span className="text-[10px] text-amber-600 font-medium">{item.tag}</span>}
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-teal">{item.price}</span>
              </div>
            ))}
          </div>
          {/* QR bottom */}
          <div className="px-4 pb-4 flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <QrCode size={14} className="text-brand-teal" />
              Powered by E-Menu
            </div>
          </div>
        </div>
      </div>

      {/* QR badge */}
      <div className="absolute -right-6 top-1/3 bg-white rounded-2xl p-3 shadow-xl border border-gray-100">
        <div className="grid grid-cols-4 gap-0.5 w-10 h-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`rounded-[1px] ${[0,1,4,6,7,8,9,11,14,15].includes(i) ? 'bg-brand-blue' : 'bg-gray-100'}`} />
          ))}
        </div>
        <p className="text-[9px] text-gray-400 text-center mt-1.5">Scan menu</p>
      </div>

      {/* Update badge */}
      <div className="absolute -left-8 bottom-24 bg-white rounded-2xl px-3.5 py-2.5 shadow-xl border border-gray-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
          <RefreshCw size={13} className="text-green-600" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-800">Live Updated</p>
          <p className="text-[9px] text-gray-400">Just now</p>
        </div>
      </div>
    </div>
  )
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: '01', icon: LayoutTemplate, title: 'Choose a Template', desc: 'Pick from beautiful, professionally designed templates for your restaurant type.' },
    { num: '02', icon: Mic, title: 'Add Your Menu', desc: 'Type or simply speak your items — "Chicken Biryani for ₹180" — and we\'ll organize them.' },
    { num: '03', icon: Palette, title: 'Customize & Preview', desc: 'Apply your branding, colors, and logo. Preview exactly how customers will see it.' },
    { num: '04', icon: QrCode, title: 'Publish & Get QR', desc: 'Hit publish, get your permanent QR code, and print or share it instantly.' },
    { num: '05', icon: RefreshCw, title: 'Update Anytime', desc: 'Change a price? Add a dish? Update in seconds. Your QR code never changes.' },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-tag">How It Works</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-brand-blue">
            From menu to QR in under 5 minutes
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            No technical knowledge needed. If you can type or speak, you can create your digital menu.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-teal via-brand-teal/50 to-brand-blue" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center relative">
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg mb-4">
                  <step.icon size={22} className="text-white" />
                </div>
                <span className="text-xs font-bold text-brand-teal mb-2">{step.num}</span>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Features Section ────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: Mic,
      title: 'Voice Menu Input',
      desc: 'Speak naturally — "I have Chicken Biryani for ₹180, Mutton Biryani for ₹250" — and the system organizes everything for you.',
      badge: 'Key Feature',
      highlight: true,
    },
    {
      icon: RefreshCw,
      title: 'Live Menu Updates',
      desc: 'Update a price, mark an item sold out, or add a special — changes go live instantly without touching your QR code.',
      badge: null,
      highlight: false,
    },
    {
      icon: QrCode,
      title: 'Permanent QR Code',
      desc: 'One QR code forever. Print it once on your table stand, counter, or menu board. Never reprint for menu changes.',
      badge: null,
      highlight: false,
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      desc: 'Your customers view menus on phones. Every template is optimized for fast, beautiful mobile browsing.',
      badge: null,
      highlight: false,
    },
    {
      icon: LayoutTemplate,
      title: 'Beautiful Templates',
      desc: 'Professionally designed templates for restaurants, cafes, bakeries, juice shops, and more.',
      badge: null,
      highlight: false,
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      desc: 'Share your menu link on WhatsApp, Instagram, or any platform. Customers open it instantly — no app needed.',
      badge: null,
      highlight: false,
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      desc: 'Your data is safe. Menus are always available to customers even during peak hours.',
      badge: null,
      highlight: false,
    },
    {
      icon: Globe,
      title: 'No App for Customers',
      desc: 'Customers scan and see your menu in their browser. No downloads, no sign-ups required on their end.',
      badge: null,
      highlight: false,
    },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-tag">Features</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-brand-blue">
            Everything your restaurant needs
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Built for small restaurants, cafes, and food businesses who want a professional digital presence without the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`relative p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                f.highlight
                  ? 'bg-gradient-brand border-transparent text-white shadow-md'
                  : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              {f.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {f.badge}
                </span>
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.highlight ? 'bg-white/20' : 'bg-brand-teal/10'}`}>
                <f.icon size={20} className={f.highlight ? 'text-white' : 'text-brand-teal'} />
              </div>
              <h3 className={`font-bold mb-2 ${f.highlight ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed ${f.highlight ? 'text-white/75' : 'text-gray-500'}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Templates Section ───────────────────────────────────────────────────────
function TemplatesSection() {
  const templates = [
    { name: 'Classic', type: 'Restaurant', style: 'Light', color: '#0f3b68' },
    { name: 'Modern Dark', type: 'Cafe', style: 'Dark', color: '#1a1a2e' },
    { name: 'Fresh & Clean', type: 'Juice Shop', style: 'Light', color: '#0ea5a4' },
    { name: 'Minimal', type: 'Bakery', style: 'Light', color: '#6366f1' },
    { name: 'Bold', type: 'Fast Food', style: 'Dark', color: '#e11d48' },
  ]

  return (
    <section id="templates" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-tag">Templates</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-brand-blue">
            Pick a design you love
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Start with 5 free templates. All templates show your actual menu data — not placeholder content.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {templates.map((t) => (
            <div key={t.name} className="group cursor-pointer">
              {/* Template card mockup */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-brand-teal transition-all shadow-sm group-hover:shadow-lg aspect-[9/16]"
                   style={{ background: t.color }}>
                {/* Mini menu preview */}
                <div className="p-3 h-full flex flex-col">
                  <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2" />
                  <div className="h-2 bg-white/30 rounded w-2/3 mx-auto mb-1" />
                  <div className="h-1.5 bg-white/20 rounded w-1/2 mx-auto mb-4" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between mb-2">
                      <div className="h-1.5 bg-white/30 rounded w-3/5" />
                      <div className="h-1.5 bg-white/40 rounded w-1/4" />
                    </div>
                  ))}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-teal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-brand-teal text-xs font-bold px-3 py-1.5 rounded-full shadow">Preview</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.type} · {t.style}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">100+ templates available on Standard and Premium plans</p>
          <Link to="/signup" className="btn-primary inline-flex">
            Start with Free Templates <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Live Update USP ─────────────────────────────────────────────────────────
function LiveUpdateSection() {
  return (
    <section className="py-24 bg-gradient-brand text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white/90">
              <Zap size={14} className="text-brand-teal-light" /> Core USP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Update your menu anytime.<br />
              <span className="text-brand-teal-light">Your QR stays the same.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Changed a price? Added a new dish? Sold out of something? Update it in seconds.
              Your customers scan the same old QR and see the latest menu — instantly.
            </p>
            <div className="space-y-3">
              {[
                'No reprinting QR codes ever',
                'Price changes go live in seconds',
                'Mark items sold out with one tap',
                'Add seasonal specials anytime',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-teal-light/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-brand-teal-light" />
                  </div>
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual demo */}
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20 space-y-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white/90">Chicken Biryani</p>
              <div className="flex items-center gap-2">
                <span className="line-through text-white/40 text-sm">₹180</span>
                <span className="text-brand-teal-light font-bold text-lg">₹200</span>
              </div>
            </div>
            <div className="border-t border-white/10" />
            <div className="space-y-3">
              <p className="text-sm text-white/60 font-medium">What your customer sees:</p>
              <div className="bg-white rounded-2xl p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">Chicken Biryani</p>
                    <p className="text-xs text-gray-400">Served with raita</p>
                  </div>
                  <span className="text-brand-teal font-bold text-lg">₹200</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-500/20 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-sm text-green-300 font-medium">Live — updated just now</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing Section ─────────────────────────────────────────────────────────
function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'Perfect to get started and see the magic.',
      highlight: false,
      cta: 'Get Started Free',
      features: [
        '5 beautiful templates',
        '1 digital menu',
        'Unlimited menu items',
        'Permanent QR code',
        'Live updates',
        'Mobile-optimized',
        'WhatsApp share',
      ],
    },
    {
      name: 'Standard',
      price: '₹499',
      period: '/month',
      desc: 'For growing restaurants who want more control.',
      highlight: true,
      cta: 'Start Standard',
      badge: 'Most Popular',
      features: [
        'Everything in Free',
        '100+ templates',
        'Multi-page menus',
        'Import existing menu (PDF/Image)',
        'Advanced customization',
        'Multiple menus',
        'Priority support',
      ],
    },
    {
      name: 'Premium',
      price: '₹999',
      period: '/month',
      desc: 'AI-powered tools for a premium experience.',
      highlight: false,
      cta: 'Go Premium',
      features: [
        'Everything in Standard',
        '100+ premium templates',
        'AI menu creation',
        'AI descriptions & translations',
        'AI-assisted custom design',
        'Advanced analytics',
        'Dedicated support',
      ],
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-tag">Pricing</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-brand-blue">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-gradient-brand text-white shadow-2xl scale-105'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-brand-blue'}`}>{plan.price}</span>
                  <span className={`text-sm pb-1 ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? 'bg-white/20' : 'bg-brand-teal/10'}`}>
                      <Check size={10} className={plan.highlight ? 'text-white' : 'text-brand-teal'} />
                    </div>
                    <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`w-full py-3 rounded-xl font-bold text-center text-sm transition-all active:scale-95 ${
                  plan.highlight
                    ? 'bg-white text-brand-teal hover:bg-white/90'
                    : 'bg-brand-teal text-white hover:bg-brand-teal-dark'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Do I need to reprint my QR code if I update my menu?',
      a: 'No! That\'s the core idea. Your QR code points to a stable link, not the actual menu data. When you update prices, add items, or change designs, your customers still scan the same QR and see the latest version automatically.',
    },
    {
      q: 'Do my customers need to install an app?',
      a: 'Not at all. Customers just scan your QR code with their phone camera and the menu opens directly in their browser. No downloads, no sign-ups, no friction.',
    },
    {
      q: 'Can I try it for free?',
      a: 'Yes. The Free plan gives you access to 5 beautiful templates, unlimited menu items, a permanent QR code, and live update capability — completely free, forever.',
    },
    {
      q: 'Can I use voice input to add my menu?',
      a: 'Yes! Just say "Chicken Biryani for 180, Mutton Biryani for 250, Fresh Lime Juice for 60" and the system transcribes, understands, and organizes your items into categories automatically.',
    },
    {
      q: 'Can I import my existing menu?',
      a: 'Yes, on the Standard plan. You can upload a PDF or image of your existing menu and the system will extract and convert it into editable digital data.',
    },
    {
      q: 'What kind of businesses can use E-Menu?',
      a: 'Any food business — restaurants, cafes, bakeries, fast food, juice shops, cloud kitchens, catering, food stalls — basically anything with a menu.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-tag">FAQ</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-brand-blue">Frequently asked questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-brand-teal flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ───────────────────────────────────────────────────────────────
function CTASection() {
  const { isAuthenticated } = useAuthStore()
  return (
    <section className="py-24 bg-gradient-hero text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">
          Your restaurant deserves a<br />
          <span className="text-brand-teal-light">beautiful digital menu</span>
        </h2>
        <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
          Join thousands of restaurants already using E-Menu. Get your digital menu live in under 5 minutes — free, forever.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={isAuthenticated ? '/dashboard' : '/signup'}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-teal text-white font-bold text-base hover:bg-brand-teal-dark shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Create Your Free Menu'} <ArrowRight size={18} />
          </Link>
          <button
            onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/30 text-white font-semibold text-base hover:bg-white/20 transition-all"
          >
            See How It Works
          </button>
        </div>
        <p className="mt-6 text-sm text-white/40">No credit card required · Free forever · Cancel anytime</p>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-brand-blue text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center">
              <QrCode size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl">E-Menu</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <button onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => document.querySelector('#templates')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Templates</button>
            <button onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">FAQ</button>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
          <p className="text-sm text-white/30">© {new Date().getFullYear()} E-Menu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TemplatesSection />
      <LiveUpdateSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
