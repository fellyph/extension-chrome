import { TextAnalyzer } from './textAnalyzer';
import type { AnalysisResult } from '../types/AnalysisResult';
import { RISK_LEVEL_DESCRIPTIONS } from 'constants/riskLevels';
import { RiskLevel, RiskLevelKey } from '../types/Risk';

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

  private static getScoreDescription(level: RiskLevel): string {
    return RISK_LEVEL_DESCRIPTIONS[level.toUpperCase() as RiskLevelKey];
  }
}
