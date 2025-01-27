import React from 'react';
import { useTranslation } from 'react-i18next';
import { RISK_LEVEL_STYLES } from '../constants/riskLevels';
import type { RiskLevelProps, RiskLevelKey } from '../types/Risk';

export function RiskLevel({ score }: RiskLevelProps) {
  const { t } = useTranslation();

  const levelKey = score.level.toUpperCase() as RiskLevelKey;
  const levelColor = RISK_LEVEL_STYLES[levelKey] ?? RISK_LEVEL_STYLES.BLACK;

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold">{t('riskLevel.title')}:</span>
        <span className={`rounded ${levelColor} px-2 py-1 text-sm font-medium text-white`}>
          {t(`riskLevel.${score.level.toLowerCase()}`)}
        </span>
      </div>
      <p className="text-sm text-gray-600">{score.description}</p>
    </div>
  );
}
