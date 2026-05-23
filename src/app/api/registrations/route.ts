import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// In-memory storage (in production, use a database)
export let registrations: any[] = []

// Helper to extract plan amount from program string (e.g., "Program - ₹50,000")
function extractPlanAmount(program: string): number {
  const match = program.match(/₹([\d,]+)/)
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10)
  }
  return 0
}

function normalizeReferralCode(code: string) {
  return code.trim().replace(/^IGROW-/, '')
}

function findReferralParent(referralCode: string) {
  const normalizedCode = normalizeReferralCode(referralCode)
  return registrations.find(
    (reg) => reg.id === normalizedCode || `IGROW-${reg.id}` === referralCode
  )
}

function findOpenPosition(startUser: any) {
  const queue = [startUser]

  while (queue.length > 0) {
    const user = queue.shift()!
    if (!user.leftChildId) {
      return { parent: user, side: 'left' as const }
    }
    if (!user.rightChildId) {
      return { parent: user, side: 'right' as const }
    }

    const left = registrations.find((reg) => reg.id === user.leftChildId)
    const right = registrations.find((reg) => reg.id === user.rightChildId)
    if (left) queue.push(left)
    if (right) queue.push(right)
  }

  return null
}

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
    if (registrations.some((reg) => reg.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const planAmount = extractPlanAmount(program)

    const registration = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      address,
      program,
      planAmount,
      referralName: referralName || '',
      referralCode: referralCode || '',
      password, // Store password (in production, hash it!)
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      approvedAt: null,
      rejectionReason: '',
      parentId: '',
      side: '',
      leftChildId: '',
      rightChildId: ''
    }

    registrations.push(registration)

    return NextResponse.json(
      {
        message: 'Registration successful! Awaiting admin approval.',
        registration: {
          id: registration.id,
          name: registration.name,
          email: registration.email,
          date: registration.date,
          status: registration.status
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
      total: registrations.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
