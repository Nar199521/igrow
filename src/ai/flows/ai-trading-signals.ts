/**
 * AI Trading Signal Flow
 * Analyzes market conditions and generates trading signals
 * Integrates with MT5 Bridge for automatic execution
 */

import { defineFlow, run } from '@genkit-ai/flow';
import { gemini15Flash } from '@genkit-ai/google-genai';
import MT5Bridge from '@/lib/mt5-bridge';

interface MarketAnalysis {
  symbol: string;
  currentPrice: number;
  trend: 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS';
  rsi: number; // 0-100
  macdSignal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  support: number;
  resistance: number;
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-100
  volume: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
}

/**
 * Generate trading signal from market analysis
 */
export const generateTradingSignal = defineFlow(
  {
    name: 'generateTradingSignal',
    description: 'Generate a trading signal based on market analysis',
    inputSchema: {
      type: 'object' as const,
      properties: {
        analysis: {
          type: 'object' as const,
          properties: {
            symbol: { type: 'string' as const },
            currentPrice: { type: 'number' as const },
            trend: { type: 'string' as const },
            rsi: { type: 'number' as const },
            macdSignal: { type: 'string' as const },
            support: { type: 'number' as const },
            resistance: { type: 'number' as const },
            volatility: { type: 'string' as const },
          },
          required: ['symbol', 'currentPrice'],
        },
      },
      required: ['analysis'],
    },
    outputSchema: {
      type: 'object' as const,
      properties: {
        action: { type: 'string' as const },
        confidence: { type: 'number' as const },
        volume: { type: 'number' as const },
        stopLoss: { type: 'number' as const },
        takeProfit: { type: 'number' as const },
        reasoning: { type: 'string' as const },
      },
    },
  },
  async (input: { analysis: MarketAnalysis }): Promise<TradingSignal> => {
    const { analysis } = input;

    const prompt = `
You are an expert forex trader. Analyze this market data and generate a trading signal.

Market Analysis:
- Symbol: ${analysis.symbol}
- Current Price: ${analysis.currentPrice}
- Trend: ${analysis.trend}
- RSI: ${analysis.rsi} (>70=overbought, <30=oversold)
- MACD Signal: ${analysis.macdSignal}
- Support Level: ${analysis.support}
- Resistance Level: ${analysis.resistance}
- Volatility: ${analysis.volatility}

Generate a trading signal with:
1. Action: BUY, SELL, or HOLD
2. Confidence level (0-100)
3. Suggested volume in lots (0.01-1.0)
4. Stop loss price (below support for BUY, above resistance for SELL)
5. Take profit price (above resistance for BUY, below support for SELL)
6. Clear reasoning

Respond in JSON format:
{
  "action": "BUY|SELL|HOLD",
  "confidence": 85,
  "volume": 0.5,
  "stopLoss": 1.0500,
  "takeProfit": 1.1000,
  "reasoning": "Clear uptrend with RSI below 70..."
}
`;

    const response = await run('analyzeMarket', async () => {
      const result = await gemini15Flash.generate({
        prompt,
      });

      const text = result.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse trading signal from AI response');
      }

      const signal = JSON.parse(jsonMatch[0]);

      return {
        symbol: analysis.symbol,
        action: signal.action,
        confidence: signal.confidence,
        volume: signal.volume,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        reasoning: signal.reasoning,
      };
    });

    return response;
  }
);

/**
 * Execute trading signal on MT5
 */
export const executeTradingSignal = defineFlow(
  {
    name: 'executeTradingSignal',
    description: 'Execute a trading signal on MT5',
    inputSchema: {
      type: 'object' as const,
      properties: {
        signal: {
          type: 'object' as const,
          properties: {
            symbol: { type: 'string' as const },
            action: { type: 'string' as const },
            volume: { type: 'number' as const },
            stopLoss: { type: 'number' as const },
            takeProfit: { type: 'number' as const },
            confidence: { type: 'number' as const },
          },
          required: ['symbol', 'action', 'volume'],
        },
        autoExecute: { type: 'boolean' as const },
      },
      required: ['signal'],
    },
    outputSchema: {
      type: 'object' as const,
      properties: {
        orderId: { type: 'string' as const },
        status: { type: 'string' as const },
        message: { type: 'string' as const },
      },
    },
  },
  async (
    input: { signal: TradingSignal; autoExecute?: boolean }
  ): Promise<{ orderId: string; status: string; message: string }> => {
    const { signal, autoExecute = false } = input;

    // Check confidence threshold
    const CONFIDENCE_THRESHOLD = 70;
    if (signal.confidence < CONFIDENCE_THRESHOLD && !autoExecute) {
      return {
        orderId: '',
        status: 'REJECTED',
        message: `Signal confidence ${signal.confidence}% is below threshold of ${CONFIDENCE_THRESHOLD}%`,
      };
    }

    // Validate signal
    if (signal.action === 'HOLD') {
      return {
        orderId: '',
        status: 'SKIPPED',
        message: 'HOLD signal - no trade executed',
      };
    }

    try {
      const bridge = new MT5Bridge();

      // Check connection
      const isConnected = await bridge.validateConnection();
      if (!isConnected) {
        return {
          orderId: '',
          status: 'ERROR',
          message: 'MT5 connection failed - check API credentials',
        };
      }

      // Get current account info
      const account = await bridge.getAccountInfo();

      // Check sufficient margin
      const estimatedMarginRequired = (signal.volume * signal.stopLoss) / account.leverage;
      if (estimatedMarginRequired > account.marginFree) {
        return {
          orderId: '',
          status: 'ERROR',
          message: `Insufficient margin. Required: ${estimatedMarginRequired.toFixed(2)}, Available: ${account.marginFree.toFixed(2)}`,
        };
      }

      // Execute trade
      const orderId = await bridge.executeTrade({
        symbol: signal.symbol,
        action: signal.action,
        volume: signal.volume,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        comment: `AI Signal - ${signal.reasoning.substring(0, 50)}...`,
      });

      return {
        orderId,
        status: 'EXECUTED',
        message: `${signal.action} order placed: ${signal.volume} ${signal.symbol} @ confidence ${signal.confidence}%`,
      };
    } catch (error) {
      return {
        orderId: '',
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
);

/**
 * Complete AI Trading Signal Pipeline
 * Analyzes market -> Generates signal -> Executes on MT5
 */
export const aiTradingPipeline = defineFlow(
  {
    name: 'aiTradingPipeline',
    description: 'Complete AI trading pipeline: analyze -> signal -> execute',
    inputSchema: {
      type: 'object' as const,
      properties: {
        analysis: {
          type: 'object' as const,
          properties: {
            symbol: { type: 'string' as const },
            currentPrice: { type: 'number' as const },
            trend: { type: 'string' as const },
            rsi: { type: 'number' as const },
            macdSignal: { type: 'string' as const },
            support: { type: 'number' as const },
            resistance: { type: 'number' as const },
            volatility: { type: 'string' as const },
          },
          required: ['symbol', 'currentPrice'],
        },
        autoExecute: { type: 'boolean' as const },
      },
      required: ['analysis'],
    },
    outputSchema: {
      type: 'object' as const,
      properties: {
        signal: { type: 'object' as const },
        execution: { type: 'object' as const },
      },
    },
  },
  async (
    input: { analysis: MarketAnalysis; autoExecute?: boolean }
  ): Promise<{ signal: TradingSignal; execution: any }> => {
    // Step 1: Generate signal from market analysis
    const signal = await generateTradingSignal({
      analysis: input.analysis,
    });

    // Step 2: Execute signal
    const execution = await executeTradingSignal({
      signal,
      autoExecute: input.autoExecute || false,
    });

    return {
      signal,
      execution,
    };
  }
);

export type { MarketAnalysis, TradingSignal };
