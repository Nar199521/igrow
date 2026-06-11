/**
 * POST /api/trades/signals
 * Send a trading signal to MT5
 * GET /api/trades/signals
 * Get signal history
 */

import { NextRequest, NextResponse } from 'next/server';
import MT5Bridge from '@/lib/mt5-bridge';
import { saveSignal, getSignals } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { symbol, action, volume, stopLoss, takeProfit, userId, comment } =
      await request.json();

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

    // Execute trade via MT5 Bridge
    const bridge = new MT5Bridge();
    const sessionInfo = await bridge.getSessionInfo();
    const orderId = await bridge.executeTrade({
      symbol,
      action,
      volume,
      stopLoss,
      takeProfit,
      comment: comment || `Signal sent from admin dashboard`,
    });

    // Record signal in history for the current MT5 session only
    const signal = {
      id: orderId,
      symbol,
      action,
      volume,
      stopLoss: stopLoss ?? null,
      takeProfit: takeProfit ?? null,
      userId: userId ?? null,
      comment: comment ?? null,
      sentAt: new Date().toISOString(),
      status: 'EXECUTED',
      sessionId: sessionInfo.sessionId,
    };

    saveSignal(signal);

    return NextResponse.json({
      success: true,
      signal,
      message: `${action} signal executed: ${volume} ${symbol}`,
    });
  } catch (error) {
    console.error('Signal execution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute signal',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const symbol = searchParams.get('symbol') || undefined;

  const bridge = new MT5Bridge();
  const sessionInfo = await bridge.getSessionInfo();
  const result = getSignals(limit, sessionInfo.sessionId, symbol);
      count: result.length,
      total: result.length,
    });
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch signals',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
