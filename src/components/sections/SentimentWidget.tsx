
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BarChart3, TrendingUp, TrendingDown, Info } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

export function SentimentWidget() {
  const [bullishValue, setBullishValue] = useState(65)

  useEffect(() => {
    const interval = setInterval(() => {
      setBullishValue(prev => {
        const delta = Math.floor(Math.random() * 5) - 2
        return Math.min(Math.max(prev + delta, 30), 85)
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="markets" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-4xl mx-auto glass-panel rounded-[32px] p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="space-y-6 flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 text-primary justify-center md:justify-start">
                  <BarChart3 className="h-6 w-6" />
                  <span className="font-headline font-bold uppercase tracking-widest text-sm">Live Analysis</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-headline leading-tight">
                  Global Market <span className="text-primary">Sentiment</span>
                </h2>
                <p className="text-foreground/70 text-lg">
                  Our proprietary engine analyzes real-time order flow and institutional positioning to give students the edge in every trade.
                </p>
                
                <div className="flex items-center gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-bold">Bullish Bias</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-foreground/40">
                    <TrendingDown className="h-5 w-5" />
                    <span>Bearish Bias</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-primary">Buyers ({bullishValue}%)</span>
                    <span className="text-foreground/40">Sellers ({100 - bullishValue}%)</span>
                  </div>
                  <Progress value={bullishValue} className="h-3 bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Volatility</div>
                    <div className="text-xl font-bold text-white">Low</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Momentum</div>
                    <div className="text-xl font-bold text-white">Rising</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-xs text-secondary leading-relaxed">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>Data refreshed every 60 seconds. Reflects global spot and futures markets combined.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
