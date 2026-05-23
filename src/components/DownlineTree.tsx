'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface DownlineNode {
  id: string
  name: string
  email: string
  status: string
  planAmount: number
  joinDate: string
  left: DownlineNode | null
  right: DownlineNode | null
}

interface DownlineTreeProps {
  data: DownlineNode | null
  stats: {
    totalMembers: number
    totalRevenue: number
    levels: number
  } | null
}

function NodeCard({ node }: { node: DownlineNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-white">{node.name}</span>
        <span className="text-xs text-foreground/50">{node.email}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-green-400 font-semibold">₹{node.planAmount.toLocaleString()}</span>
        <span className={`text-[11px] px-2 py-1 rounded-full ${
          node.status === 'approved'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {node.status}
        </span>
      </div>
      <p className="mt-3 text-[11px] text-foreground/50">Joined {new Date(node.joinDate).toLocaleDateString()}</p>
    </div>
  )
}

function TreeNode({ node }: { node: DownlineNode }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.left || node.right

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary hover:text-primary/80 flex-shrink-0"
            aria-label={expanded ? 'Collapse tree' : 'Expand tree'}
          >
            {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        ) : (
          <div className="w-5" />
        )}
        <NodeCard node={node} />
      </div>

      {expanded && hasChildren && (
        <div className="grid gap-4 md:grid-cols-2 md:pl-8">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-foreground/60">Left Leg</div>
            {node.left ? <TreeNode node={node.left} /> : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-foreground/50">
                No left referral yet
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-foreground/60">Right Leg</div>
            {node.right ? <TreeNode node={node.right} /> : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-foreground/50">
                No right referral yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DownlineTree({ data, stats }: DownlineTreeProps) {
  if (!data) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-foreground/60">
        No downline data available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-foreground/60 text-xs uppercase tracking-wider font-bold mb-2">
              Total Members
            </p>
            <p className="text-2xl font-bold text-primary">{stats.totalMembers}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-foreground/60 text-xs uppercase tracking-wider font-bold mb-2">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-green-400">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-foreground/60 text-xs uppercase tracking-wider font-bold mb-2">
              Network Levels
            </p>
            <p className="text-2xl font-bold text-primary">{stats.levels}</p>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-x-auto">
        <h3 className="text-lg font-bold mb-4 text-white">Your Downline Network</h3>
        <TreeNode node={data} />
      </div>
    </div>
  )
}
