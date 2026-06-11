/**
 * GET /api/trades/price
 * Get live MT5 bid/ask price for a symbol
 */

import { NextRequest, NextResponse } from 'next/server';
import MT5Bridge from '@/lib/mt5-bridge';

export async function GET(request: NextRequest) {
  try {
    const symbol = request.nextUrl.searchParams.get('symbol');
    if (!symbol) {
      return NextResponse.json(
        { error: 'Missing required query parameter: symbol' },
        { status: 400 }
      );
    }

    const bridge = new MT5Bridge();
    const price = await bridge.getSymbolPrice(symbol.trim().toUpperCase());

    return NextResponse.json({ success: true, symbol: symbol.trim().toUpperCase(), ...price });
  } catch (error) {
    console.error('Error fetching symbol price:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch symbol price',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
