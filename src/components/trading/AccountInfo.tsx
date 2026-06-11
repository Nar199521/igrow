'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { AccountInfo } from '@/lib/mt5-bridge';

export function AccountInfo() {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAccountInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/trades/account');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch account info');
      }

      setAccount(data.account);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountInfo();
    const interval = setInterval(fetchAccountInfo, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !account) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>MT5 Account Overview</CardDescription>
        </div>
        <Button onClick={fetchAccountInfo} disabled={loading} variant="outline" size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {account && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Balance</div>
              <div className="text-2xl font-bold">
                {account.balance.toFixed(2)} {account.currency}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Equity</div>
              <div className="text-2xl font-bold">
                {account.equity.toFixed(2)} {account.currency}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Margin Used</div>
              <div className="text-2xl font-bold">
                {account.margin.toFixed(2)} {account.currency}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Free Margin</div>
              <div className="text-2xl font-bold text-green-600">
                {account.marginFree.toFixed(2)} {account.currency}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Margin Level</div>
              <div className="text-2xl font-bold">
                {account.marginLevel.toFixed(2)}%
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Leverage</div>
              <div className="text-2xl font-bold">1:{account.leverage}</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Open Positions</div>
              <div className="text-2xl font-bold">{account.positions.length}</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Profit/Loss</div>
              <div
                className={`text-2xl font-bold ${
                  account.positions.reduce((sum, p) => sum + p.profit, 0) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {account.positions.reduce((sum, p) => sum + p.profit, 0).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
