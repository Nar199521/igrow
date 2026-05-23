import { NextRequest, NextResponse } from 'next/server'
import { registrations } from '../../route'

export const dynamic = 'force-dynamic'

interface DownlineNode {
  id: string
  name: string
  email: string
  status: string
  planAmount: number
  left: DownlineNode | null
  right: DownlineNode | null
  joinDate: string
}

function buildDownlineTree(userId: string, maxDepth: number = 10, currentDepth: number = 0): DownlineNode | null {
  const user = registrations.find((r) => r.id === userId)
  if (!user) return null

  const node: DownlineNode = {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    planAmount: user.planAmount,
    joinDate: user.date,
    left: null,
    right: null,
  }

  if (currentDepth >= maxDepth) {
    return node
  }

  if (user.leftChildId) {
    node.left = buildDownlineTree(user.leftChildId, maxDepth, currentDepth + 1)
  }
  if (user.rightChildId) {
    node.right = buildDownlineTree(user.rightChildId, maxDepth, currentDepth + 1)
  }

  return node
}

function calculateDownlineStats(node: DownlineNode | null) {
  if (!node) return { totalMembers: 0, totalRevenue: 0, levels: 0 }

  let totalMembers = 1
  let totalRevenue = node.planAmount
  let maxDepth = 1

  function traverse(n: DownlineNode | null, depth: number) {
    if (!n) return depth - 1
    maxDepth = Math.max(maxDepth, depth)

    if (n.left) {
      totalMembers++
      totalRevenue += n.left.planAmount
      traverse(n.left, depth + 1)
    }
    if (n.right) {
      totalMembers++
      totalRevenue += n.right.planAmount
      traverse(n.right, depth + 1)
    }
    return maxDepth
  }

  traverse(node, 1)

  return {
    totalMembers,
    totalRevenue,
    levels: maxDepth,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const depth = parseInt(searchParams.get('depth') || '10', 10)

    const user = registrations.find((r) => r.id === params.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const downlineTree = buildDownlineTree(params.id, depth)
    const stats = calculateDownlineStats(downlineTree)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        planAmount: user.planAmount,
        status: user.status,
        joinDate: user.date,
      },
      downline: downlineTree,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
