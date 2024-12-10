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

      return {
        analysis: {
          rawText: analysisText,
        },
        score: {
          level: scoreText.trim() as 'Green' | 'Yellow' | 'Red' | 'Black',
          description: this.getScoreDescription(
            scoreText.trim() as 'Green' | 'Yellow' | 'Red' | 'Black'
          ),
        },
      };
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return null;
    }
  }

  private static getScoreDescription(level: 'Green' | 'Yellow' | 'Red' | 'Black'): string {
    const descriptions = {
      Green: 'No sensitive data detected',
      Yellow: 'Potentially sensitive data detected',
      Red: 'Sensitive data detected',
      Black: 'Highly sensitive data detected - requires immediate attention',
    };
    return descriptions[level];
  }
}
