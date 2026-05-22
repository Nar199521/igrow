"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Rocket, Send, CheckCircle2, Shield, Mail, Phone, MapPin, User, Gift, AlertCircle, Lock } from 'lucide-react'

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/igrow-society"

interface EnrollModalProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EnrollModal({ children, open, onOpenChange }: EnrollModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    program: '',
    referralName: '',
    referralCode: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, program: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validate passwords
    if (!formData.password || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please enter a password' })
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Registration failed' })
      } else {
        setMessage({ type: 'success', text: 'Registration successful! You can now login with your credentials.' })
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          program: '',
          referralName: '',
          referralCode: '',
          password: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          onOpenChange?.(false)
        }, 2000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[95vw] sm:max-w-4xl md:max-w-5xl bg-[#06080a] border-white/10 text-white rounded-[24px] md:rounded-[40px] overflow-hidden p-0 gap-0">
        <div className="grid md:grid-cols-5 h-full max-h-[90vh] md:max-h-[85vh] overflow-hidden">
          {/* Left Sidebar - Desktop Only */}
          <div className="md:col-span-2 bg-primary p-10 md:p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-background/20 backdrop-blur-md flex items-center justify-center mb-8 border border-background/10">
                <Rocket className="h-8 w-8 text-background" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold font-headline text-background mb-6 leading-tight">
                Begin Your Professional Journey
              </h3>
              <ul className="space-y-4">
                {[
                  "Institutional Alpha & Logic",
                  "Direct 1-on-1 Mentorship",
                  "Live Trading Floor Access",
                  "Compound Wealth Strategies"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-background/90 text-sm lg:text-base font-bold">
                    <CheckCircle2 className="h-5 w-5 text-background" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative z-10 mt-12 p-6 rounded-2xl bg-background/10 border border-background/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-background" />
                <span className="text-xs font-black uppercase tracking-widest text-background">Verified Institute</span>
              </div>
              <p className="text-xs text-background/70 leading-relaxed font-medium">Your personal data is protected with institutional-grade AES-256 encryption.</p>
            </div>

            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -ml-24 -mb-24" />
          </div>

          {/* Right Content - Form */}
          <div className="col-span-5 md:col-span-3 p-6 md:p-12 flex flex-col min-h-0 overflow-hidden bg-gradient-to-b from-[#0a0c0e] to-[#06080a]">
            <DialogHeader className="mb-6 md:mb-10 text-left">
              <DialogTitle className="text-2xl md:text-3xl font-bold font-headline text-white">Institute Registration</DialogTitle>
              <DialogDescription className="text-foreground/40 text-sm md:text-base mt-2">
                Join the society of high-performance traders. Complete your application profile below.
              </DialogDescription>
            </DialogHeader>

            <form 
              className="space-y-6 md:space-y-8 flex-1 overflow-y-auto pr-2 md:pr-4 -mr-2 md:-mr-4 custom-scrollbar pb-6 md:pb-10" 
              onSubmit={handleSubmit}
            >
              {message && (
                <Alert className={message.type === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}>
                  <AlertCircle className={`h-4 w-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
                  <AlertDescription className={message.type === 'success' ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40 flex items-center gap-2">
                    <User size={12} className="text-primary" /> Full Name
                  </Label>
                  <Input 
                    placeholder="John Doe" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 md:h-14 text-sm focus:ring-primary focus:border-primary transition-all" 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40 flex items-center gap-2">
                    <Phone size={12} className="text-primary" /> WhatsApp No.
                  </Label>
                  <Input 
                    placeholder="+91 ..." 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 md:h-14 text-sm focus:ring-primary focus:border-primary transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40 flex items-center gap-2">
                  <Mail size={12} className="text-primary" /> Email ID
                </Label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 rounded-xl h-12 md:h-14 text-sm focus:ring-primary focus:border-primary transition-all" 
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40 flex items-center gap-2">
                  <MapPin size={12} className="text-primary" /> Permanent Address
                </Label>
                <Textarea 
                  placeholder="Enter your full residential address..." 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 rounded-xl min-h-[100px] md:min-h-[120px] resize-none text-sm p-4 focus:ring-primary focus:border-primary transition-all" 
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40">Program Interest</Label>
                <Select value={formData.program} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 md:h-14 text-sm focus:ring-primary transition-all">
                    <SelectValue placeholder="Select Desired Program" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-xl">
                    <SelectItem value="Basic Tier (₹11,000)">Basic Tier (₹11,000)</SelectItem>
                    <SelectItem value="Advanced Tier (₹21,000)">Advanced Tier (₹21,000)</SelectItem>
                    <SelectItem value="Advanced 2.0 (₹31,000)">Advanced 2.0 (₹31,000)</SelectItem>
                    <SelectItem value="Combo Mastery (₹45,000)">Combo Mastery (₹45,000)</SelectItem>
                    <SelectItem value="Career Internship (₹15,000)">Career Internship (₹15,000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40 flex items-center gap-2">
                    <Lock size={12} className="text-primary" /> Password
                  </Label>
                  <Input 
                    type="password"
                    placeholder="Enter password (min. 6 characters)" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 md:h-14 text-sm focus:ring-primary focus:border-primary transition-all" 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40 flex items-center gap-2">
                    <Lock size={12} className="text-primary" /> Confirm Password
                  </Label>
                  <Input 
                    type="password"
                    placeholder="Confirm your password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 md:h-14 text-sm focus:ring-primary focus:border-primary transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40 flex items-center gap-2">
                    <Gift size={12} className="text-primary" /> Referral Name (Optional)
                  </Label>
                  <Input 
                    placeholder="Referrer's name" 
                    name="referralName"
                    value={formData.referralName}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 rounded-xl h-12 md:h-14 text-sm focus:ring-primary focus:border-primary transition-all" 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-foreground/40 flex items-center gap-2">
                    <Gift size={12} className="text-primary" /> Referral Code (Optional)
                  </Label>
                  <Input 
                    placeholder="Enter referral code" 
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 rounded-xl h-12 md:h-14 text-sm focus:ring-primary focus:border-primary transition-all" 
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-background hover:bg-primary/90 py-7 md:py-8 text-lg md:text-xl font-black rounded-2xl shadow-[0_15px_40px_rgba(0,230,118,0.2)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] md:text-[12px] uppercase font-black tracking-[0.5em] text-foreground/20">
                  <span className="bg-[#06080a] px-6 italic">OR</span>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full border-green-500/20 text-green-500 hover:bg-green-500/10 py-7 md:py-8 rounded-2xl flex items-center justify-center gap-4 h-auto text-base md:text-lg font-bold transition-all mb-4">
                <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                  <Send className="h-5 w-5 md:h-6 md:w-6" />
                  Connect WhatsApp Channel
                </a>
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}