'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import type { TradeOrder } from '@/lib/mt5-bridge';

export function TradeHistory() {
  const [trades, setTrades] = useState<TradeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(50);

  const fetchTradeHistory = async (limitValue = 50) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/trades/history?limit=${limitValue}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch trade history');
      }

      setTrades(data.trades || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeHistory(limit);
  }, [limit]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Trade History</CardTitle>
          <CardDescription>Recently closed trades</CardDescription>
        </div>
        <div className="flex gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
            disabled={loading}
          >
            <option value={10}>Last 10</option>
            <option value={25}>Last 25</option>
            <option value={50}>Last 50</option>
            <option value={100}>Last 100</option>
            <option value={250}>Last 250</option>
          </select>
          <Button onClick={() => fetchTradeHistory(limit)} disabled={loading} variant="outline" size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {trades.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? 'Loading trade history...' : 'No trades found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Open Price</TableHead>
                  <TableHead>Open Time</TableHead>
                  <TableHead>Close Price</TableHead>
                  <TableHead>Close Time</TableHead>
                  <TableHead>Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.orderId}>
                    <TableCell className="font-mono text-xs">{trade.orderId.slice(-8)}</TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.type === 'BUY'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {trade.type}
                      </span>
                    </TableCell>
                    <TableCell>{trade.volume.toFixed(2)}</TableCell>
                    <TableCell>{trade.openPrice.toFixed(5)}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(trade.openTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{trade.closePrice?.toFixed(5) || '-'}</TableCell>
                    <TableCell className="text-xs">
                      {trade.closeTime ? new Date(trade.closeTime).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell
                      className={`font-medium ${
                        trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {trade.profit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
