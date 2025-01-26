import { TextAnalyzer } from './textAnalyzer';
import type { AnalysisResult } from '../types/AnalysisResult';
import { RISK_LEVEL_DESCRIPTIONS } from '../constants/riskLevels';
import { RiskLevel, RiskLevelKey } from '../types/Risk';

export class SuggestionGenerator {
  static async generate(text: string): Promise<AnalysisResult | null> {
    try {
      const [analysisText, scoreText] = await Promise.all([
        TextAnalyzer.analyzeText(text),
        TextAnalyzer.scoreText(text),
      ]);

      if (!analysisText) {
        console.warn('Analysis text is undefined');
        return null;
      }

      if (!scoreText) {
        console.warn('Score text is undefined');
        return null;
      }

      const trimmedScore = scoreText.trim() as RiskLevel;

      return {
        analysis: {
          rawText: analysisText,
        },
        score: {
          level: trimmedScore,
          description: RISK_LEVEL_DESCRIPTIONS[trimmedScore.toUpperCase() as RiskLevelKey],
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
