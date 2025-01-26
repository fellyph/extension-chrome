import type { AISession } from '../types/ChromeAi';
import { AI_PROMPTS } from '../constants/aiPrompts';

export class TextAnalyzer {
  static async createAISession(): Promise<AISession | null> {
    try {
      const capabilities = await chrome.runtime.sendMessage({ type: 'GET_AI_CAPABILITIES' });

      if (!capabilities?.available) {
        console.error('AI capabilities not available:', capabilities);
        return null;
      }

      return {
        prompt: async (text: string) => {
          const response = await chrome.runtime.sendMessage({
            type: 'ANALYZE_TEXT',
            payload: { text },
          });

          if (!response) throw new Error('No response received from AI analysis');
          return response;
        },
      };
    } catch (error) {
      console.error('Error creating AI session:', error);
      return null;
    }
  }

  static async analyzeText(text: string): Promise<string | undefined> {
    try {
      const session = await this.createAISession();
      if (!session) {
        console.warn('AI analysis not available');
        return undefined;
      }

      return await session.prompt(`${AI_PROMPTS.ANALYZE}\n\nText:\n"${text}"`);
    } catch (error) {
      console.warn('AI analysis failed:', error);
      return undefined;
    }
  }

  static async scoreText(text: string): Promise<string | undefined> {
    try {
      const session = await this.createAISession();
      if (!session) {
        console.warn('AI analysis not available');
        return undefined;
      }

      return await session.prompt(`${AI_PROMPTS.SCORE}\n\nText:\n"${text}"`);
    } catch (error) {
      console.warn('AI analysis failed:', error);
      return undefined;
    }
  }
}
