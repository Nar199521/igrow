
"use client"

import React, { useState, useEffect } from 'react'
import { 
  Lightbulb, 
  Zap, 
  Shield, 
  TrendingUp, 
  GraduationCap, 
  Users, 
  Briefcase, 
  Bell, 
  Search, 
  LayoutDashboard, 
  Wallet, 
  CreditCard,
  Plus,
  Minus,
  Download,
  Send,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { EnrollModal } from '@/components/modals/EnrollModal'

const BENEFITS = [
  { icon: GraduationCap, text: "Professional Trading Education" },
  { icon: Zap, text: "Live Market Learning" },
  { icon: Smartphone, text: "Copy Trading Setup", hidden: true },
  { icon: Users, text: "Long-term Mentorship" },
  { icon: Briefcase, text: "Career Opportunity" },
  { icon: Bell, text: "Free Signal Guide with Course Duration" },
  { icon: Shield, text: "Professional Education on Market Analysis" }
]

function Smartphone(props: any) {
  return <TrendingUp {...props} />
}

const MINI_CHART_DATA = [
  { v: 10 }, { v: 25 }, { v: 15 }, { v: 45 }, { v: 30 }, { v: 60 }, { v: 55 }, { v: 80 }
]

function PhoneContent({ type = 'main' }: { type?: 'main' | 'chart' }) {
  if (type === 'chart') {
    return (
      <div className="flex-1 bg-[#06080a] p-5 flex flex-col gap-6">
        <div className="flex justify-between items-center text-[8px] font-bold text-foreground/20 uppercase tracking-widest">
          <span>9:41</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-3 h-1.5 bg-foreground/20 rounded-sm" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-white">BTC/USD</div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] font-bold">1H</div>
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">24H</div>
          </div>
        </div>
        <div className="flex-1 -mx-5">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MINI_CHART_DATA}>
                <Area type="monotone" dataKey="v" stroke="#00E676" strokeWidth={2} fill="url(#pGradient)" fillOpacity={0.2} isAnimationActive={false} />
                <defs>
                  <linearGradient id="pGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E676" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#00E676" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
           </ResponsiveContainer>
        </div>
        <div className="flex justify-between gap-2">
          {['1W', '1M', '3M', '1Y', 'ALL'].map(t => (
            <span key={t} className="text-[8px] font-bold text-foreground/40">{t}</span>
          ))}
        </div>
        <div className="mt-auto p-4 rounded-xl bg-primary text-background text-[10px] font-bold text-center uppercase tracking-widest">
          Buy BTC
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#06080a] p-5 flex flex-col gap-5 overflow-hidden relative">
      <div className="flex justify-between items-center text-[8px] font-bold text-foreground/20 uppercase tracking-widest">
        <span>9:41</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-3 h-1.5 bg-foreground/20 rounded-sm" />
        </div>
      </div>

      <div className="flex gap-4 text-[10px] font-bold text-foreground/40">
        <span className="text-white border-b-2 border-primary pb-1">Explore</span>
        <span>Market</span>
        <span>Earn</span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[8px] text-foreground/40 font-bold uppercase tracking-widest">
          Total Balance <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
        <div className="text-2xl font-bold font-headline text-white">$106,924.77 <span className="text-[10px] text-foreground/40 font-normal">USD</span></div>
        <div className="text-[10px] text-primary font-bold">+$52.01 (+0.72%) <span className="text-foreground/20 font-normal ml-1">24H</span></div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Plus, label: 'BUY' },
          { icon: Minus, label: 'SELL' },
          { icon: Download, label: 'DEPOSIT' },
          { icon: Send, label: 'SEND' }
        ].map((btn, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#1da1f2]/20 border border-[#1da1f2]/10 flex items-center justify-center text-[#1da1f2]">
              <btn.icon size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[7px] font-bold text-foreground/40 uppercase tracking-[0.1em]">{btn.label}</span>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-white">Invite and win</div>
          <div className="text-[8px] text-foreground/40 leading-tight max-w-[120px]">Refer a friend and get rewards.</div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 flex items-center justify-center">
          <TrendingUp className="text-[#00E676] h-4 w-4" />
        </div>
      </div>

      <div className="space-y-3">
        {[
          { n: 'Bitcoin', s: 'BTC', p: '$110k', c: '+2.03%' },
          { n: 'Ethereum', s: 'ETH', p: '$2.7k', c: '+5.98%' }
        ].map((c, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5" />
              <div>
                <div className="text-[10px] font-bold text-white">{c.n}</div>
                <div className="text-[8px] text-foreground/40 font-bold uppercase">{c.s}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-white">{c.p}</div>
              <div className="text-[8px] text-primary font-bold">{c.c}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 flex justify-between px-2 opacity-30 border-t border-white/5">
        <LayoutDashboard size={14} />
        <TrendingUp size={14} />
        <Search size={14} />
      </div>

      <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 w-[85%] z-20">
        <div className="bg-[#1da1f2] text-white py-3 rounded-[1.2rem] text-[10px] font-bold text-center shadow-[0_10px_20px_rgba(29,161,242,0.4)] cursor-pointer">
          Buy CRO
        </div>
      </div>
    </div>
  )
}

function MobileMockup({ scrollProgress }: { scrollProgress: number }) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const rotateY = isMobile ? -15 + (scrollProgress * 10) : -25 + (scrollProgress * 15)
  const rotateX = 15
  
  return (
    <div className="relative w-full max-w-[500px] h-[500px] md:h-[650px] mx-auto flex justify-center items-center perspective-[3000px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-40" />

      <div className="relative w-[240px] md:w-[320px] h-[450px] md:h-[600px] transform-gpu preserve-3d">
        <div 
          className="absolute left-[-15%] top-[10%] w-[200px] md:w-[260px] aspect-[9/19] transition-all duration-500 ease-out preserve-3d animate-float"
          style={{ 
            transform: `rotateY(${rotateY + 5}deg) rotateX(${rotateX}deg) translateZ(-80px)`,
          }}
        >
          <div className="absolute inset-0 bg-[#0a0a0a] rounded-[2.5rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-[#1a1a1a] shadow-[-15px_30px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
            <PhoneContent type="chart" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />
          </div>
        </div>

        <div 
          className="absolute left-[15%] top-[5%] w-[220px] md:w-[280px] aspect-[9/19] transition-all duration-500 ease-out preserve-3d animate-float"
          style={{ 
            transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(0)`,
            animationDelay: '1s'
          }}
        >
          <div className="absolute inset-0 bg-[#0a0a0a] rounded-[2.5rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-[#1a1a1a] shadow-[-20px_40px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
            <PhoneContent type="main" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Benefits() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('benefits')
      if (!section) return
      
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="benefits" className="py-20 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center space-y-4 mb-16 md:mb-24">
            <div className="flex items-center gap-2 justify-center">
              <Lightbulb className="text-primary h-6 w-6" />
              <span className="font-bold uppercase tracking-widest text-xs md:text-sm text-primary">Institute Benefits</span>
            </div>
            <h2 className="text-3xl md:text-6xl font-bold font-headline leading-tight">
              More Than Just <span className="text-primary italic">Education.</span>
            </h2>
            <p className="text-foreground/60 text-base md:text-lg max-w-2xl mx-auto">
              Master institutional concepts and gain an edge with an ecosystem designed for high-performance trading.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="hidden lg:flex flex-1 flex-col gap-8">
            {BENEFITS.slice(0, 4).filter(b => !b.hidden).map((benefit, i) => (
              <Reveal key={i} direction="left" delay={i * 100}>
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                    <benefit.icon className="h-6 w-6 text-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{benefit.text}</h3>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold">Verified Program</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex-1 flex justify-center items-center relative min-h-[450px] md:min-h-[650px] w-full">
            <MobileMockup scrollProgress={scrollProgress} />
          </div>

          <div className="hidden lg:flex flex-1 flex-col gap-8 text-right items-end">
            {BENEFITS.slice(4).map((benefit, i) => (
              <Reveal key={i} direction="right" delay={i * 100}>
                <div className="flex items-center flex-row-reverse gap-4 group cursor-default">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                    <benefit.icon className="h-6 w-6 text-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{benefit.text}</h3>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold">Institute Perk</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal direction="right" delay={300}>
              <EnrollModal>
                <Button size="lg" className="bg-primary text-background hover:bg-primary/90 px-8 py-7 text-lg font-bold rounded-2xl shadow-[0_10px_30px_rgba(0,230,118,0.3)] mt-8">
                  Join Today
                </Button>
              </EnrollModal>
            </Reveal>
          </div>

          <div className="lg:hidden grid sm:grid-cols-2 gap-4 w-full">
            {BENEFITS.filter(b => !b.hidden).map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{benefit.text}</span>
              </div>
            ))}
            <EnrollModal>
              <Button size="lg" className="sm:col-span-2 bg-primary text-background py-6 text-lg font-bold rounded-2xl mt-6">
                Claim All Benefits
              </Button>
            </EnrollModal>
          </div>
        </div>
      </div>
    </section>
  )
}
