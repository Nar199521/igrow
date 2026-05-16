
"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Rocket, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EnrollModal } from '@/components/modals/EnrollModal'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,230,118,0.5)] transition-shadow">
            <Rocket className="text-background h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            iGrow<span className="text-primary group-hover:text-white">Society</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {['Programs', 'Benefits', 'AI Mentor', 'Markets'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-foreground/70 hover:text-primary transition-colors hover:neon-glow"
            >
              {item}
            </Link>
          ))}
          <EnrollModal>
            <Button className="bg-primary text-background hover:bg-primary/90 rounded-full px-6 font-bold shadow-[0_0_15px_rgba(0,230,118,0.3)]">
              Join Society
            </Button>
          </EnrollModal>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top duration-300">
          {['Programs', 'Benefits', 'AI Mentor', 'Markets'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-xl font-headline font-medium text-foreground/70"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <EnrollModal>
            <Button className="w-full bg-primary text-background py-6 text-lg font-bold">
              Join Society
            </Button>
          </EnrollModal>
        </div>
      )}
    </nav>
  )
}
