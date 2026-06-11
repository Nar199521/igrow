/**
 * GET /api/trades/account
 * Fetch account information and statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import MT5Bridge from '@/lib/mt5-bridge';

export async function GET(request: NextRequest) {
  try {
    const bridge = new MT5Bridge();
    const accountInfo = await bridge.getAccountInfo();

    return NextResponse.json({
      success: true,
      account: accountInfo,
    });
  } catch (error) {
    console.error('Error fetching account info:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch account information',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
