/**
 * GET /api/trades/history
 * Fetch trade history
 */

import { NextRequest, NextResponse } from 'next/server';
import MT5Bridge from '@/lib/mt5-bridge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    if (limit < 1 || limit > 500) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 500' },
        { status: 400 }
      );
    }

    const bridge = new MT5Bridge();
    const trades = await bridge.getTradeHistory(limit);

    return NextResponse.json({
      success: true,
      trades,
      count: trades.length,
    });
  } catch (error) {
    console.error('Error fetching trade history:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch trade history',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
