import { NextRequest, NextResponse } from 'next/server'
import { registrations } from '../route'

export const dynamic = 'force-dynamic'

type Side = 'left' | 'right'

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
    const current = queue.shift()!
    if (!current.leftChildId) {
      return { parent: current, side: 'left' as Side }
    }
    if (!current.rightChildId) {
      return { parent: current, side: 'right' as Side }
    }

    const left = registrations.find((reg) => reg.id === current.leftChildId)
    const right = registrations.find((reg) => reg.id === current.rightChildId)
    if (left) queue.push(left)
    if (right) queue.push(right)
  }

  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registration = registrations.find((r) => r.id === params.id)

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(registration)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action } = body // 'approve' or 'reject'

    const registration = registrations.find((r) => r.id === params.id)

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      registration.status = 'approved'
      registration.approvedAt = new Date().toISOString()

      if (registration.referralCode) {
        const parent = findReferralParent(registration.referralCode)
        if (parent) {
          const position = findOpenPosition(parent)
          if (position) {
            registration.parentId = position.parent.id
            registration.side = position.side
            if (position.side === 'left') {
              position.parent.leftChildId = registration.id
            } else {
              position.parent.rightChildId = registration.id
            }
          }
        }
      }

      return NextResponse.json({
        message: 'Registration approved successfully',
        registration,
      })
    } else if (action === 'reject') {
      registration.status = 'rejected'
      registration.rejectionReason = body.reason || 'Rejected by admin'

      return NextResponse.json({
        message: 'Registration rejected',
        registration,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
