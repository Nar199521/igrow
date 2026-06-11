'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExecuteSignalFormProps {
  onSuccess?: () => void;
}

const supportedSymbols = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'AUDUSD',
  'USDCAD',
  'USDCHF',
  'BTCUSD',
  'ETHUSD',
];

export function ExecuteSignalForm({ onSuccess }: ExecuteSignalFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [symbolPrice, setSymbolPrice] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    symbol: 'EURUSD',
    action: 'BUY',
    volume: '0.1',
    stopLoss: '',
    takeProfit: '',
    comment: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchSymbolPrice = async (symbol: string) => {
    if (!symbol) {
      setSymbolPrice(null);
      return;
    }

    try {
      const response = await fetch(`/api/trades/price?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) {
        setSymbolPrice(null);
        return;
      }

      const data = await response.json();
      setSymbolPrice(typeof data.bid === 'number' ? data.bid : null);
    } catch {
      setSymbolPrice(null);
    }
  };

  useEffect(() => {
    fetchSymbolPrice(formData.symbol.trim().toUpperCase());
  }, [formData.symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const volume = parseFloat(formData.volume);
      if (isNaN(volume) || volume <= 0) {
        throw new Error('Volume must be a positive number');
      }

      const payload: any = {
        symbol: formData.symbol,
        action: formData.action,
        volume,
        comment: formData.comment,
      };

      if (formData.stopLoss) {
        payload.stopLoss = parseFloat(formData.stopLoss);
      }
      if (formData.takeProfit) {
        payload.takeProfit = parseFloat(formData.takeProfit);
      }

      const response = await fetch('/api/trades/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute signal');
      }

      setSuccess(`Signal executed! Order ID: ${data.signal.id}`);
      setFormData({
        symbol: 'EURUSD',
        action: 'BUY',
        volume: '0.1',
        stopLoss: '',
        takeProfit: '',
        comment: '',
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Execute Trading Signal</CardTitle>
        <CardDescription>Send a BUY/SELL signal to MT5</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                list="symbol-options"
                placeholder="e.g., EURUSD"
                value={formData.symbol}
                onChange={handleChange}
                disabled={loading}
              />
              <datalist id="symbol-options">
                {supportedSymbols.map((symbol) => (
                  <option key={symbol} value={symbol} />
                ))}
              </datalist>
              {symbolPrice !== null && (
                <p className="text-sm text-muted-foreground mt-1">
                  Live quote for {formData.symbol.trim().toUpperCase()}: {symbolPrice.toFixed(symbolPrice > 10 ? 2 : 5)}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Common supported symbols: {supportedSymbols.join(', ')}. Actual MT5 symbol availability depends on your broker.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={formData.action} onValueChange={(value) => setFormData((prev) => ({ ...prev, action: value }))}>
                <SelectTrigger id="action" disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volume">Volume (Lots)</Label>
              <Input
                id="volume"
                name="volume"
                type="number"
                step="0.01"
                placeholder="0.1"
                value={formData.volume}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss (Optional)</Label>
              <Input
                id="stopLoss"
                name="stopLoss"
                type="number"
                step="0.0001"
                placeholder="e.g., 1.0500"
                value={formData.stopLoss}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit (Optional)</Label>
              <Input
                id="takeProfit"
                name="takeProfit"
                type="number"
                step="0.0001"
                placeholder="e.g., 1.1000"
                value={formData.takeProfit}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Input
              id="comment"
              name="comment"
              placeholder="Add a note to this signal"
              value={formData.comment}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Executing...' : 'Execute Signal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
