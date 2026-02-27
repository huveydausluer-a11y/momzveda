import { AIProvider } from './AIService';

interface UsageData {
  tokens: number;
  cost: number;
}

interface UsageTracker {
  [AIProvider.CLAUDE]: UsageData;
  [AIProvider.CHATGPT]: UsageData;
}

export class AICostManager {
  private usageTracker: UsageTracker;
  private readonly rates: Record<AIProvider, number>;

  constructor() {
    this.usageTracker = {
      [AIProvider.CLAUDE]: { tokens: 0, cost: 0 },
      [AIProvider.CHATGPT]: { tokens: 0, cost: 0 }
    };

    // Rates per token in USD
    this.rates = {
      [AIProvider.CLAUDE]: 0.000015,
      [AIProvider.CHATGPT]: 0.000020
    };
  }

  trackUsage(provider: AIProvider, tokens: number): void {
    const cost = this.calculateCost(provider, tokens);
    this.usageTracker[provider].tokens += tokens;
    this.usageTracker[provider].cost += cost;

    // Log usage for monitoring
    console.log(`Usage tracked for ${provider}:`, {
      tokens,
      cost,
      totalTokens: this.usageTracker[provider].tokens,
      totalCost: this.usageTracker[provider].cost
    });
  }

  private calculateCost(provider: AIProvider, tokens: number): number {
    return tokens * this.rates[provider];
  }

  getUsageReport(): UsageTracker {
    return this.usageTracker;
  }

  getDailyCost(): number {
    return Object.values(this.usageTracker).reduce(
      (total, { cost }) => total + cost,
      0
    );
  }

  resetDailyUsage(): void {
    this.usageTracker = {
      [AIProvider.CLAUDE]: { tokens: 0, cost: 0 },
      [AIProvider.CHATGPT]: { tokens: 0, cost: 0 }
    };
  }
}