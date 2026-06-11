'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import type { Position } from '@/lib/mt5-bridge';

export function PositionsViewer() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closingId, setClosingId] = useState<string | null>(null);

  const fetchPositions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/trades/positions');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch positions');
      }

      setPositions(data.positions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosition = async (positionId: string) => {
    setClosingId(positionId);
    try {
      const response = await fetch(`/api/trades/positions/${positionId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to close position');
      }

      setPositions((prev) => prev.filter((p) => p.id !== positionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setClosingId(null);
    }
  };

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>Real-time MT5 positions</CardDescription>
        </div>
        <Button onClick={fetchPositions} disabled={loading} variant="outline" size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {positions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? 'Loading positions...' : 'No open positions'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Open Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>P&L %</TableHead>
                  <TableHead>SL</TableHead>
                  <TableHead>TP</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">{position.symbol}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          position.type === 'BUY'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {position.type}
                      </span>
                    </TableCell>
                    <TableCell>{position.volume.toFixed(2)}</TableCell>
                    <TableCell>{position.openPrice.toFixed(5)}</TableCell>
                    <TableCell>{position.currentPrice.toFixed(5)}</TableCell>
                    <TableCell
                      className={position.profit >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {position.profit.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={position.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {position.profitPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell>{position.stopLoss?.toFixed(5) || '-'}</TableCell>
                    <TableCell>{position.takeProfit?.toFixed(5) || '-'}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={closingId === position.id}
                          >
                            {closingId === position.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              'Close'
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Close Position?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to close {position.volume} {position.symbol}{' '}
                            {position.type} at {position.currentPrice.toFixed(5)}?
                          </AlertDialogDescription>
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            Current P&L: {position.profit.toFixed(2)} ({position.profitPercent.toFixed(2)}%)
                          </div>
                          <div className="flex gap-2 mt-4">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleClosePosition(position.id)}
                              className="bg-destructive"
                            >
                              Close Position
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
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
