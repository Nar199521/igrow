
"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown, Bitcoin, Info, ArrowUpRight, ArrowDownRight, Activity, Wallet, BarChart3, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data configuration
const INITIAL_COINS = [
  { name: 'Bitcoin', symbol: 'BTC', price: 98043.04, change: 1.88, color: '#f7931a', marketCap: '1.9T', volume: '45.2B' },
  { name: 'Ethereum', symbol: 'ETH', price: 2676.97, change: -1.35, color: '#627eea', marketCap: '320B', volume: '15.8B' },
  { name: 'Cronos', symbol: 'CRO', price: 0.12126844, change: 5.33, color: '#002d74', marketCap: '3.1B', volume: '145M' },
  { name: 'XRP', symbol: 'XRP', price: 2.41, change: -0.33, color: '#23292f', marketCap: '120B', volume: '5.1B' },
  { name: 'Solana', symbol: 'SOL', price: 185.22, change: 3.24, color: '#14f195', marketCap: '85B', volume: '6.5B' },
  { name: 'Cardano', symbol: 'ADA', price: 0.65, change: -0.85, color: '#0033ad', marketCap: '22B', volume: '480M' },
]

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/igrow-society"

// Timeframe helper to generate different data shapes
const generateTimeframeData = (base: number, points: number, volatility: number) => {
  let current = base;
  return Array.from({ length: points }, (_, i) => {
    const change = (Math.random() - 0.48) * (base * volatility);
    current += change;
    return {
      time: i,
      value: current,
      formattedValue: `$${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  })
}

const TIMEFRAMES = [
  { label: '1H', points: 30, volatility: 0.002 },
  { label: '24H', points: 50, volatility: 0.005 },
  { label: '1W', points: 70, volatility: 0.01 },
  { label: '1M', points: 100, volatility: 0.02 },
  { label: '1Y', points: 150, volatility: 0.05 },
  { label: 'ALL', points: 200, volatility: 0.1 },
]

function CryptoDetailModal({ coin }: { coin: typeof INITIAL_COINS[0] }) {
  const [activeTimeframe, setActiveTimeframe] = useState('24H')
  const [chartData, setChartData] = useState<any[]>([])
  const [currentPrice, setCurrentPrice] = useState(coin.price)
  const isPositive = coin.change >= 0

  // Generate data when timeframe changes
  useEffect(() => {
    const tf = TIMEFRAMES.find(t => t.label === activeTimeframe) || TIMEFRAMES[1];
    const data = generateTimeframeData(coin.price, tf.points, tf.volatility);
    setChartData(data);
    setCurrentPrice(data[data.length - 1].value);
  }, [activeTimeframe, coin.price])

  // Real-time ticking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const delta = (Math.random() - 0.5) * (prev * 0.001);
        const next = prev + delta;
        setChartData(prevData => {
          if (prevData.length === 0) return prevData;
          const newData = [...prevData.slice(1), { ...prevData[prevData.length-1], value: next }];
          return newData;
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DialogContent className="max-w-4xl bg-[#06080a] border-white/10 text-white rounded-[32px] overflow-hidden p-0">
      <div className="p-8">
        <DialogHeader className="mb-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: coin.color }}
              >
                {coin.symbol === 'BTC' ? <Bitcoin size={32} /> : <span className="font-bold">{coin.symbol[0]}</span>}
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold font-headline leading-none mb-1">{coin.name}</DialogTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/40 font-medium uppercase tracking-widest">{coin.symbol} / USD</span>
                  <div className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-md",
                    isPositive ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
                  )}>
                    Tier 1 Asset
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-headline">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
              <div className={cn(
                "text-sm font-bold flex items-center justify-end gap-1",
                isPositive ? "text-primary" : "text-red-500"
              )}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {coin.change}% (24H)
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="h-[400px] w-full bg-white/[0.02] rounded-[24px] border border-white/5 p-6 relative overflow-hidden group/chart">
              {/* Timeframe Selector */}
              <div className="absolute top-6 left-6 flex gap-1 z-20 bg-background/50 backdrop-blur-sm p-1 rounded-xl border border-white/5">
                {TIMEFRAMES.map(tf => (
                  <button 
                    key={tf.label} 
                    onClick={() => setActiveTimeframe(tf.label)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
                      activeTimeframe === tf.label 
                        ? "bg-primary text-background shadow-lg shadow-primary/20" 
                        : "text-foreground/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Chart Stats Overlay */}
              <div className="absolute top-6 right-6 text-right z-10 pointer-events-none">
                <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/20 mb-1">Current Spread</div>
                <div className="text-xs font-mono text-primary font-bold">0.02%</div>
              </div>
              
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`modalGradient-${coin.symbol}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#00E676' : '#ff4d4d'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isPositive ? '#00E676' : '#ff4d4d'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: isPositive ? '#00E676' : '#ff4d4d' }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Rate']}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={isPositive ? '#00E676' : '#ff4d4d'} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill={`url(#modalGradient-${coin.symbol})`} 
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                  <YAxis 
                    hide 
                    domain={['auto', 'auto']} 
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Bottom Legend */}
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center opacity-40">
                <div className="flex items-center gap-2 text-[8px] font-bold tracking-widest uppercase">
                  <Clock size={10} /> Live Market Execution
                </div>
                <div className="text-[8px] font-bold tracking-widest uppercase">
                  Data latency: 12ms
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors">
                <div className="flex items-center gap-2 text-foreground/40 text-[10px] uppercase font-bold tracking-widest mb-2">
                  <BarChart3 size={12} /> Market Cap
                </div>
                <div className="text-xl font-bold">${coin.marketCap}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors">
                <div className="flex items-center gap-2 text-foreground/40 text-[10px] uppercase font-bold tracking-widest mb-2">
                  <Activity size={12} /> 24h Volume
                </div>
                <div className="text-xl font-bold">${coin.volume}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors">
                <div className="flex items-center gap-2 text-foreground/40 text-[10px] uppercase font-bold tracking-widest mb-2">
                  <Wallet size={12} /> Supply Status
                </div>
                <div className="text-xl font-bold">Stable</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="p-6 rounded-[24px] bg-primary/10 border border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={80} />
              </div>
              <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} /> Intelligence Alpha
              </h4>
              <p className="text-white/70 text-sm leading-relaxed mb-6 relative z-10">
                Current sentiment for {coin.name} is showing institutional accumulation patterns. Buy-side liquidity is increasing at the current level. Reasoning suggests a long-term bullish outlook.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/40 font-bold uppercase tracking-wider">Risk Level</span>
                  <span className="text-primary font-bold">LOW</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[20%] h-full bg-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button asChild className="w-full bg-primary text-background hover:bg-primary/90 py-8 text-xl font-bold rounded-2xl shadow-[0_10px_30px_rgba(0,230,118,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                  Buy {coin.symbol} Now
                </a>
              </Button>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 py-8 text-xl font-bold rounded-2xl transition-all">
                Add to Watchlist
              </Button>
            </div>
            
            <div className="text-[10px] text-foreground/30 text-center uppercase font-bold tracking-[0.3em] pt-4 animate-pulse">
              SECURE INSTITUTIONAL ACCESS
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

function CryptoCard({ coin }: { coin: typeof INITIAL_COINS[0] }) {
  const [data, setData] = useState<{value: number}[]>([])
  const [currentPrice, setCurrentPrice] = useState(coin.price)
  const [isMounted, setIsMounted] = useState(false)
  const isPositive = coin.change >= 0

  useEffect(() => {
    setIsMounted(true)
    setData(generateTimeframeData(coin.price, 20, 0.002))

    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const delta = (Math.random() - 0.5) * (prev * 0.001)
        const newPrice = prev + delta
        setData(prevData => {
          const newData = [...prevData.slice(1), { value: newPrice }]
          return newData
        })
        return newPrice
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [coin.price])

  if (!isMounted) {
    return (
      <div className="glass-panel p-6 rounded-[32px] border-white/5 h-[380px] animate-pulse bg-white/5" />
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="glass-panel p-6 rounded-[32px] border-white/5 h-full flex flex-col group hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_20px_50px_rgba(0,230,118,0.1)]">
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="text-primary h-6 w-6" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: coin.color }}
            >
              {coin.symbol === 'BTC' ? <Bitcoin size={20} /> : <span className="font-bold">{coin.symbol[0]}</span>}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-none">{coin.name}</h3>
              <span className="text-xs text-foreground/40 font-medium uppercase tracking-wider">{coin.symbol}</span>
            </div>
          </div>

          <div className="h-32 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`cardGradient-${coin.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#14f195' : '#ff4d4d'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPositive ? '#14f195' : '#ff4d4d'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? '#14f195' : '#ff4d4d'} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#cardGradient-${coin.symbol})`} 
                  isAnimationActive={false}
                />
                <YAxis hide domain={['dataMin', 'dataMax']} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white font-headline">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
              <div className={cn(
                "text-sm font-bold flex items-center gap-1",
                isPositive ? "text-green-400" : "text-red-400"
              )}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {coin.change}% <span className="text-foreground/30 font-normal">24H</span>
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
               <Activity className="h-4 w-4 text-foreground/40 group-hover:text-primary" />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <CryptoDetailModal coin={coin} />
    </Dialog>
  )
}

export function CryptoSlider() {
  const [activeTab, setActiveTab] = useState('trending')

  return (
    <section id="markets" className="py-24 relative bg-[#02080a] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Data Node</span>
              </div>
              <h2 className="text-3xl font-bold font-headline text-white">Live Market Feed</h2>
              <p className="text-sm text-foreground/40">Real-time institutional liquidity and positioning data.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
                <Button 
                  onClick={() => setActiveTab('trending')}
                  className={cn(
                    "rounded-full px-6 py-2 h-auto text-xs font-bold transition-all",
                    activeTab === 'trending' 
                      ? "bg-primary text-background shadow-[0_0_20px_rgba(0,230,118,0.3)]" 
                      : "bg-transparent text-foreground/40 hover:text-white"
                  )}
                >
                  <TrendingUp className="mr-2 h-3.5 w-3.5" />
                  Trending
                </Button>
                <Button 
                  onClick={() => setActiveTab('top-movers')}
                  className={cn(
                    "rounded-full px-6 py-2 h-auto text-xs font-bold transition-all",
                    activeTab === 'top-movers' 
                      ? "bg-primary text-background shadow-[0_0_20px_rgba(0,230,118,0.3)]" 
                      : "bg-transparent text-foreground/40 hover:text-white"
                  )}
                >
                  <TrendingDown className="mr-2 h-3.5 w-3.5" />
                  Top Movers
                </Button>
              </div>
              
              <div className="flex gap-2">
                <CarouselPrevious className="static translate-y-0 h-10 w-10 bg-white/5 border-white/10 hover:bg-white/10 text-white" />
                <CarouselNext className="static translate-y-0 h-10 w-10 bg-white/5 border-white/10 hover:bg-white/10 text-white" />
              </div>
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {INITIAL_COINS.map((coin, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4 h-[380px]">
                <CryptoCard coin={coin} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/20">
            <span>Aggregated LP Feed</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Tier 1 Execution</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Zero Latency Node</span>
          </div>
        </div>
      </div>
    </section>
  )
}
