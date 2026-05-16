
"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Cpu, Sparkles, Loader2, Rocket, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'
import { EnrollModal } from '@/components/modals/EnrollModal'

export function MentorTool() {
  const [financialGoals, setFinancialGoals] = useState('')
  const [tradingExperience, setTradingExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<{ recommendedProgram: string; justification: string } | null>(null)

  const analyzeInputs = (financialGoals: string, tradingExperience: string) => {
    const normalizedExperience = tradingExperience.toLowerCase()
    const normalizedGoals = financialGoals.toLowerCase()

    if (normalizedExperience.includes('beginner') || normalizedExperience.includes('no experience')) {
      return {
        recommendedProgram: 'Basic',
        justification: 'You are at the beginning of your trading journey, so the Basic program is the best place to build a strong foundation.'
      }
    }

    if (normalizedGoals.includes('income') || normalizedGoals.includes('profit') || normalizedGoals.includes('cash flow')) {
      return {
        recommendedProgram: 'Advanced',
        justification: 'Your goal is income-focused, so Advanced will help you develop more mature trading skills and consistent strategies.'
      }
    }

    if (normalizedGoals.includes('deep') || normalizedGoals.includes('advanced') || normalizedExperience.includes('intermediate')) {
      return {
        recommendedProgram: 'Advanced 2.0',
        justification: 'You already have some experience and are ready for a deeper, more advanced trading curriculum.'
      }
    }

    return {
      recommendedProgram: 'Combo',
      justification: 'Based on your profile, a comprehensive Combo package will give you the most balanced training and support.'
    }
  }

  const handleConsult = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSuggestion(analyzeInputs(financialGoals, tradingExperience))
      setLoading(false)
    }, 500)
  }

  return (
    <section id="ai-mentor" className="py-24 relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col items-center text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI Reasoning Engine</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-headline max-w-3xl leading-[1.1]">
              Find Your Perfect <span className="text-primary italic">Strategy</span>
            </h2>
            <p className="text-foreground/70 max-w-xl text-lg">
              Tell our AI Mentor about your goals and experience, and we'll craft the ideal educational path for your success.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <Reveal direction="left">
            <div className="glass-panel p-8 rounded-[32px] border-primary/20 shadow-[0_0_40px_rgba(0,230,118,0.1)]">
              <form onSubmit={handleConsult} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Financial Goals</Label>
                  <Textarea 
                    placeholder="e.g., I want to build a secondary income stream of $2k/mo through swing trading crypto..."
                    className="bg-white/5 border-white/10 rounded-xl min-h-[120px] focus:ring-primary focus:border-primary"
                    value={financialGoals}
                    onChange={(e) => setFinancialGoals(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white font-medium">Current Experience</Label>
                  <Input 
                    placeholder="e.g., Complete beginner, or 1 year trading stocks basics..."
                    className="bg-white/5 border-white/10 h-14 rounded-xl focus:ring-primary focus:border-primary"
                    value={tradingExperience}
                    onChange={(e) => setTradingExperience(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-background hover:bg-primary/90 py-8 text-xl font-bold rounded-xl shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Analyzing Profile...
                    </>
                  ) : (
                    <>
                      <Cpu className="mr-2 h-6 w-6" />
                      Consult AI Mentor
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative h-full">
              {!suggestion && !loading && (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 border border-dashed border-white/10 rounded-[32px]">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <Rocket className="text-white/20 h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Awaiting Input</h3>
                    <p className="text-foreground/50">Your personalized roadmap will appear here once the analysis is complete.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center space-y-4 rounded-[32px] glass-panel">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="text-primary font-headline animate-pulse">Running reasoning flows...</p>
                </div>
              )}

              {suggestion && !loading && (
                <div className="glass-panel p-8 rounded-[32px] border-secondary/30 animate-in fade-in zoom-in duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                      <Rocket className="text-background h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-secondary text-sm font-bold tracking-widest uppercase">Recommendation</div>
                      <div className="text-3xl font-bold font-headline text-white">{suggestion.recommendedProgram} Program</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Justification</h4>
                      <p className="text-foreground/80 leading-relaxed italic">
                        "{suggestion.justification}"
                      </p>
                    </div>

                    <EnrollModal>
                      <Button className="w-full bg-secondary text-background hover:bg-secondary/90 py-6 text-lg font-bold rounded-xl group">
                        Enroll Now 
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </EnrollModal>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
