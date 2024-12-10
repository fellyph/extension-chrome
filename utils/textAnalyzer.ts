// Define interfaces for better type safety
interface AICapabilities {
  available: boolean | 'no';
  defaultTopK: number;
}

interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

interface AISession {
  prompt: (text: string) => Promise<string>;
}

interface ChromeAI {
  aiOriginTrial: {
    languageModel: {
      capabilities: () => Promise<AICapabilities>;
      create: (options: AISessionOptions) => Promise<AISession>;
    };
  };
}

interface AISessionOptions {
  monitor?: (m: {
    addEventListener: (event: string, callback: (e: DownloadProgressEvent) => void) => void;
  }) => void;
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
}

// Extend the Window interface to include chrome
declare global {
  interface Window {
    chrome: ChromeAI;
  }
}

export class TextAnalyzer {
  static async createAISession(): Promise<AISession | null> {
    try {
      // Check if AI capabilities are available
      const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();

      if (!capabilities?.available) {
        console.warn('AI analysis not available');
        return null;
      }

      if (capabilities.available === 'no') {
        const session = await chrome.aiOriginTrial.languageModel.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        return session;
      }

      // Create an AI session with appropriate system prompt
      return await chrome.aiOriginTrial.languageModel.create({
        systemPrompt: `You are a highly sensitive data detection AI. Your primary goal is to identify and categorize sensitive information with high accuracy and minimal false positives. Prioritize user privacy and data security. Always err on the side of caution when identifying potentially sensitive data, even if it means occasionally flagging something that is not truly sensitive.`,
        temperature: 0.5,
        topK: capabilities.defaultTopK,
      });
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

      return await session.prompt(`Analyze the following text to determine if it contains sensitive information.

Sensitive information includes:

*   **Personally Identifiable Information (PII):**  Full names, email addresses, phone numbers,  dates of birth, Social Security numbers (SSNs), driver's license numbers, passport numbers, etc.
*   **Financial Information:** Credit card numbers, bank account numbers, etc.
*   **Health Information:** Medical records, diagnoses, treatments, etc.

**Output:**

1.  **Sensitive Data Detected:** Indicate with a clear "Yes" or "No" whether sensitive information was found in the text.
2.  **Highlighted Data:** Highlight all sensitive data found in the text.
3.  **Categorization:** Categorize each instance of highlighted data by its type (e.g., "credit card," "SSN," "email address," "full name," etc.). 

Text:
 "${text}"`);
    } catch (error) {
      console.warn('AI analysis failed, falling back to basic checks:', error);
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

      return await session.prompt(`Classify the following text based on its sensitivity level:

*   Green: Public - Information that can be openly shared without any adverse consequences.
*   Yellow: Internal - Data intended for use within the organization but poses no severe risk if disclosed.
*   Red: Confidential - Information that carries a risk of harm if disclosed and should only be shared with specific individuals.
*   Black: Restricted - Highly sensitive information, requiring the strictest controls. Unauthorized disclosure could lead to significant damage.

Respond with only the color classification (Green, Yellow, Red, or Black).

Text:
  "${text}"`);
    } catch (error) {
      console.warn('AI analysis failed, falling back to basic checks:', error);
      return undefined;
    }
  }
}
