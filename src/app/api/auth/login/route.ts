import { NextRequest, NextResponse } from 'next/server'
import { registrations } from '../../registrations/route'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Check against registrations
    const registration = registrations.find(
      r => r.email === email && r.password === password
    )

    if (!registration) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if registration is approved
    if (registration.status === 'pending') {
      return NextResponse.json(
        { error: 'Your registration is pending admin approval. Please check back later.' },
        { status: 403 }
      )
    }

    if (registration.status === 'rejected') {
      return NextResponse.json(
        { error: `Your registration was rejected. Reason: ${registration.rejectionReason}` },
        { status: 403 }
      )
    }

    // Create token
    const token = Buffer.from(`${registration.id}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: registration.id,
        email: registration.email,
        name: registration.name,
        status: registration.status,
        planAmount: registration.planAmount,
        program: registration.program,
        approvedAt: registration.approvedAt
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
