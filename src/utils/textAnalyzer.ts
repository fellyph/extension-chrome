import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import type { AnalysisResult } from '../types/AnalysisResult';
import type { BadgeColors } from '../types/BadgeColors';
import { SuggestionGenerator } from './suggestionGenerator';

type RiskScore = 'red' | 'yellow' | 'green' | 'black';

interface AICapabilities {
  available: boolean | 'no';
  defaultTopK: number;
}

interface AISession {
  prompt: (text: string) => Promise<string>;
}

interface AISessionOptions {
  monitor?: (m: {
    addEventListener: (
      event: string,
      callback: (e: { loaded: number; total: number }) => void
    ) => void;
  }) => void;
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
}

export class TextAnalyzer {
  static async createAISession(): Promise<AISession | null> {
    try {
      const capabilities = await chrome.runtime.sendMessage({ type: 'GET_AI_CAPABILITIES' });

      if (!capabilities?.available) {
        console.warn('AI analysis not available');
        return null;
      }

      return {
        prompt: async (text: string) => {
          const response = await chrome.runtime.sendMessage({
            type: 'ANALYZE_TEXT',
            payload: { text },
          });
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
      if (!session) return undefined;

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
      console.warn('AI analysis failed:', error);
      return undefined;
    }
  }

  static async scoreText(text: string): Promise<string | undefined> {
    try {
      const session = await this.createAISession();
      if (!session) return undefined;

      return await session.prompt(`Classify the following text based on its sensitivity level:

*   Green: Public - Information that can be openly shared without any adverse consequences.
*   Yellow: Internal - Data intended for use within the organization but poses no severe risk if disclosed.
*   Red: Confidential - Information that carries a risk of harm if disclosed and should only be shared with specific individuals.
*   Black: Restricted - Highly sensitive information, requiring the strictest controls. Unauthorized disclosure could lead to significant damage.

Respond with only the color classification (Green, Yellow, Red, or Black).

Text:
"${text}"`);
    } catch (error) {
      console.warn('AI analysis failed:', error);
      return undefined;
    }
  }
}
