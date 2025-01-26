import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import type { AnalysisResult } from '../types/AnalysisResult';
import { TextAnalyzer } from './textAnalyzer';
import { RISK_LEVELS, RISK_LEVEL_STYLES } from '../constants/riskLevels';

type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];

interface TextAnalyzerComponentProps {
  text: string;
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export function TextAnalyzerComponent({ text, onAnalysisComplete }: TextAnalyzerComponentProps) {
  const [analysisResult, setAnalysisResult] = useState<string>();
  const [riskScore, setRiskScore] = useState<RiskLevel>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function analyze() {
      if (!text) return;

      setIsLoading(true);
      try {
        const [analysis, score] = await Promise.all([
          TextAnalyzer.analyzeText(text),
          TextAnalyzer.scoreText(text),
        ]);

        setAnalysisResult(analysis);
        setRiskScore(score as RiskLevel);

        if (onAnalysisComplete && analysis && score) {
          onAnalysisComplete({
            analysis: {
              rawText: analysis,
            },
            score: {
              level: score as 'Green' | 'Yellow' | 'Red' | 'Black',
              description: score,
            },
          });
        }
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    analyze();
  }, [text, onAnalysisComplete]);

  if (isLoading) {
    return <div className="loading">Analyzing text...</div>;
  }

  if (!analysisResult) {
    return null;
  }

  return (
    <div className="analysis-result">
      <div className={`risk-score ${RISK_LEVEL_STYLES[riskScore as keyof typeof RISK_LEVELS]}`}>
        Risk Level: {riskScore}
      </div>
      <div className="analysis" dangerouslySetInnerHTML={{ __html: marked(analysisResult) }} />
    </div>
  );
}
