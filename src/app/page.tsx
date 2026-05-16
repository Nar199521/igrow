
"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Programs } from '@/components/sections/Programs'
import { MentorTool } from '@/components/sections/MentorTool'
import { Benefits } from '@/components/sections/Benefits'
import { SentimentWidget } from '@/components/sections/SentimentWidget'
import { CryptoSlider } from '@/components/sections/CryptoSlider'
import { Partners } from '@/components/sections/Partners'
import { Reviews } from '@/components/sections/Reviews'
import { Footer } from '@/components/layout/Footer'
import { EnrollModal } from '@/components/modals/EnrollModal'

export default function Home() {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)

  useEffect(() => {
    // Open the popup automatically after a short delay on mount
    const timer = setTimeout(() => {
      setShowWelcomePopup(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      
      {/* Auto-opening Enrollment Modal */}
      <EnrollModal open={showWelcomePopup} onOpenChange={setShowWelcomePopup} />

      <Hero />
      <CryptoSlider />
      
      {/* Live Analysis Section */}
      <SentimentWidget />
      
      {/* Institute Benefits - Below Live Analysis */}
      <Benefits />
      
      <MentorTool />
      <Programs />
      
      {/* New Sections */}
      <Partners />
      <Reviews />
      
      <Footer />
      
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>
    </main>
  )
}
