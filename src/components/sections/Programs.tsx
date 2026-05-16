"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, TrendingUp, ShieldCheck, Zap, Rocket, Trophy, Briefcase } from 'lucide-react'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Reveal } from '@/components/ui/reveal'
import { EnrollModal } from '@/components/modals/EnrollModal'

const PROGRAMS = [
  {
    name: "Basic Program",
    price: "₹11,000",
    duration: "12 Months",
    bonus: "+ 50 USDT Copy Trading Account",
    tagline: "Foundations of Trading",
    icon: ShieldCheck,
    features: ["Core Market Concepts", "Technical Analysis Intro", "Risk Management 101", "Group Support"],
    color: "primary",
    image: "program-basic"
  },
  {
    name: "Advanced Program",
    price: "₹21,000",
    duration: "18 Months",
    bonus: "+ 100 USDT Copy Trading Account",
    tagline: "Professional Edge",
    icon: Rocket,
    features: ["Complex Chart Patterns", "Live Market Sessions", "Indicator Suite Access", "Trade Audits"],
    color: "primary",
    image: "program-advanced"
  },
  {
    name: "Advanced 2.0",
    price: "₹31,000",
    duration: "24 Months",
    bonus: "+ 150 USDT Copy Trading Account",
    tagline: "Expert Strategies",
    icon: Zap,
    features: ["Institutional Order Flow", "Volume Profile Analysis", "Advanced Psychology", "Mentor Feedback"],
    color: "primary",
    image: "program-advanced"
  },
  {
    name: "Combo Program",
    price: "₹45,000",
    duration: "60 Months",
    bonus: "+ 200 USDT Copy Trading Account",
    tagline: "Elite Mastery",
    icon: Briefcase,
    features: ["Full Curriculum Access", "Portfolio Management", "Wealth Preservation", "Lifetime Access"],
    color: "primary",
    image: "hero-trading"
  },
  {
    name: "Internship",
    price: "₹15,000",
    duration: "Conditions Apply",
    bonus: "Direct Training",
    tagline: "Career Pathway",
    icon: Trophy,
    features: ["Institutional Training", "Live Funding Access", "Direct Mentor Access", "Real-world Project"],
    color: "secondary",
    image: "program-internship"
  }
]

export function Programs() {
  return (
    <section id="programs" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-16 gap-8 text-center md:text-left">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Trophy className="text-primary h-6 w-6" />
                <span className="font-bold uppercase tracking-widest text-xs md:text-sm text-primary">Our Programs</span>
              </div>
              <h2 className="text-3xl md:text-6xl font-bold font-headline leading-tight">
                iGrow Learning <span className="text-primary">Institute.</span>
              </h2>
              <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
                Course & Admission Programs designed to transform your financial future.
              </p>
            </div>
            <Button variant="link" className="text-primary text-lg md:text-xl font-bold group p-0">
              Compare all programs <TrendingUp className="ml-2 group-hover:translate-y-[-2px] transition-transform h-5 w-5" />
            </Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PROGRAMS.map((prog, i) => {
            const Icon = prog.icon
            const placeholder = PlaceHolderImages.find(img => img.id === prog.image)
            
            return (
              <Reveal key={prog.name} delay={i * 100}>
                <Card 
                  className={`group relative h-full overflow-hidden bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-500 rounded-[24px] md:rounded-[32px] flex flex-col`}
                >
                  <div className="relative h-40 md:h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                    {placeholder && (
                      <Image 
                        src={placeholder.imageUrl} 
                        alt={prog.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                        data-ai-hint={placeholder.imageHint}
                      />
                    )}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                      <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30`}>
                        <Icon className={`h-5 w-5 md:h-6 md:w-6 text-primary`} />
                      </div>
                    </div>
                  </div>

                  <CardHeader className="relative z-20 -mt-10 md:-mt-12 space-y-1.5 p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-xl md:text-2xl font-headline font-bold text-white leading-tight">{prog.name}</CardTitle>
                      <div className="text-lg md:text-xl font-bold font-headline text-primary whitespace-nowrap">{prog.price}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm gap-1">
                      <p className="text-foreground/50 font-medium">{prog.tagline}</p>
                      <p className="text-secondary font-bold">{prog.duration}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4 p-5 md:p-6 pt-0 md:pt-0">
                    {prog.bonus && (
                      <div className="p-2.5 md:p-3 rounded-xl bg-primary/10 border border-primary/20 text-[10px] md:text-xs text-primary font-bold text-center">
                        {prog.bonus}
                      </div>
                    )}
                    <div className="space-y-3">
                      {prog.features.map(feat => (
                        <div key={feat} className="flex items-start gap-3 text-foreground/80 text-xs md:text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 md:p-6 pt-0 md:pt-0">
                    <EnrollModal>
                      <Button className={`w-full py-6 md:py-7 rounded-xl md:rounded-2xl text-base md:text-lg font-bold bg-primary text-background transition-transform active:scale-95`}>
                        Enroll Today
                      </Button>
                    </EnrollModal>
                  </CardFooter>

                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
                </Card>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}