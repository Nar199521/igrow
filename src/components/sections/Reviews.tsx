
"use client"

import React from 'react'
import { Reveal } from '@/components/ui/reveal'
import { Star, Quote, CheckCircle2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const REVIEWS = [
  {
    name: "Aman Sharma",
    role: "Prop Trader",
    text: "The institutional reasoning taught at iGrow is a game changer. I've completely shifted my perspective on liquidity.",
    rating: 5,
    initials: "AS"
  },
  {
    name: "Priya V.",
    role: "Swing Trader",
    text: "Best training in the region. The Advanced 2.0 program helped me build a consistent second income stream.",
    rating: 5,
    initials: "PV"
  },
  {
    name: "Rahul Mehta",
    role: "Crypto Enthusiast",
    text: "The support system is incredible. Long-term mentorship isn't just a promise here, it's reality.",
    rating: 5,
    initials: "RM"
  },
  {
    name: "Sanjay K.",
    role: "Full-time Trader",
    text: "Finally a community that understands market logic rather than just following indicators blindly.",
    rating: 5,
    initials: "SK"
  }
]

export function Reviews() {
  return (
    <section className="py-20 md:py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-6xl font-bold font-headline leading-tight">
              Success <span className="text-primary italic">Stories</span>
            </h2>
            <p className="text-foreground/40 max-w-2xl mx-auto text-sm md:text-lg">
              Hear from our students who transformed their trading journey through logic and institutional reasoning.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {REVIEWS.map((review, i) => (
                <CarouselItem key={i} className="pl-4 basis-[85%] md:basis-1/3">
                  <Reveal delay={i * 100} className="h-full">
                    <div className="h-full p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/10 relative group hover:border-primary/50 transition-all duration-500 flex flex-col justify-between">
                      <Quote className="absolute top-4 right-6 md:top-6 md:right-8 h-6 w-6 md:h-8 md:w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                      
                      <div>
                        <div className="flex gap-1 mb-4 md:mb-6">
                          {[...Array(review.rating)].map((_, index) => (
                            <Star key={index} className="h-3 w-3 md:h-4 md:w-4 fill-primary text-primary" />
                          ))}
                        </div>

                        <p className="text-foreground/80 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 italic">
                          "{review.text}"
                        </p>
                      </div>

                      <div className="flex items-center gap-3 md:gap-4">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs md:text-base">
                            {review.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-white text-sm md:text-base flex items-center gap-1">
                            {review.name}
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                          </div>
                          <div className="text-[10px] md:text-xs text-foreground/40 font-medium uppercase tracking-widest">
                            {review.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation for desktop */}
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 bg-white/5 border-white/10 hover:bg-primary hover:text-background transition-colors" />
              <CarouselNext className="-right-12 bg-white/5 border-white/10 hover:bg-primary hover:text-background transition-colors" />
            </div>
            
            {/* Indicator dots for mobile */}
            <div className="flex justify-center gap-2 mt-8 md:hidden">
              {REVIEWS.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
              ))}
            </div>
          </Carousel>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </section>
  )
}
