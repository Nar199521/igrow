# MT5 Bridge Setup Guide

## Overview

This MT5 Bridge allows you to:
- ✅ Execute trading signals (BUY/SELL) from your website to MT5
- ✅ View and manage open positions in real-time
- ✅ Close positions and manage stop loss/take profit
- ✅ Monitor account balance and equity
- ✅ View complete trade history
- ✅ Automate trading from the admin dashboard

---

## Prerequisites

1. **Local MT5 Bridge Server**
   - Install Python and the `MetaTrader5` package
   - Run the local bridge server beside your website

2. **MT5 Account** (Demo or Live)
   - Use any MT5 broker (XM, FXChoice, etc.)
   - Log in to MT5 on the same machine where the bridge runs

3. **Local Bridge URL**
   - The bridge server runs on `http://localhost:8000` by default

---

## Step 1: Set Up the Local MT5 Bridge

### Install Python Dependencies
1. Install Python 3.11+ or 3.12
2. Run:
   ```bash
   pip install -r requirements.txt
   ```

### Start the Bridge Server
1. Make sure MetaTrader 5 is installed and logged in
2. Run:
   ```bash
   python scripts/mt5_bridge_server.py
   ```

### Verify Connectivity
1. Open `http://localhost:8000/status`
2. Confirm it returns account connection information

---

## Step 2: Configure Environment Variables

Create or update your `.env.local` file:

```bash
# Local MT5 bridge URL
MT5_BRIDGE_URL=http://localhost:8000
```

**Example:**
```bash
MT5_BRIDGE_URL=http://localhost:8000
```

---

## Step 3: Access the Trading Dashboard

### URL
```
http://localhost:3000/trading
```

Or in production:
```
https://yourdomain.com/trading
```

### Features Available

#### 1. **Account Information** (Top Section)
- Real-time balance and equity
- Margin usage and available margin
- Current leverage and open positions count
- Total profit/loss

#### 2. **Execute Signal Tab**
Send a trading signal with:
- Currency pair (e.g., EURUSD)
- Action (BUY or SELL)
- Volume in lots (e.g., 0.1)
- Optional stop loss price
- Optional take profit price
- Optional comment

**Example:**
- Pair: EURUSD
- Action: BUY
- Volume: 0.5 lots
- SL: 1.0500
- TP: 1.1000

#### 3. **Open Positions Tab**
View all live positions with:
- Symbol and trade type
- Volume and entry price
- Current price and P&L
- Stop loss and take profit levels
- One-click close button

#### 4. **Trade History Tab**
See closed trades:
- Order ID and symbol
- Entry/exit prices and times
- Profit/loss for each trade
- Filter by number of trades (10-250)

---

## Step 4: API Routes Reference

### POST /api/trades/execute
Execute a trade without recording signal history.

**Request:**
```json
{
  "symbol": "EURUSD",
  "action": "BUY",
  "volume": 0.5,
  "stopLoss": 1.0500,
  "takeProfit": 1.1000,
  "comment": "My trade comment"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order123",
  "message": "BUY order placed for 0.5 EURUSD"
}
```

---

### POST /api/trades/signals
Execute a signal (with history recording).

**Request:**
```json
{
  "symbol": "GBPUSD",
  "action": "SELL",
  "volume": 0.2,
  "stopLoss": 1.3050,
  "takeProfit": 1.2950,
  "userId": "user123",
  "comment": "AI Signal - Downtrend"
}
```

**Response:**
```json
{
  "success": true,
  "signal": {
    "id": "order456",
    "symbol": "GBPUSD",
    "action": "SELL",
    "volume": 0.2,
    "sentAt": "2024-01-15T10:30:45.123Z",
    "status": "EXECUTED"
  }
}
```

---

### GET /api/trades/signals
Get signal history.

**Query Parameters:**
- `limit`: Number of signals (default: 50, max: 50)
- `symbol`: Filter by currency pair (optional)

**Response:**
```json
{
  "success": true,
  "signals": [...],
  "count": 5,
  "total": 150
}
```

---

### GET /api/trades/positions
Get all open positions.

**Response:**
```json
{
  "success": true,
  "positions": [
    {
      "id": "pos123",
      "symbol": "EURUSD",
      "type": "BUY",
      "volume": 0.5,
      "openPrice": 1.0750,
      "currentPrice": 1.0800,
      "profit": 25.00,
      "profitPercent": 0.46
    }
  ],
  "count": 1
}
```

---

### POST /api/trades/positions/[id]/close
Close a position.

**Response:**
```json
{
  "success": true,
  "message": "Position closed successfully"
}
```

---

### PUT /api/trades/positions/[id]
Update position (stop loss/take profit).

**Request:**
```json
{
  "stopLoss": 1.0700,
  "takeProfit": 1.0900
}
```

---

### GET /api/trades/account
Get account information.

**Response:**
```json
{
  "success": true,
  "account": {
    "balance": 10000.00,
    "equity": 10250.50,
    "margin": 500.00,
    "marginFree": 9750.50,
    "marginLevel": 2050.1,
    "currency": "USD",
    "leverage": 100,
    "positions": [...]
  }
}
```

---

### GET /api/trades/history
Get trade history.

**Query Parameters:**
- `limit`: 1-500 trades (default: 50)

**Response:**
```json
{
  "success": true,
  "trades": [
    {
      "orderId": "trade123",
      "symbol": "EURUSD",
      "type": "BUY",
      "volume": 0.5,
      "openPrice": 1.0750,
      "closePrice": 1.0900,
      "profit": 75.00,
      "status": "CLOSED"
    }
  ],
  "count": 25
}
```

---

## Step 5: Automation (Optional)

### Auto-Execute Signals from Genkit AI
Add to your existing Genkit flow:

```typescript
// src/ai/flows/auto-trading-signals.ts
import { defineFlow, run } from '@genkit-ai/flow';
import MT5Bridge from '@/lib/mt5-bridge';

export const autoTradingSignalFlow = defineFlow(
  { name: 'autoTradingSignal' },
  async (input: { symbol: string; analysis: string }) => {
    // Generate signal from AI analysis
    const signal = await run('generateSignal', async () => {
      // Your AI logic here
      return {
        symbol: input.symbol,
        action: 'BUY' as const,
        volume: 0.5,
      };
    });

    // Execute via MT5 Bridge
    const bridge = new MT5Bridge();
    const orderId = await bridge.executeTrade(signal);

    return { orderId, signal };
  }
);
```

---

## Step 6: Webhook Integration (Advanced)

To receive notifications when trades are executed, set up webhooks:

```typescript
// src/app/api/webhooks/mt5/route.ts
export async function POST(request: Request) {
  const event = await request.json();

  if (event.type === 'ORDER_FILLED') {
    // Handle filled order
    console.log('Order filled:', event.orderId);
  } else if (event.type === 'POSITION_CLOSED') {
    // Handle closed position
    console.log('Position closed:', event.positionId);
  }

  return Response.json({ success: true });
}
```

---

## Troubleshooting

### "Bridge Not Available"
- Verify the local bridge server is running on `http://localhost:8000`
- Check that MetaTrader 5 is installed and logged in on the local machine
- Confirm the bridge returns a successful response at `/status`

### "Account Not Found"
- Verify MetaTrader 5 is logged in with the correct account
- Confirm the account is connected to your broker
- Restart the bridge server and MetaTrader 5 if needed

### "Insufficient Margin"
- Reduce trade volume
- Add funds to account
- Check margin level in account info

### "Symbol Not Found"
- Verify symbol spelling (e.g., EURUSD not EUR/USD)
- Check symbol is available on your broker
- Use 5-digit symbols without spaces

### Positions Not Showing
- Check account connection status
- Ensure you have open positions
- Refresh positions manually
- Confirm the bridge server returns open positions at `/positions`

---

## Security Considerations

⚠️ **Production Security:**
1. Never commit `.env.local` to git
2. Use `.env.local` (already in .gitignore)
3. Rotate API tokens regularly
4. Use environment variables for all secrets
5. Implement role-based access control
6. Add request authentication to API routes
7. Rate limit signal execution
8. Monitor all trades for suspicious activity

**Add Authentication to API Routes:**
```typescript
import { auth } from '@/lib/auth'; // Your auth provider

export async function POST(request: NextRequest) {
  const user = await auth(request);
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... rest of handler
}
```

---

## File Structure

```
src/
├── lib/
│   └── mt5-bridge.ts           # Main MT5 Bridge class
├── app/
│   ├── trading/
│   │   └── page.tsx            # Trading dashboard page
│   └── api/
│       └── trades/
│           ├── execute/route.ts
│           ├── signals/route.ts
│           ├── positions/route.ts
│           ├── positions/[id]/route.ts
│           ├── account/route.ts
│           └── history/route.ts
└── components/
    └── trading/
        ├── ExecuteSignalForm.tsx
        ├── PositionsViewer.tsx
        ├── AccountInfo.tsx
        └── TradeHistory.tsx
```

---

## Next Steps

1. ✅ Start the local bridge server
2. ✅ Add environment variables
3. ✅ Test trading dashboard
4. ✅ Create admin controls for signal execution
5. ✅ Set up automated signals (optional)
6. ✅ Monitor and optimize

---

## Support

- Local bridge status: `http://localhost:8000/status`
- GitHub Issues: Create an issue in your repository

---

**Last Updated:** January 2024
