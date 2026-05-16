
"use client"

import React from 'react'
import Link from 'next/link'
import { Rocket, Twitter, Instagram, Send, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Rocket className="text-background h-5 w-5" />
              </div>
              <span className="font-headline text-xl font-bold tracking-tight text-white">
                iGrow Society
              </span>
            </Link>
            <p className="text-foreground/50 leading-relaxed">
              Empowering the next generation of digital asset traders through science, reasoning, and institutional knowledge.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-3 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-3 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-3 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                <Send className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Programs</h4>
            <ul className="space-y-4">
              {['Basic Tier', 'Advanced Tier', 'Advanced 2.0', 'Combo Program', 'Internship'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-foreground/50 hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Brand Assets', 'Legal & Privacy', 'Terms'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-foreground/50 hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Newsletter</h4>
            <p className="text-foreground/50 text-sm">Get the weekly alpha report delivered to your inbox.</p>
            <div className="relative group">
              <Input 
                placeholder="Email Address" 
                className="bg-white/5 border-white/10 h-14 rounded-xl pr-14 focus:ring-primary focus:border-primary"
              />
              <Button size="icon" className="absolute right-2 top-2 h-10 w-10 bg-primary text-background rounded-lg group-hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-foreground/30">
          <p>© 2024 iGrow Learning Society. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Risk Disclosure</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
