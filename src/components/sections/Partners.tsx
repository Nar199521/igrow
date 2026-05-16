
"use client"

import React from 'react'
import { Reveal } from '@/components/ui/reveal'

const PARTNERS = [
  { name: 'Binance', logo: 'B.' },
  { name: 'Bybit', logo: 'BY' },
  { name: 'Crypto.com', logo: 'C.' },
  { name: 'KuCoin', logo: 'K.' },
  { name: 'OKX', logo: 'OX' },
  { name: 'Bitget', logo: 'BG' }
]

export function Partners() {
  return (
    <section className="py-20 border-t border-white/5 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-12">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/20">Institutional Partners & Liquidity</h3>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {PARTNERS.map((partner) => (
                <div key={partner.name} className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xl group-hover:bg-primary/20 group-hover:text-primary transition-all">
                    {partner.logo}
                  </div>
                  <span className="font-headline font-bold text-lg group-hover:text-white transition-colors">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
