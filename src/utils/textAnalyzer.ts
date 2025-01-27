import { AI_PROMPTS } from '../constants/aiPrompts';

export class TextAnalyzer {
  private static session: AILanguageModelSession | null = null;
  private static isInitializing = false;

  private static async initializeSession(): Promise<AILanguageModelSession | null> {
    if (this.isInitializing) return null;

    try {
      this.isInitializing = true;
      const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();

      if (capabilities.available === 'no') {
        console.error('AI capabilities not available:', capabilities);
        return null;
      }

      if (capabilities.available === 'after-download') {
        console.log('Model needs to be downloaded first...');
      }

      this.session = await chrome.aiOriginTrial.languageModel.create({
        systemPrompt: 'You are a helpful assistant that analyzes text.',
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });

      return this.session;
    } catch (error) {
      console.error('Error creating AI session:', error);
      return null;
    } finally {
      this.isInitializing = false;
    }
  }

  private static async getSession(): Promise<AILanguageModelSession | null> {
    if (!this.session) {
      return await this.initializeSession();
    }
    return this.session;
  }

  static async analyzeText(text: string): Promise<string | undefined> {
    try {
      const session = await this.getSession();
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
      const session = await this.getSession();
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

  static destroySession(): void {
    if (this.session) {
      this.session.destroy();
      this.session = null;
    }
  }
}
