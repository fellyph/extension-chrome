import { TextAnalyzer } from './textAnalyzer.js';
import type { AnalysisResult } from '../types/AnalysisResult.js';

export class SuggestionGenerator {
  static async generate(text: string): Promise<AnalysisResult | null> {
    try {
      const [analysisText, scoreText] = await Promise.all([
        TextAnalyzer.analyzeText(text),
        TextAnalyzer.scoreText(text),
      ]);

      if (!analysisText || !scoreText) {
        throw new Error('Failed to get analysis or score');
      }

      // Extract highlighted data items
      const highlightedDataRegex = /\*\s*([^:]+):\s*([^\n]+)/g;
      const highlightedData = [...analysisText.matchAll(highlightedDataRegex)].map((match) => ({
        category: match[1].trim(),
        data: match[2].trim(),
      }));

      return {
        analysis: {
          highlightedData,
          rawText: analysisText,
        },
        score: {
          level: scoreText.trim() as 'Green' | 'Yellow' | 'Red',
          description: this.getScoreDescription(scoreText.trim() as 'Green' | 'Yellow' | 'Red'),
        },
      };
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return null;
    }
  }

  private static getScoreDescription(level: 'Green' | 'Yellow' | 'Red'): string {
    const descriptions = {
      Green: 'No sensitive data detected',
      Yellow: 'Potentially sensitive data detected',
      Red: 'Sensitive data detected',
    };
    return descriptions[level];
  }
}
