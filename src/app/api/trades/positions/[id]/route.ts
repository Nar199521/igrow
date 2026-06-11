/**
 * POST /api/trades/positions/[id]/close
 * Close a position
 * PUT /api/trades/positions/[id]/update
 * Update stop loss and take profit
 */

import { NextRequest, NextResponse } from 'next/server';
import MT5Bridge from '@/lib/mt5-bridge';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Position ID is required' },
        { status: 400 }
      );
    }

    const bridge = new MT5Bridge();
    const success = await bridge.closePosition(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to close position' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Position ${id} closed successfully`,
    });
  } catch (error) {
    console.error('Error closing position:', error);
    return NextResponse.json(
      {
        error: 'Failed to close position',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { stopLoss, takeProfit } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Position ID is required' },
        { status: 400 }
      );
    }

    if (stopLoss === undefined && takeProfit === undefined) {
      return NextResponse.json(
        { error: 'At least stopLoss or takeProfit must be provided' },
        { status: 400 }
      );
    }

    const bridge = new MT5Bridge();
    const success = await bridge.updatePosition(id, stopLoss, takeProfit);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update position' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Position ${id} updated successfully`,
    });
  } catch (error) {
    console.error('Error updating position:', error);
    return NextResponse.json(
      {
        error: 'Failed to update position',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
