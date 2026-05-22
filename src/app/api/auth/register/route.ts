import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface User {
  id: string
  email: string
  password: string
  name: string
}

// In-memory user storage (in production, use a database)
let users: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User'
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 }
      )
    }

    if (users.some(u => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name
    }

    users.push(newUser)

    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
