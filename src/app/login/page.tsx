"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Lock, Mail, LogIn, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin 
        ? { email, password }
        : { email, password, name }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Authentication failed')
      } else {
        setSuccess(data.message)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setTimeout(() => {
          router.push('/user/dashboard')
        }, 1500)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06080a] to-[#0a0c0e] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/50 mb-4">
            {isLogin ? <LogIn className="h-8 w-8 text-primary" /> : <UserPlus className="h-8 w-8 text-primary" />}
          </div>
          <h1 className="text-3xl font-bold font-headline mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-foreground/60 text-sm">
            {isLogin ? 'Login to your account' : 'Join our trading community'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500 text-sm">{success}</AlertDescription>
            </Alert>
          )}

          {!isLogin && (
            <div className="space-y-2.5">
              <Label className="text-[11px] uppercase tracking-[0.2em] font-black text-foreground/60">Full Name</Label>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
          )}

          <div className="space-y-2.5">
            <Label className="text-[11px] uppercase tracking-[0.2em] font-black text-foreground/60 flex items-center gap-2">
              <Mail size={12} className="text-primary" /> Email
            </Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-[11px] uppercase tracking-[0.2em] font-black text-foreground/60 flex items-center gap-2">
              <Lock size={12} className="text-primary" /> Password
            </Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background hover:bg-primary/90 py-6 text-lg font-bold rounded-xl shadow-[0_15px_40px_rgba(0,230,118,0.2)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase font-black tracking-wider text-foreground/40">
              <span className="bg-white/5 px-4">Or</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            variant="outline"
            className="w-full border-white/20 text-foreground hover:bg-white/5 py-6 rounded-xl text-sm font-bold transition-all"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
          <p className="text-[11px] text-foreground/50 uppercase tracking-[0.1em] font-bold mb-2">Demo Credentials (Login):</p>
          <div className="space-y-1 text-xs text-foreground/60 font-mono">
            <div>Email: <span className="text-primary">user@example.com</span></div>
            <div>Password: <span className="text-primary">password123</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
