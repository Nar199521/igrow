"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, LogOut, Shield, Loader } from 'lucide-react'
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
  }

  const filteredRegistrations = registrations.filter(reg =>
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.phone.includes(searchTerm) ||
    reg.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalRevenue = filteredRegistrations.reduce((sum: number, reg: any) => {
    const priceMatch = reg.program.match(/₹([\d,]+)/)
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0
    return sum + price
  }, 0)

  const avgRegistration = filteredRegistrations.length > 0 ? Math.round(totalRevenue / filteredRegistrations.length) : 0

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#06080a] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/50 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-headline mb-2">Admin Panel</h1>
            <p className="text-foreground/60 text-sm">Enter your credentials to access registration data</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2.5">
              <Label className="text-[11px] uppercase tracking-[0.2em] font-black text-foreground/60">Username</Label>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-[11px] uppercase tracking-[0.2em] font-black text-foreground/60">Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-background hover:bg-primary/90 py-6 text-lg font-bold rounded-xl shadow-[0_15px_40px_rgba(0,230,118,0.2)] transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Login to Admin Panel
            </Button>

            {/* Demo Credentials Info */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-[11px] text-foreground/50 uppercase tracking-[0.1em] font-bold mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-foreground/60 font-mono bg-black/30 rounded-lg p-3">
                <div><span className="text-primary">Username:</span> admin</div>
                <div><span className="text-primary">Password:</span> admin123</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06080a] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-foreground/60 mt-1">View and manage all user registrations</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/30 text-red-500 hover:bg-red-500/10 flex items-center gap-2 px-6 py-2 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold mb-2">Total Registrations</p>
            <p className="text-3xl font-bold text-primary">{registrations.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold mb-2">With Referrals</p>
            <p className="text-3xl font-bold text-primary">{registrations.filter(r => r.referralCode).length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-primary">₹{(registrations.reduce((sum: number, reg: any) => {
              const priceMatch = reg.program.match(/₹([\d,]+)/)
              const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0
              return sum + price
            }, 0)).toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold mb-2">Avg Registration</p>
            <p className="text-3xl font-bold text-primary">₹{registrations.length > 0 ? Math.round(registrations.reduce((sum: number, reg: any) => {
              const priceMatch = reg.program.match(/₹([\d,]+)/)
              const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0
              return sum + price
            }, 0) / registrations.length).toLocaleString() : 0}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, phone, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <Button
            onClick={fetchRegistrations}
            className="bg-primary text-background hover:bg-primary/90 px-6 rounded-xl font-bold"
          >
            Refresh
          </Button>
        </div>

        {/* Registrations Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">Program</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">Referral Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">Referral Code</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-primary font-bold">#{reg.id}</td>
                        <td className="px-6 py-4 font-medium text-white">{reg.name}</td>
                        <td className="px-6 py-4 text-foreground/80 text-xs">{reg.email}</td>
                        <td className="px-6 py-4 text-foreground/80 text-xs">{reg.phone}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">{reg.program}</span>
                        </td>
                        <td className="px-6 py-4 text-foreground/80">{reg.referralName || "-"}</td>
                        <td className="px-6 py-4">
                          {reg.referralCode ? (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium font-mono">{reg.referralCode}</span>
                          ) : (
                            <span className="text-foreground/40">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-foreground/60 text-xs">{reg.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-foreground/50">
                        No registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 text-center text-sm text-foreground/50">
          Showing {filteredRegistrations.length} of {registrations.length} registrations
        </div>
      </div>
    </div>
  )
}
