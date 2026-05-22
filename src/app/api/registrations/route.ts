import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// In-memory storage (in production, use a database)
let registrations: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      phone,
      email,
      address,
      program,
      referralName,
      referralCode,
      password,
      confirmPassword,
    } = body

    // Validation
    if (!name || !phone || !email || !address || !program || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if email already registered
    if (registrations.some(reg => reg.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const registration = {
      id: Date.now(),
      name,
      phone,
      email,
      address,
      program,
      referralName: referralName || '',
      referralCode: referralCode || '',
      password, // Store password (in production, hash it!)
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    }

    registrations.push(registration)

    return NextResponse.json(
      {
        message: 'Registration successful!',
        registration: {
          id: registration.id,
          name: registration.name,
          email: registration.email,
          date: registration.date
        }
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      registrations,
      total: registrations.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
