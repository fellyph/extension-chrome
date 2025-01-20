import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalysisResult } from '../types/AnalysisResult';

interface RiskLevelProps {
  score: AnalysisResult['score'];
}

export const RiskLevel: React.FC<RiskLevelProps> = ({ score }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold">{t('riskLevel.title')}:</span>
        <span className={`rounded bg-${score.level.toLowerCase()}-500 p-1 text-sm text-white`}>
          {t(`riskLevel.${score.level.toLowerCase()}`)}
        </span>
      </div>
      <p className="text-sm text-gray-600">{score.description}</p>
    </div>
  );
};
