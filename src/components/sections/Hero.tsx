
"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, TrendingUp, Search, Activity, ArrowUpRight, ArrowDownRight, Globe, Lock } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { EnrollModal } from '@/components/modals/EnrollModal'

const MOCK_CHART_DATA = [
  { value: 98000 }, { value: 102000 }, { value: 101000 }, { value: 104500 }, 
  { value: 103000 }, { value: 108000 }, { value: 106000 }, { value: 112000 }, 
  { value: 109000 }, { value: 115000 }, { value: 114000 }, { value: 118924 }
]

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/igrow-society"

function MockDashboard() {
  return (
    <div className="absolute inset-0 bg-[#06080a] text-white flex flex-col p-4 md:p-6 overflow-hidden rounded-t-[1.5rem] border-b border-white/5">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-primary flex items-center justify-center">
              <Activity size={12} className="text-background" />
            </div>
            <span className="text-primary font-bold text-base md:text-lg tracking-tighter">iGrow<span className="text-white">.trade</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">
            <span className="text-white border-b-2 border-primary pb-1">Analytics</span>
            <span className="hover:text-white transition-colors cursor-pointer">Positions</span>
            <span className="hover:text-white transition-colors cursor-pointer">Flow</span>
            <span className="hover:text-white transition-colors cursor-pointer">Nodes</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-foreground/40">
            <Lock size={10} className="text-primary" />
            SECURE NODE 04
          </div>
          <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-primary text-background text-[9px] md:text-[10px] font-bold shadow-[0_0_15px_rgba(0,230,118,0.4)] transition-all hover:scale-105">Execute</a>
          <div className="h-7 w-7 md:h-9 md:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-tr from-primary to-secondary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-8 flex-1 min-h-0">
        <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-4 md:mb-8 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                <Globe size={10} /> Global Net Equity
              </div>
              <div className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">$118,924.77 <span className="text-xs md:text-sm text-foreground/20 font-normal">USD</span></div>
              <div className="text-[10px] md:text-xs text-primary font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                +$12,044.12 (+11.2%)
              </div>
            </div>
            <div className="flex gap-1 md:gap-2">
              {['1H', '4H', '1D', '1W'].map(t => (
                <button key={t} className={`w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center text-[8px] md:text-[9px] font-bold transition-all ${t === '1D' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-foreground/30 hover:bg-white/10'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 relative mb-4 md:mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00E676" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#dashboardGradient)" 
                  isAnimationActive={false}
                />
                <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[
              { label: 'Market Cap', val: '$2.4T' },
              { label: '24H Volume', val: '$45.2B' },
              { label: 'Dominance', val: '52.4%' }
            ].map(stat => (
              <div key={stat.label} className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[7px] md:text-[9px] text-foreground/40 font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                <div className="text-sm md:text-lg font-bold text-white">{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex col-span-4 flex-col gap-6 border-l border-white/5 pl-8 min-h-0">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
               <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Live Order Flow</div>
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             </div>
             <div className="space-y-2">
               {[
                 { pair: 'BTC/USDT', type: 'BUY', amt: '1.44 BTC', time: 'Just now' },
                 { pair: 'ETH/USDT', type: 'SELL', amt: '12.5 ETH', time: '1s ago' },
                 { pair: 'CRO/USDT', type: 'BUY', amt: '45k CRO', time: '3s ago' },
                 { pair: 'SOL/USDT', type: 'BUY', amt: '212 SOL', time: '5s ago' }
               ].map((order, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-[10px]">
                   <div className="flex items-center gap-3">
                     <div className={`w-1 h-6 rounded-full ${order.type === 'BUY' ? 'bg-primary' : 'bg-red-500'}`} />
                     <div>
                       <div className="font-bold text-white">{order.pair}</div>
                       <div className="text-[8px] text-foreground/30">{order.time}</div>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className={`font-bold ${order.type === 'BUY' ? 'text-primary' : 'text-red-500'}`}>{order.type}</div>
                     <div className="text-foreground/40">{order.amt}</div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="mt-auto p-5 rounded-[2rem] bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <Zap size={40} className="text-primary" />
            </div>
            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Institutional Alpha</div>
            <p className="text-[10px] leading-relaxed text-white/70 font-medium">
              Whale activity detected on Layer 2. Bullish divergence forming on 4H timeframe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const progress = Math.min(scrollY / (viewportHeight * 0.8), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // 3D Side View Transforms
  const rotateX = isMobile ? 15 - (scrollProgress * 15) : 20 - (scrollProgress * 20)
  const rotateY = isMobile ? -10 + (scrollProgress * 10) : -15 + (scrollProgress * 15)
  const scale = isMobile ? 0.7 + (scrollProgress * 0.3) : 0.85 + (scrollProgress * 0.15)
  const translateY = isMobile ? scrollProgress * -20 : scrollProgress * -40

  return (
    <section className="relative min-h-screen pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden flex flex-col items-center">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <div className="space-y-6 md:space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium animate-pulse-slow">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              <span>Next-Gen Trading Academy</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-7xl lg:text-9xl font-bold leading-[0.9] tracking-tight text-white max-w-5xl">
              MASTERY OF THE <span className="text-primary italic">MARKETS.</span>
            </h1>
            
            <p className="text-base md:text-xl lg:text-2xl text-foreground/70 max-w-2xl leading-relaxed">
              iGrow Society bridges the gap between traditional finance and the decentralized future. Experience professional trading education with AI-driven mentorship.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <EnrollModal>
                <Button size="lg" className="bg-primary text-background hover:bg-primary/90 px-8 md:px-12 py-6 md:py-8 text-lg md:text-xl font-bold rounded-2xl w-full sm:w-auto shadow-[0_0_40px_rgba(0,230,118,0.4)] transition-all hover:scale-105 active:scale-95">
                  Join The Society
                </Button>
              </EnrollModal>
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 px-8 md:px-12 py-6 md:py-8 text-lg md:text-xl font-bold rounded-2xl w-full sm:w-auto backdrop-blur-sm">
                View Catalog
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Realistic 3D Laptop Mockup */}
        <div className="w-full max-w-6xl mt-16 md:mt-24 perspective-[3000px] flex justify-center">
          <div 
            className="relative transition-all duration-300 ease-out will-change-transform w-full md:w-[90%] lg:w-full"
            style={{ 
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translateY(${translateY}px)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Laptop Lid (Screen) */}
            <div 
              className="relative rounded-t-[1.5rem] md:rounded-t-[2.5rem] bg-[#0a0a0a] border-x-[6px] md:border-x-[10px] border-t-[6px] md:border-t-[10px] border-[#222] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] md:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden aspect-[16/10]"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.05)'
              }}
            >
              <MockDashboard />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-white/5 pointer-events-none z-30" />
            </div>

            {/* Laptop Base (Body) */}
            <div 
              className="relative h-8 md:h-12 bg-[#1a1a1a] rounded-b-[2rem] md:rounded-b-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col"
              style={{
                transform: 'rotateX(-5deg) translateY(-2px)',
                transformStyle: 'preserve-3d',
                boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1)'
              }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-white/10" />
              <div className="w-20 md:w-32 h-1.5 md:h-2.5 bg-[#0a0a0a] rounded-full mx-auto mt-0.5 shadow-inner" />
            </div>

            {/* Reflection Shadow beneath */}
            <div 
              className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 w-[80%] md:w-[90%] h-16 md:h-20 bg-primary/10 blur-[40px] md:blur-[60px] rounded-full opacity-50"
              style={{ transform: 'translateZ(-100px)' }}
            />
          </div>
        </div>

        {/* Stats Section */}
        <Reveal delay={400}>
          <div className="grid grid-cols-3 gap-6 md:gap-24 pt-20 md:pt-28 max-w-3xl w-full">
            <div className="text-center group cursor-default">
              <div className="text-2xl md:text-5xl font-bold text-white font-headline group-hover:text-primary transition-colors">25k+</div>
              <div className="text-[10px] md:text-base text-foreground/50 uppercase tracking-widest mt-1">Students</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-2xl md:text-5xl font-bold text-white font-headline group-hover:text-primary transition-colors">150+</div>
              <div className="text-[10px] md:text-base text-foreground/50 uppercase tracking-widest mt-1">Strategies</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-2xl md:text-5xl font-bold text-white font-headline group-hover:text-primary transition-colors">98%</div>
              <div className="text-[10px] md:text-base text-foreground/50 uppercase tracking-widest mt-1">Trust Score</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
