'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { ExecuteSignalForm } from '@/components/trading/ExecuteSignalForm';

interface Signal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  volume: number;
  stopLoss?: number;
  takeProfit?: number;
  userId?: string;
  comment?: string;
  sentAt: string;
  status: string;
}

export default function AdminTradingPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSymbol, setFilterSymbol] = useState('');

  const fetchSignals = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `/api/trades/signals?limit=100${filterSymbol ? `&symbol=${filterSymbol}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch signals');
      }

      setSignals(data.signals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [filterSymbol]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'bg-green-100 text-green-800';
      case 'SELL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Trading Control</h1>
          <p className="text-muted-foreground">
            Execute trading signals and monitor all trade activity
          </p>
        </div>

        {/* Signal Execution Form */}
        <div className="mb-8">
          <ExecuteSignalForm onSuccess={() => fetchSignals()} />
        </div>

        {/* Signal History */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Signal History</CardTitle>
              <CardDescription>All trading signals sent from iGrow</CardDescription>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filter by symbol..."
                value={filterSymbol}
                onChange={(e) => setFilterSymbol(e.target.value.toUpperCase())}
                className="border rounded px-3 py-1 text-sm"
              />
              <Button onClick={() => fetchSignals()} disabled={loading} variant="outline" size="sm">
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

            {signals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {loading ? 'Loading signals...' : 'No signals found'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>SL</TableHead>
                      <TableHead>TP</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signals.map((signal) => (
                      <TableRow key={signal.id}>
                        <TableCell className="text-xs whitespace-nowrap">
                          {new Date(signal.sentAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{signal.symbol}</TableCell>
                        <TableCell>
                          <Badge className={getActionColor(signal.action)}>
                            {signal.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{signal.volume.toFixed(2)}</TableCell>
                        <TableCell className="text-xs">
                          {signal.stopLoss?.toFixed(5) || '-'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {signal.takeProfit?.toFixed(5) || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{signal.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {signal.comment?.substring(0, 30) || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="mt-4 text-sm text-muted-foreground">
              Total signals sent: {signals.length}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{signals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Buy Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {signals.filter((s) => s.action === 'BUY').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sell Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {signals.filter((s) => s.action === 'SELL').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Unique Symbols</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(signals.map((s) => s.symbol)).size}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
