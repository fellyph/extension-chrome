export const RISK_LEVELS = {
  BLACK: 'BLACK',
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  RED: 'RED',
} as const;

export const RISK_LEVEL_STYLES = {
  BLACK: 'bg-black',
  GREEN: 'bg-green-500',
  YELLOW: 'bg-yellow-500',
  RED: 'bg-red-500',
} as const;

export const RISK_LEVEL_DESCRIPTIONS = {
  GREEN: 'No sensitive data detected',
  YELLOW: 'Potentially sensitive data detected',
  RED: 'Sensitive data detected',
  BLACK: 'Highly sensitive data detected - requires immediate attention',
} as const;
