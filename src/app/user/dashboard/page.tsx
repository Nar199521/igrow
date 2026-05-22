"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, User, Loader } from 'lucide-react'

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080a] text-white flex items-center justify-center">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06080a] to-[#0a0c0e] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              My Dashboard
            </h1>
            <p className="text-foreground/60 mt-2">Welcome, {user?.name}!</p>
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

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-primary">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold">Name</p>
                <p className="text-lg font-semibold mt-1">{user?.name}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold">Email</p>
                <p className="text-lg font-semibold mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold">User ID</p>
                <p className="text-lg font-semibold mt-1 font-mono text-primary">{user?.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-primary">Account Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold">Account Type</p>
                <p className="text-lg font-semibold mt-1 text-green-400">Premium Member</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold">Status</p>
                <p className="text-lg font-semibold mt-1 text-green-400">Active</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm uppercase tracking-wider font-bold">Access Level</p>
                <p className="text-lg font-semibold mt-1">Full Access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-primary">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 py-6 rounded-xl font-bold">
              View Registrations
            </Button>
            <Button className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 py-6 rounded-xl font-bold">
              Referral Program
            </Button>
            <Button className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 py-6 rounded-xl font-bold">
              Settings
            </Button>
          </div>
        </div>

        {/* Admin Access */}
        <div className="mt-6 p-6 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-2xl text-center">
          <p className="text-foreground/80 mb-4">Are you an admin?</p>
          <Button
            onClick={() => router.push('/admin')}
            className="bg-primary text-background hover:bg-primary/90 px-8 py-3 rounded-xl font-bold"
          >
            Go to Admin Panel
          </Button>
        </div>
      </div>
    </div>
  )
}
