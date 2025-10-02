// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

export interface PerplexityMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export type PerplexityModel = 
  | 'sonar'
  | 'sonar-pro' 
  | 'sonar-reasoning'
  | 'sonar-reasoning-pro'
  | 'sonar-deep-research';

export class PerplexityAPI {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      console.warn('⚠️  Perplexity API key not found. Please add PERPLEXITY_API_KEY to your .env file');
    }
  }

  async search(
    query: string, 
    model: PerplexityModel = 'sonar-pro'
  ): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      throw new Error('Perplexity API key not configured. Please add PERPLEXITY_API_KEY to your .env file');
    }

    const messages: PerplexityMessage[] = [
      { role: 'user', content: query }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('Error calling Perplexity API:', error);
      throw error;
    }
  }

  async searchWithModel(
    query: string,
    model: PerplexityModel
  ): Promise<string> {
    return this.search(query, model);
  }

  // Convenience methods for different models
  async searchBasic(query: string): Promise<string> {
    return this.search(query, 'sonar');
  }

  async searchPro(query: string): Promise<string> {
    return this.search(query, 'sonar-pro');
  }

  async searchReasoning(query: string): Promise<string> {
    return this.search(query, 'sonar-reasoning');
  }

  async searchReasoningPro(query: string): Promise<string> {
    return this.search(query, 'sonar-reasoning-pro');
  }

  async searchDeepResearch(query: string): Promise<string> {
    return this.search(query, 'sonar-deep-research');
  }
}

// Export a singleton instance
export const perplexityAPI = new PerplexityAPI();
