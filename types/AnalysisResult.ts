export interface AnalysisResult {
  analysis: {
    rawText: string;
  };
  score: {
    level: 'Green' | 'Yellow' | 'Red' | 'Black';
    description: string;
  };
}
