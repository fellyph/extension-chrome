import { RISK_LEVEL_STYLES } from '../constants/riskLevels';

export type RiskLevelKey = keyof typeof RISK_LEVEL_STYLES;
export type RiskLevel = 'Green' | 'Yellow' | 'Red' | 'Black';

export interface RiskScore {
  level: RiskLevel;
  description: string;
}

export interface RiskLevelProps {
  score: RiskScore;
}
