import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export enum AIProvider {
  CLAUDE = 'claude',
  CHATGPT = 'chatgpt'
}

interface AIResponse {
  text: string;
  provider: AIProvider;
  tokens: number;
}

export class AIService {
  private anthropic: Anthropic;
  private openai: OpenAI;
  private costManager: AICostManager;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.costManager = new AICostManager();
  }

  async processMessage(
    message: string,
    provider: AIProvider = AIProvider.CLAUDE
  ): Promise<AIResponse> {
    try {
      return await this.getResponse(message, provider);
    } catch (error) {
      console.error(`Error with ${provider}:`, error);
      // Try fallback provider
      const fallbackProvider = provider === AIProvider.CLAUDE ? AIProvider.CHATGPT : AIProvider.CLAUDE;
      return await this.getResponse(message, fallbackProvider);
    }
  }

  private async getResponse(message: string, provider: AIProvider): Promise<AIResponse> {
    if (provider === AIProvider.CLAUDE) {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [{ role: 'user', content: message }],
        system: "You are Veda, an empathetic AI companion for mothers. You provide emotional support and practical parenting advice in a warm, understanding way. You're like a supportive mom friend who's always there to listen and help."
      });

      this.costManager.trackUsage(AIProvider.CLAUDE, response.usage.output_tokens);
      
      return {
        text: response.content[0].text,
        provider: AIProvider.CLAUDE,
        tokens: response.usage.output_tokens
      };
    } else {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: "You are Veda, an empathetic AI companion for mothers. You provide emotional support and practical parenting advice in a warm, understanding way. You're like a supportive mom friend who's always there to listen and help."
          },
          { role: 'user', content: message }
        ]
      });

      this.costManager.trackUsage(AIProvider.CHATGPT, response.usage.total_tokens);

      return {
        text: response.choices[0].message.content || '',
        provider: AIProvider.CHATGPT,
        tokens: response.usage.total_tokens
      };
    }
  }
}