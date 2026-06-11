-- SQLite schema for iGrow MT5 trading signal history
-- Run this file once to create the required signal persistence table.

CREATE TABLE IF NOT EXISTS signals (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  action TEXT NOT NULL,
  volume REAL NOT NULL,
  stopLoss REAL,
  takeProfit REAL,
  userId TEXT,
  comment TEXT,
  sentAt TEXT NOT NULL,
  status TEXT NOT NULL,
  session_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_signals_session ON signals(session_id);
CREATE INDEX IF NOT EXISTS idx_signals_symbol ON signals(symbol);
