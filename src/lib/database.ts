import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dataFolder = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}

const dbPath = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.join(dataFolder, 'igrow.db');

const db = new Database(dbPath);

const createSignalsTable = `
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
`;

db.exec(createSignalsTable);

const signalTableInfo = db.prepare(`PRAGMA table_info(signals)`).all();
const hasSessionId = signalTableInfo.some((column: any) => column.name === 'session_id');
if (!hasSessionId) {
  db.exec(`ALTER TABLE signals ADD COLUMN session_id TEXT;`);
}

export interface SignalRecord {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  volume: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
  userId?: string | null;
  comment?: string | null;
  sentAt: string;
  status: string;
  sessionId?: string | null;
}
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  volume: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
  userId?: string | null;
  comment?: string | null;
  sentAt: string;
  status: string;
}

export function saveSignal(signal: SignalRecord) {
  const statement = db.prepare(`
    INSERT OR REPLACE INTO signals (
      id,
      symbol,
      action,
      volume,
      stopLoss,
      takeProfit,
      userId,
      comment,
      sentAt,
      status,
      session_id
    ) VALUES (
      @id,
      @symbol,
      @action,
      @volume,
      @stopLoss,
      @takeProfit,
      @userId,
      @comment,
      @sentAt,
      @status,
      @sessionId
    )
  `);
  return statement.run(signal);
}

export function getSignals(limit = 50, sessionId?: string | null, symbol?: string): SignalRecord[] {
  if (!sessionId) {
    return [];
  }

  let query = `SELECT * FROM signals WHERE session_id = ? ORDER BY sentAt DESC LIMIT ?`;
  let params: any[] = [sessionId, limit];

  if (symbol) {
    query = `SELECT * FROM signals WHERE session_id = ? AND symbol = ? ORDER BY sentAt DESC LIMIT ?`;
    params = [sessionId, symbol, limit];
  }

  const statement = db.prepare(query);
  return statement.all(...params);
}
