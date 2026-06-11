/**
 * GET /api/trades/positions
 * Fetch all open positions
 */

import { NextRequest, NextResponse } from 'next/server';
import MT5Bridge from '@/lib/mt5-bridge';

export async function GET(request: NextRequest) {
  try {
    const bridge = new MT5Bridge();
    const positions = await bridge.getPositions();

    return NextResponse.json({
      success: true,
      positions,
      count: positions.length,
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch positions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
