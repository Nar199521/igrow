"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LogOut, User, Loader, AlertCircle, CheckCircle, Users, TrendingUp,
  Wallet, Gift, Award, FileText, Copy, Check, Home, Plus, ListChecks,
  DollarSign, CreditCard, Bell
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import DownlineTree from '@/components/DownlineTree'

const REFERRAL_LEVELS = [
  { name: 'GROW STAR', threshold: '2.5 Lakh', rate: '3%', label: 'Special Reward' },
  { name: 'GROW SILVER', threshold: '7.5 Lakh', rate: '3%', label: 'Special Reward' },
  { name: 'GROW GOLD', threshold: '15 Lakh', rate: '3%', label: 'Special Reward' },
  { name: 'GROW PEARL', threshold: '25 Lakh', rate: '3%', label: 'Special Reward' },
  { name: 'GROW RUBY', threshold: '40 Lakh', rate: '5%', label: 'Special Reward' },
  { name: 'GROW SAPPHIRE', threshold: '60 Lakh', rate: '5%', label: 'Special Reward' },
  { name: 'GROW DIAMOND', threshold: '80 Lakh', rate: '5%', label: 'Special Reward' },
  { name: 'GROW KOHINOOR', threshold: '1 Crore', rate: '5%', label: 'Special Reward' }
]

const PAYMENT_METHODS = ['Bank Transfer', 'Crypto Wallet', 'UPI']
const CRYPTO_CURRENCIES = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL']

function formatCurrency(value: number) {
  return `₹${value.toLocaleString()}`
}

function flattenDownline(node: any | null): any[] {
  if (!node) return []
  return [node, ...flattenDownline(node.left), ...flattenDownline(node.right)]
}

function countDirectLegs(node: any | null) {
  if (!node) return { left: 0, right: 0 }
  return {
    left: node.left ? flattenDownline(node.left).length : 0,
    right: node.right ? flattenDownline(node.right).length : 0,
  }
}

function calculateDirectCommission(node: any | null) {
  if (!node) return 0
  const direct = [node.left, node.right].filter(Boolean) as any[]
  return direct.reduce((sum, child) => sum + (child.planAmount || 0) * 0.05, 0)
}

function calculateTeamCommission(node: any | null) {
  if (!node) return 0
  return flattenDownline(node)
    .slice(1)
    .reduce((sum, child) => sum + (child.planAmount || 0) * 0.02, 0)
}

const DASHBOARD_SECTIONS = [
  { icon: Home, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
  { icon: Users, label: 'Member', color: 'from-purple-500 to-pink-500' },
  { icon: TrendingUp, label: 'Income', color: 'from-green-500 to-emerald-500' },
  { icon: ListChecks, label: 'Balance Request', color: 'from-orange-500 to-red-500' },
  { icon: CreditCard, label: 'Topup', color: 'from-indigo-500 to-blue-500' },
  { icon: Wallet, label: 'My Wallet', color: 'from-teal-500 to-green-500' }
]

interface DownlineData {
  user: any
  downline: any
  stats: any
}

interface DashboardStats {
  totalEarnings: number
  directMembers: number
  totalMembers: number
  pendingWithdraw: number
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downlineLoading, setDownlineLoading] = useState(false)
  const [referralLink, setReferralLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [downlineData, setDownlineData] = useState<DownlineData | null>(null)
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    directMembers: 0,
    totalMembers: 0,
    pendingWithdraw: 0
  })
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [commissionBalance, setCommissionBalance] = useState<number>(0)
  const [directCommission, setDirectCommission] = useState<number>(0)
  const [teamCommission, setTeamCommission] = useState<number>(0)
  const [balanceRequests, setBalanceRequests] = useState<any[]>([])
  const [balanceRequestAmount, setBalanceRequestAmount] = useState('')
  const [balanceRequestCurrency, setBalanceRequestCurrency] = useState<string>(CRYPTO_CURRENCIES[0])
  const [balanceRequestMethod, setBalanceRequestMethod] = useState<string>(PAYMENT_METHODS[0])
  const [topupAmount, setTopupAmount] = useState('')
  const [topupCurrency, setTopupCurrency] = useState<string>(CRYPTO_CURRENCIES[0])
  const [topupHistory, setTopupHistory] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    const storedWallet = parseFloat(localStorage.getItem('igrowWalletBalance') || '0') || 0
    const storedCommission = parseFloat(localStorage.getItem('igrowCommissionBalance') || '0') || 0
    const storedRequests = JSON.parse(localStorage.getItem('igrowBalanceRequests') || '[]')
    const storedTopups = JSON.parse(localStorage.getItem('igrowTopupHistory') || '[]')

    setWalletBalance(storedWallet)
    setCommissionBalance(storedCommission)
    setBalanceRequests(storedRequests)
    setTopupHistory(storedTopups)
    setLoading(false)

    if (parsedUser.status === 'approved') {
      fetchDownlineData(parsedUser.id)
    }
  }, [router])

  useEffect(() => {
    if (!downlineData) return

    const directLegs = countDirectLegs(downlineData.downline)
    const totalMembers = Math.max(0, downlineData.stats.totalMembers - 1)
    const pendingWithdraw = balanceRequests.reduce((sum, request) => sum + (request.status === 'Pending' ? request.amount : 0), 0)
    const direct = calculateDirectCommission(downlineData.downline)
    const team = calculateTeamCommission(downlineData.downline)

    setStats({
      totalEarnings: direct + team,
      directMembers: directLegs.left + directLegs.right,
      totalMembers,
      pendingWithdraw
    })
    setDirectCommission(direct)
    setTeamCommission(team)
  }, [downlineData, balanceRequests])

  useEffect(() => {
    localStorage.setItem('igrowWalletBalance', walletBalance.toString())
  }, [walletBalance])

  useEffect(() => {
    localStorage.setItem('igrowCommissionBalance', commissionBalance.toString())
  }, [commissionBalance])

  useEffect(() => {
    localStorage.setItem('igrowBalanceRequests', JSON.stringify(balanceRequests))
  }, [balanceRequests])

  useEffect(() => {
    localStorage.setItem('igrowTopupHistory', JSON.stringify(topupHistory))
  }, [topupHistory])

  const fetchDownlineData = async (userId: string) => {
    setDownlineLoading(true)
    try {
      const response = await fetch(`/api/registrations/${userId}/downline`)
      const data = await response.json()
      setDownlineData(data)
    } catch (err) {
      console.error('Failed to fetch downline data', err)
    } finally {
      setDownlineLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const code = `IGROW-${user.id}`
    const name = user.name || ''
    setReferralLink(`${origin}/?referralCode=${encodeURIComponent(code)}&referralName=${encodeURIComponent(name)}`)
  }, [user])

  const handleBalanceRequestSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const amount = parseFloat(balanceRequestAmount)
    if (!amount || amount <= 0) return

    const maxAvailable = walletBalance + commissionBalance
    if (amount > maxAvailable) {
      alert('Request amount exceeds your available balance.')
      return
    }

    const request = {
      id: Date.now().toString(),
      amount,
      currency: balanceRequestCurrency,
      method: balanceRequestMethod,
      status: 'Pending',
      date: new Date().toLocaleDateString()
    }

    setBalanceRequests([request, ...balanceRequests])
    setBalanceRequestAmount('')
    setActiveTab('balance request')
  }

  const handleTopupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const amount = parseFloat(topupAmount)
    if (!amount || amount <= 0) return

    setWalletBalance(walletBalance + amount)
    const newTopup = {
      id: Date.now().toString(),
      amount,
      currency: topupCurrency,
      date: new Date().toLocaleDateString()
    }
    setTopupHistory([newTopup, ...topupHistory])
    setTopupAmount('')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06080a] to-[#0a0c0e] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const isPending = user?.status === 'pending'
  const isApproved = user?.status === 'approved'
  const legCounts = downlineData ? countDirectLegs(downlineData.downline) : { left: 0, right: 0 }
  const totalBalance = walletBalance + commissionBalance

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06080a] via-[#0a0c0e] to-[#0f1117] text-white">
      <div className="flex">
        {/* Modern Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-[#0f1318] to-[#0a0d11] border-r border-white/10 p-6 sticky top-0 h-screen overflow-y-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">IG</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">iGROW</p>
                <p className="text-primary text-xs">Crypto Analysis</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <p className="text-xs text-foreground/60 uppercase tracking-widest mb-1">ID: {user?.id}</p>
            <p className="font-bold text-white text-sm mb-1">{user?.name}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Online
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {DASHBOARD_SECTIONS.map((section, idx) => {
              const Icon = section.icon
              const isActive = activeTab === section.label.toLowerCase()
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(section.label.toLowerCase())}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/30 to-primary/10 text-primary border border-primary/30'
                      : 'text-foreground/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-foreground/60 mt-2">Manage your account and track your earnings</p>
              </div>
              <Button
                onClick={handleLogout}
                className="md:hidden bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Status Alerts */}
            {isPending && (
              <Alert className="mb-6 border-yellow-500/30 bg-yellow-500/10 rounded-xl">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-400 ml-3 text-sm">
                  Your registration is pending admin approval. You'll receive an email once activated.
                </AlertDescription>
              </Alert>
            )}

            {isApproved && (
              <Alert className="mb-6 border-green-500/30 bg-green-500/10 rounded-xl">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400 ml-3 text-sm">
                  ✓ Your account is active! Start enjoying all benefits.
                </AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            {isApproved && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Total Earnings</p>
                    <DollarSign className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-blue-400">₹{stats.totalEarnings?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-foreground/50 mt-2">+5% from referrals</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Direct Members</p>
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-green-400">{stats.directMembers}</p>
                  <p className="text-xs text-foreground/50 mt-2">Active members</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Network Size</p>
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-purple-400">{stats.totalMembers}</p>
                  <p className="text-xs text-foreground/50 mt-2">Total downline</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Pending</p>
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-2xl font-bold text-orange-400">₹{stats.pendingWithdraw?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-foreground/50 mt-2">Withdraw available</p>
                </div>
              </div>
            )}

            {/* Main Content Tabs */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Profile Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Profile Information
                    </h2>
                    <div className="space-y-5">
                      <div className="pb-4 border-b border-white/10">
                        <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold mb-1">Full Name</p>
                        <p className="text-white font-semibold">{user?.name}</p>
                      </div>
                      <div className="pb-4 border-b border-white/10">
                        <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold mb-1">Email Address</p>
                        <p className="text-white font-semibold text-sm">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold mb-1">User ID</p>
                        <p className="text-primary font-mono font-bold">{user?.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Account Status
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold mb-2">Status</p>
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold inline-block ${
                          isApproved
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {isPending ? '⏳ Pending Approval' : '✓ Approved'}
                        </span>
                      </div>
                      {isApproved && user?.program && (
                        <>
                          <div className="pt-4 border-t border-white/10">
                            <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold mb-2">Program</p>
                            <p className="text-white font-semibold">{user.program}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold mb-2">Plan Amount</p>
                            <p className="text-green-400 font-bold text-lg">₹{user.planAmount?.toLocaleString() || '0'}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Referral Section */}
                {isApproved && (
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-3">
                      <Gift className="w-6 h-6 text-primary" />
                      Referral Program
                    </h2>
                    <p className="text-foreground/60 mb-8">Earn 5% commission on all referrals + unlock higher benefits</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-widest text-green-400 font-bold mb-3">Direct Referral Benefit</p>
                        <p className="text-3xl font-bold text-green-400">5%</p>
                        <p className="text-xs text-foreground/60 mt-3">Commission on admission fees</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-3">Level Benefits</p>
                        <p className="text-3xl font-bold text-blue-400">60:40</p>
                        <p className="text-xs text-foreground/60 mt-3">Upline to downline split</p>
                      </div>
                    </div>

                    <div className="bg-[#0a0d11] border border-white/10 rounded-xl p-6 mb-6">
                      <p className="text-sm font-semibold text-white mb-3">Your Referral Code</p>
                      <div className="flex items-center gap-3 p-4 bg-black/40 rounded-lg border border-primary/20">
                        <code className="flex-1 text-primary font-mono text-sm">{`IGROW-${user?.id}`}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`IGROW-${user?.id}`)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-foreground/60" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#0a0d11] border border-white/10 rounded-xl p-6">
                      <p className="text-sm font-semibold text-white mb-4">Referral Link</p>
                      <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-primary/20 mb-4 overflow-auto text-xs break-all text-foreground/70">
                        {referralLink || 'Generating link...'}
                      </div>
                      <button
                        onClick={async () => {
                          if (!referralLink) return
                          await navigator.clipboard.writeText(referralLink)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                        className="w-full px-4 py-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg font-semibold transition-all"
                      >
                        {copied ? '✓ Link Copied!' : '📋 Copy Referral Link'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Referral Levels */}
                {isApproved && (
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                      <Award className="w-6 h-6 text-primary" />
                      Achievement Levels
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {REFERRAL_LEVELS.map((level, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-primary/20 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-bold text-white text-sm">{level.name}</p>
                              <p className="text-xs text-foreground/60 mt-1">{level.threshold} turnover</p>
                            </div>
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold">{level.rate}</span>
                          </div>
                          <p className="text-xs text-foreground/50">{level.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Downline Tree */}
                {isApproved && downlineData && (
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                      <Users className="w-6 h-6 text-primary" />
                      Downline Network
                    </h2>
                    {downlineLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader className="h-8 w-8 text-primary animate-spin" />
                      </div>
                    ) : (
                      <DownlineTree data={downlineData?.downline} stats={downlineData?.stats} />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Member Tab */}
            {activeTab === 'member' && (
              <div className="space-y-8">
                {isApproved ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Left Chain</p>
                        <p className="text-4xl font-bold text-primary">{legCounts.left}</p>
                        <p className="text-foreground/50 text-sm mt-2">Users in your left team</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Right Chain</p>
                        <p className="text-4xl font-bold text-primary">{legCounts.right}</p>
                        <p className="text-foreground/50 text-sm mt-2">Users in your right team</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Total Structure</p>
                        <p className="text-4xl font-bold text-primary">{stats.totalMembers}</p>
                        <p className="text-foreground/50 text-sm mt-2">Total network members</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left">
                        <p className="text-sm uppercase tracking-[0.18em] text-foreground/60 font-bold mb-3">Left Leg Detail</p>
                        {downlineData?.downline?.left ? (
                          <div className="space-y-2">
                            <p className="text-white font-semibold">{downlineData.downline.left.name}</p>
                            <p className="text-foreground/50 text-sm">{downlineData.downline.left.email}</p>
                            <p className="text-green-400 font-semibold">{formatCurrency(downlineData.downline.left.planAmount)}</p>
                          </div>
                        ) : (
                          <p className="text-foreground/50">No left referrals yet.</p>
                        )}
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left">
                        <p className="text-sm uppercase tracking-[0.18em] text-foreground/60 font-bold mb-3">Right Leg Detail</p>
                        {downlineData?.downline?.right ? (
                          <div className="space-y-2">
                            <p className="text-white font-semibold">{downlineData.downline.right.name}</p>
                            <p className="text-foreground/50 text-sm">{downlineData.downline.right.email}</p>
                            <p className="text-green-400 font-semibold">{formatCurrency(downlineData.downline.right.planAmount)}</p>
                          </div>
                        ) : (
                          <p className="text-foreground/50">No right referrals yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                      <h2 className="text-xl font-bold mb-5 text-white">Live Network Preview</h2>
                      {downlineLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader className="h-8 w-8 text-primary animate-spin" />
                        </div>
                      ) : (
                        <DownlineTree data={downlineData?.downline} stats={downlineData?.stats} />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <p className="text-foreground/60 text-lg">Your member tree and left/right structure will appear after approval and referrals are added.</p>
                  </div>
                )}
              </div>
            )}

            {/* Income Tab */}
            {activeTab === 'income' && (
              <div className="space-y-8">
                {isApproved ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Direct Commission</p>
                        <p className="text-4xl font-bold text-green-400">{formatCurrency(directCommission)}</p>
                        <p className="text-foreground/50 text-sm mt-2">From your direct leg referrals</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Team Commission</p>
                        <p className="text-4xl font-bold text-green-400">{formatCurrency(teamCommission)}</p>
                        <p className="text-foreground/50 text-sm mt-2">From wider network activity</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Total Income</p>
                        <p className="text-4xl font-bold text-primary">{formatCurrency(directCommission + teamCommission)}</p>
                        <p className="text-foreground/50 text-sm mt-2">Real-time commission estimate</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <p className="text-sm uppercase tracking-[0.18em] text-foreground/60 font-bold mb-4">Referral Earnings</p>
                        {downlineData ? (
                          <div className="space-y-3 text-sm text-foreground/70">
                            <p><span className="text-white font-semibold">Total team members:</span> {stats.totalMembers}</p>
                            <p><span className="text-white font-semibold">Left chain size:</span> {legCounts.left}</p>
                            <p><span className="text-white font-semibold">Right chain size:</span> {legCounts.right}</p>
                          </div>
                        ) : (
                          <p className="text-foreground/50">No referral data available yet.</p>
                        )}
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <p className="text-sm uppercase tracking-[0.18em] text-foreground/60 font-bold mb-4">Available Wallet</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(totalBalance)}</p>
                        <p className="text-foreground/50 text-sm mt-2">Includes topup and earned commissions</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <p className="text-foreground/60 text-lg">Income details appear after admin approval and your first referrals join the network.</p>
                  </div>
                )}
              </div>
            )}

            {/* Balance Request Tab */}
            {activeTab === 'balance request' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-white">Request Balance</h2>
                    <p className="text-foreground/60 mb-6">Request funds from admin using any supported crypto currency.</p>
                    <form onSubmit={handleBalanceRequestSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.18em] text-foreground/60 font-bold mb-2">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={balanceRequestAmount}
                          onChange={(e) => setBalanceRequestAmount(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#070b11] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-[0.18em] text-foreground/60 font-bold mb-2">Currency</label>
                          <select
                            value={balanceRequestCurrency}
                            onChange={(e) => setBalanceRequestCurrency(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#070b11] px-4 py-3 text-sm text-white"
                          >
                            {CRYPTO_CURRENCIES.map((currency) => (
                              <option key={currency} value={currency}>{currency}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.18em] text-foreground/60 font-bold mb-2">Method</label>
                          <select
                            value={balanceRequestMethod}
                            onChange={(e) => setBalanceRequestMethod(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#070b11] px-4 py-3 text-sm text-white"
                          >
                            {PAYMENT_METHODS.map((method) => (
                              <option key={method} value={method}>{method}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-[#08101a] p-4 text-sm text-foreground/60">
                        Available balance: <span className="text-white font-semibold">{formatCurrency(totalBalance)}</span>
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-background hover:bg-primary/90 transition"
                      >
                        Submit Request
                      </button>
                    </form>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-white">Your Requests</h2>
                    {balanceRequests.length > 0 ? (
                      <div className="space-y-3 text-sm text-foreground/70">
                        {balanceRequests.map((request) => (
                          <div key={request.id} className="rounded-2xl bg-[#0a0f19] border border-white/10 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-white">{formatCurrency(request.amount)} {request.currency}</p>
                              <span className="text-xs uppercase tracking-[0.14em] text-foreground/60">{request.status}</span>
                            </div>
                            <p className="text-foreground/50 text-xs mt-2">{request.method} • {request.date}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground/50 text-sm">No balance requests submitted yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Topup Tab */}
            {activeTab === 'topup' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-white">Wallet Topup</h2>
                    <p className="text-foreground/60 mb-6">Recharge your wallet instantly using supported cryptocurrencies.</p>
                    <form onSubmit={handleTopupSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.18em] text-foreground/60 font-bold mb-2">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#070b11] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.18em] text-foreground/60 font-bold mb-2">Currency</label>
                        <select
                          value={topupCurrency}
                          onChange={(e) => setTopupCurrency(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#070b11] px-4 py-3 text-sm text-white"
                        >
                          {CRYPTO_CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-background hover:bg-primary/90 transition"
                      >
                        Add Funds to Wallet
                      </button>
                    </form>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-white">Topup History</h2>
                    {topupHistory.length > 0 ? (
                      <div className="space-y-3 text-sm text-foreground/70">
                        {topupHistory.map((entry) => (
                          <div key={entry.id} className="rounded-2xl bg-[#0a0f19] border border-white/10 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-white font-semibold">{formatCurrency(entry.amount)} {entry.currency}</p>
                              <span className="text-foreground/50 text-xs">{entry.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground/50 text-sm">No topup history yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* My Wallet Tab */}
            {activeTab === 'my wallet' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Wallet Balance</p>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(walletBalance)}</p>
                    <p className="text-foreground/50 text-sm mt-2">Your spendable balance for topups and transfers.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Commission Balance</p>
                    <p className="text-4xl font-bold text-green-400">{formatCurrency(commissionBalance)}</p>
                    <p className="text-foreground/50 text-sm mt-2">Your earned commissions from referrals.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Total Available</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalBalance)}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Direct Commission</p>
                    <p className="text-3xl font-bold text-green-400">{formatCurrency(directCommission)}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-bold mb-4">Team Commission</p>
                    <p className="text-3xl font-bold text-green-400">{formatCurrency(teamCommission)}</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h2 className="text-lg font-bold mb-4 text-white">Recent Activity</h2>
                  <div className="grid grid-cols-1 gap-3 text-sm text-foreground/70">
                    <div className="rounded-2xl bg-[#0a0f19] border border-white/10 p-4">
                      <p className="text-white font-semibold">Wallet + Commission</p>
                      <p className="text-foreground/50 mt-2">{formatCurrency(totalBalance)} available balance</p>
                    </div>
                    <div className="rounded-2xl bg-[#0a0f19] border border-white/10 p-4">
                      <p className="text-white font-semibold">Pending Withdrawal</p>
                      <p className="text-foreground/50 mt-2">{formatCurrency(stats.pendingWithdraw)} in requests</p>
                    </div>
                    <div className="rounded-2xl bg-[#0a0f19] border border-white/10 p-4">
                      <p className="text-white font-semibold">Direct / Team Members</p>
                      <p className="text-foreground/50 mt-2">{stats.directMembers} direct referrals • {stats.totalMembers} total team</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Access */}
            <div className="mt-12 p-8 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl text-center">
              <Bell className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-foreground/80 mb-4 font-semibold">Admin Access</p>
              <Button
                onClick={() => router.push('/admin')}
                className="bg-primary hover:bg-primary/90 text-background px-8 py-3 rounded-lg font-bold transition-all"
              >
                Go to Admin Panel
              </Button>
            </div>

            <div className="pb-8"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
