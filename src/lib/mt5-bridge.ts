/**
 * MT5 Bridge using a local Python MT5 connector server.
 * This bridge calls a local HTTP API instead of paid MetaAPI services.
 */

interface TradeSignal {
  symbol: string;
  action: 'BUY' | 'SELL';
  volume: number;
  stopLoss?: number;
  takeProfit?: number;
  comment?: string;
}

interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  openTime: string;
  stopLoss?: number;
  takeProfit?: number;
  profit: number;
  profitPercent: number;
}

interface AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  marginFree: number;
  marginLevel: number;
  currency: string;
  leverage: number;
  positions: Position[];
}

interface TradeOrder {
  orderId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  openTime: string;
  closePrice?: number;
  closeTime?: string;
  profit: number;
  status: 'OPEN' | 'CLOSED';
}

class MT5Bridge {
  private apiBaseUrl: string;

  constructor(apiBaseUrl?: string) {
    this.apiBaseUrl = apiBaseUrl || process.env.MT5_BRIDGE_URL || 'http://localhost:8000';
    if (!this.apiBaseUrl) {
      console.warn('MT5 Bridge: Missing MT5_BRIDGE_URL');
    }
  }

  /**
   * Execute a trade signal (BUY/SELL)
   */
  async executeTrade(signal: TradeSignal): Promise<string> {
    const response = await fetch(`${this.apiBaseUrl}/trade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: signal.symbol,
        action: signal.action,
        volume: signal.volume,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        comment: signal.comment || `Signal from iGrow - ${new Date().toISOString()}`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Trade execution failed: ${error}`);
    }

    const data = await response.json();
    return data.order_id || data.ticket?.toString() || '';
  }

  /**
   * Close a position by ID
   */
  async closePosition(positionId: string): Promise<boolean> {
    const response = await fetch(`${this.apiBaseUrl}/positions/${positionId}/close`, {
      method: 'POST',
    });
    return response.ok;
  }

  /**
   * Update stop loss and take profit for a position
   */
  async updatePosition(
    positionId: string,
    stopLoss?: number,
    takeProfit?: number
  ): Promise<boolean> {
    const response = await fetch(`${this.apiBaseUrl}/positions/${positionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stopLoss, takeProfit }),
    });
    return response.ok;
  }

  /**
   * Get all open positions
   */
  async getPositions(): Promise<Position[]> {
    const response = await fetch(`${this.apiBaseUrl}/positions`);
    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }

    const data = await response.json();
    return data.map((p: any) => ({
      id: p.ticket.toString(),
      symbol: p.symbol,
      type: p.type,
      volume: p.volume,
      openPrice: p.open_price,
      currentPrice: p.current_price,
      openTime: new Date(p.open_time).toISOString(),
      stopLoss: p.stop_loss,
      takeProfit: p.take_profit,
      profit: p.profit,
      profitPercent: 0,
    }));
  }

  /**
   * Get account information and statistics
   */
  async getAccountInfo(): Promise<AccountInfo> {
    const response = await fetch(`${this.apiBaseUrl}/account`);
    if (!response.ok) {
      throw new Error('Failed to fetch account info');
    }

    const data = await response.json();
    const positions = await this.getPositions();

    return {
      balance: data.balance || 0,
      equity: data.equity || 0,
      margin: data.margin || 0,
      marginFree: data.margin_free || 0,
      marginLevel: data.margin_level || 0,
      currency: data.currency || 'USD',
      leverage: data.leverage || 1,
      positions,
    };
  }

  /**
   * Get trade history
   */
  async getTradeHistory(limit: number = 50): Promise<TradeOrder[]> {
    const response = await fetch(`${this.apiBaseUrl}/history?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trade history');
    }

    const data = await response.json();
    return data.map((trade: any) => ({
      orderId: trade.ticket.toString(),
      symbol: trade.symbol,
      type: trade.type,
      volume: trade.volume,
      openPrice: trade.price,
      openTime: new Date(trade.time).toISOString(),
      closePrice: trade.price,
      closeTime: new Date(trade.time).toISOString(),
      profit: trade.profit,
      status: 'CLOSED',
    }));
  }

  /**
   * Get current price for a symbol
   */
  async getSymbolPrice(symbol: string): Promise<{ bid: number; ask: number }> {
    const response = await fetch(`${this.apiBaseUrl}/price?symbol=${encodeURIComponent(symbol)}`);
    if (!response.ok) {
      return { bid: 0, ask: 0 };
    }

    const data = await response.json();
    return {
      bid: typeof data.bid === 'number' ? data.bid : 0,
      ask: typeof data.ask === 'number' ? data.ask : 0,
    };
  }

  async getSessionInfo(): Promise<{ sessionId: string | null; accountLogin: number | null; accountServer: string | null }> {
    const response = await fetch(`${this.apiBaseUrl}/session`);
    if (!response.ok) {
      return { sessionId: null, accountLogin: null, accountServer: null };
    }

    const data = await response.json();
    return {
      sessionId: data.session_id || null,
      accountLogin: data.account_login || null,
      accountServer: data.account_server || null,
    };
  }

  /**
   * Validate account connection
   */
  async validateConnection(): Promise<boolean> {
    const response = await fetch(`${this.apiBaseUrl}/status`);
    return response.ok;
  }
}

export default MT5Bridge;
export type { TradeSignal, Position, AccountInfo, TradeOrder };
