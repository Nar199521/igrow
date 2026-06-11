# iGrow MT5 Trading Site

This repository is a Next.js app with a local MT5 bridge and database-backed signal persistence.

## How it works

- The website frontend communicates with Next.js backend API routes.
- API routes call `src/lib/mt5-bridge.ts`.
- `mt5-bridge.ts` forwards those requests to a local bridge server at `MT5_BRIDGE_URL`.
- The local bridge server is `scripts/mt5_bridge_server.py`.
- That bridge uses the Python `MetaTrader5` package to send trades to the MT5 terminal installed on the same machine.
- Signal history is stored in SQLite (`data/igrow.db`) so all devices can view past signals through the website.

## Remote use across devices

You can use the website from different devices if the Next.js app is deployed to a machine with access to:
1. The local MT5 bridge server
2. The MT5 terminal where trading is executed
3. The SQLite database storing signal history

In other words, user devices only access the website.
The actual MT5 connection happens on the backend machine.

## Setup

1. Install Node and dependencies:
   ```bash
   npm install
   ```
2. Install Python and bridge dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the MT5 bridge server on the MT5 machine:
   ```bash
   python scripts/mt5_bridge_server.py
   ```
4. Create `.env.local` with:
   ```bash
   MT5_BRIDGE_URL=http://localhost:8000
   DB_PATH=data/igrow.db
   ```
5. Run Next.js:
   ```bash
   npm run dev
   ```

## Use

- Open `http://localhost:3000/trading` to access the trading dashboard
- Use `POST /api/trades/signals` to send trade orders
- Open `/api/trades/signals` to view signal history
- Use `GET /api/trades/price?symbol=EURUSD` to fetch live MT5 bid/ask prices
- The signal data is persisted in SQLite so it is available to other devices through the website

## Notes

- The website does not talk to MT5 directly from the browser.
- It uses the backend and local bridge server to execute trades.
- For multi-device use, deploy the backend on the machine that can access MT5.
