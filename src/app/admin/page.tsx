"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertCircle, LogOut, Shield, Loader, Check, X, Search, TrendingUp,
  Users, DollarSign, Eye, EyeOff, Activity, Filter, Download
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (isLoggedIn) {
      fetchRegistrations()
    }
  }, [isLoggedIn])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/registrations')
      const data = await response.json()
      setRegistrations(data.registrations || [])
    } catch (err) {
      setError('Failed to fetch registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      })
      
      if (response.ok) {
        setError('')
        await fetchRegistrations()
      } else {
        setError('Failed to approve registration')
      }
    } catch (err) {
      setError('Error approving registration')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason: 'Rejected by admin' })
      })
      
      if (response.ok) {
        setError('')
        await fetchRegistrations()
      } else {
        setError('Failed to reject registration')
      }
    } catch (err) {
      setError('Error rejecting registration')
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true)
      setUsername("")
      setPassword("")
    } else {
      setError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    setPassword("")
    setSearchTerm("")
    setError("")
  }

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      reg.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || reg.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
    totalRevenue: registrations.reduce((sum: number, reg: any) => {
      const priceMatch = reg.program.match(/₹([\d,]+)/)
      const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0
      return sum + price
    }, 0)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06080a] via-[#0a0c0e] to-[#0f1117] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 mb-4 shadow-lg shadow-primary/20">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Admin Panel</h1>
            <p className="text-foreground/60 text-sm">Secure access to registration management</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
            {error && (
              <Alert className="border-red-500/30 bg-red-500/10 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400 text-sm ml-3">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-[0.15em] font-bold text-foreground/70">Username</Label>
              <Input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border border-white/20 rounded-lg h-12 text-sm focus:ring-primary focus:border-primary transition-all placeholder:text-foreground/30"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-[0.15em] font-bold text-foreground/70">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 text-sm focus:ring-primary focus:border-primary transition-all placeholder:text-foreground/30 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/70"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-3 text-base font-bold rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In to Admin
            </Button>

            {/* Demo Info */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-foreground/50 uppercase tracking-[0.1em] font-bold mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs text-foreground/60 bg-black/30 rounded-lg p-4 border border-white/5">
                <div><span className="text-primary font-semibold">Username:</span> admin</div>
                <div><span className="text-primary font-semibold">Password:</span> admin123</div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-foreground/40 mt-6">Unauthorized access is prohibited</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06080a] via-[#0a0c0e] to-[#0f1117] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-foreground/60 text-sm">Manage registrations and monitor platform activity</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-medium px-6 py-2 flex items-center gap-2 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Total Registrations</p>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
            <div className="mt-3 flex gap-3 text-xs">
              <span className="text-green-400"><span className="font-bold">{stats.approved}</span> Approved</span>
              <span className="text-yellow-400"><span className="font-bold">{stats.pending}</span> Pending</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Total Revenue</p>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">₹{(stats.totalRevenue).toLocaleString()}</p>
            <p className="text-xs text-foreground/50 mt-3">From all registrations</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Pending Approvals</p>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">{stats.pending}</p>
            <p className="text-xs text-foreground/50 mt-3">Awaiting review</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Rejection Rate</p>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-orange-400">{stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%</p>
            <p className="text-xs text-foreground/50 mt-3">{stats.rejected} rejected</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <Input
              placeholder="Search by name, email, phone, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-lg h-11 pl-10 text-sm focus:ring-primary focus:border-primary transition-all placeholder:text-foreground/30"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-sm focus:ring-primary focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button
            onClick={fetchRegistrations}
            className="bg-primary hover:bg-primary/90 text-white px-6 rounded-lg font-medium transition-all"
          >
            <Download className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Registrations Table */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader className="h-10 w-10 text-primary animate-spin mx-auto mb-3" />
                <p className="text-foreground/60">Loading registrations...</p>
              </div>
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/70">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/70">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/70">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/70">Program</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/70">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/70">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white group-hover:text-primary transition-colors">{reg.name}</td>
                      <td className="px-6 py-4 text-foreground/70 text-xs font-mono">{reg.email}</td>
                      <td className="px-6 py-4 text-foreground/70 text-sm">{reg.phone}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium border border-primary/30">
                          {reg.program}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-400">
                        {reg.planAmount ? `₹${reg.planAmount.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 text-xs rounded-full font-bold inline-flex items-center gap-1 border ${
                          reg.status === 'approved' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : reg.status === 'rejected' 
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {reg.status === 'approved' && <Check className="w-3 h-3" />}
                          {reg.status === 'rejected' && <X className="w-3 h-3" />}
                          {reg.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                          {reg.status === 'approved' ? 'Approved' : 
                           reg.status === 'rejected' ? 'Rejected' : 
                           'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {reg.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(reg.id)}
                              disabled={actionLoading === reg.id}
                              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              {actionLoading === reg.id ? (
                                <Loader className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(reg.id)}
                              disabled={actionLoading === reg.id}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              {actionLoading === reg.id ? (
                                <Loader className="h-3 w-3 animate-spin" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-foreground/40 text-xs font-medium">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Users className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
                <p className="text-foreground/50">No registrations found</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-foreground/60 text-xs uppercase font-bold">Showing</p>
            <p className="text-white font-bold text-lg mt-1">{filteredRegistrations.length}</p>
            <p className="text-foreground/50 text-xs mt-1">of {registrations.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-foreground/60 text-xs uppercase font-bold">Pending</p>
            <p className="text-yellow-400 font-bold text-lg mt-1">{stats.pending}</p>
            <p className="text-foreground/50 text-xs mt-1">awaiting review</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-foreground/60 text-xs uppercase font-bold">Approved</p>
            <p className="text-green-400 font-bold text-lg mt-1">{stats.approved}</p>
            <p className="text-foreground/50 text-xs mt-1">active accounts</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-foreground/60 text-xs uppercase font-bold">Avg Amount</p>
            <p className="text-primary font-bold text-lg mt-1">₹{filteredRegistrations.length > 0 ? Math.round(filteredRegistrations.reduce((sum: number, reg: any) => {
              const priceMatch = reg.program.match(/₹([\d,]+)/)
              const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0
              return sum + price
            }, 0) / filteredRegistrations.length) : 0}</p>
            <p className="text-foreground/50 text-xs mt-1">per registration</p>
          </div>
        </div>
      </div>
    </div>
  )
}
