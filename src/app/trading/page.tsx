'use client';

import { useState } from 'react';
import { AccountInfo } from '@/components/trading/AccountInfo';
import { ExecuteSignalForm } from '@/components/trading/ExecuteSignalForm';
import { PositionsViewer } from '@/components/trading/PositionsViewer';
import { TradeHistory } from '@/components/trading/TradeHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TradingPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSignalSuccess = () => {
    // Trigger refresh of positions and account info
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">MT5 Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your forex trades, view positions, and execute signals directly from iGrow
          </p>
        </div>

        {/* Account Overview */}
        <div key={refreshKey} className="mb-8">
          <AccountInfo />
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="execute" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="execute">Execute Signal</TabsTrigger>
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>

          <TabsContent value="execute" className="mt-6">
            <ExecuteSignalForm onSuccess={handleSignalSuccess} />
          </TabsContent>

          <TabsContent value="positions" className="mt-6">
            <PositionsViewer key={refreshKey} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <TradeHistory key={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
