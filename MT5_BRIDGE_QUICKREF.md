# MT5 Bridge Quick Reference

## Quick Setup (5 minutes)

1. **Start the local MT5 bridge server**
   - Install Python and MetaTrader5 package
   - Run `python scripts/mt5_bridge_server.py`
2. **Connect your MT5 account** in the local MT5 terminal
3. **Set the bridge URL** in `.env.local`
4. **Add to `.env.local`:**
   ```
   MT5_BRIDGE_URL=http://localhost:8000
   ```
5. **Visit:** `http://localhost:3000/trading`

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **POST** | `/api/trades/signals` | Send trading signal |
| **GET** | `/api/trades/signals` | Get signal history |
| **GET** | `/api/trades/positions` | Get open positions |
| **POST** | `/api/trades/positions/[id]/close` | Close position |
| **PUT** | `/api/trades/positions/[id]` | Update SL/TP |
| **GET** | `/api/trades/account` | Get account info |
| **GET** | `/api/trades/history` | Get closed trades |

---

## Example: Send a BUY Signal

```bash
curl -X POST http://localhost:3000/api/trades/signals \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "EURUSD",
    "action": "BUY",
    "volume": 0.5,
    "stopLoss": 1.0500,
    "takeProfit": 1.1000,
    "comment": "Buy signal from AI"
  }'
```

**Response:**
```json
{
  "success": true,
  "signal": {
    "id": "order123",
    "symbol": "EURUSD",
    "action": "BUY",
    "volume": 0.5,
    "sentAt": "2024-01-15T10:30:45Z",
    "status": "EXECUTED"
  }
}
```

---

## Example: JavaScript/TypeScript

```typescript
// Execute a signal
const response = await fetch('/api/trades/signals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    symbol: 'GBPUSD',
    action: 'SELL',
    volume: 0.2,
    stopLoss: 1.3050,
    takeProfit: 1.2950,
  }),
});

const data = await response.json();
console.log('Order ID:', data.signal.id);
```

---

## Pages

| URL | Purpose |
|-----|---------|
| `/trading` | Trading dashboard (view positions, history, account) |
| `/admin/trading` | Admin control (execute signals, view history) |

---

## Environment Variables

```bash
# Required for MT5 integration
MT5_BRIDGE_URL=http://localhost:8000
```

---

## File Structure

```
src/
├── lib/mt5-bridge.ts              ← Core MT5 class
├── app/api/trades/                ← All trading APIs
├── components/trading/             ← Trading UI components
└── ai/flows/ai-trading-signals.ts  ← AI signal generation
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "Bridge Not Available" | Ensure the local MT5 bridge server is running at `http://localhost:8000` |
| "Account Not Found" | Confirm MT5 is logged in and connected to your broker |
| "Insufficient Margin" | Reduce volume or add funds |
| "Symbol Not Found" | Use correct format (EURUSD, not EUR/USD) |

---

## Features

✅ Execute trades from website
✅ View open positions in real-time
✅ Close positions with one click
✅ Update stop loss & take profit
✅ View account balance & equity
✅ Trade history & P&L tracking
✅ AI signal generation (optional)
✅ Admin control panel

---

## Next: Connect to Your AI

```typescript
// src/ai/flows/auto-trading.ts
import { aiTradingPipeline } from './ai-trading-signals';

const signal = await aiTradingPipeline({
  analysis: {
    symbol: 'EURUSD',
    currentPrice: 1.0750,
    trend: 'UPTREND',
    rsi: 45,
    macdSignal: 'BULLISH',
    support: 1.0700,
    resistance: 1.0800,
    volatility: 'MEDIUM',
  },
  autoExecute: true, // Auto-execute if confidence > 70%
});
```

---

## Security

🔒 Never commit `.env.local`
🔒 Rotate API tokens regularly
🔒 Use HTTPS in production
🔒 Implement role-based access control
🔒 Monitor all trade executions

---

**Full Documentation:** See `MT5_BRIDGE_SETUP.md`
