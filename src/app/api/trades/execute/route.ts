/**
 * POST /api/trades/execute
 * Execute a trade signal (BUY/SELL)
 */

import { NextRequest, NextResponse } from 'next/server';
import MT5Bridge from '@/lib/mt5-bridge';

export async function POST(request: NextRequest) {
  try {
    const { symbol, action, volume, stopLoss, takeProfit, comment } = await request.json();

    // Validate input
    if (!symbol || !action || !volume) {
      return NextResponse.json(
        { error: 'Missing required fields: symbol, action, volume' },
        { status: 400 }
      );
    }

    if (!['BUY', 'SELL'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be BUY or SELL' },
        { status: 400 }
      );
    }

    if (volume <= 0) {
      return NextResponse.json(
        { error: 'Volume must be greater than 0' },
        { status: 400 }
      );
    }

    // Execute trade
    const bridge = new MT5Bridge();
    const orderId = await bridge.executeTrade({
      symbol,
      action,
      volume,
      stopLoss,
      takeProfit,
      comment,
    });

    return NextResponse.json({
      success: true,
      orderId,
      message: `${action} order placed for ${volume} ${symbol}`,
    });
  } catch (error) {
    console.error('Trade execution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute trade',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
