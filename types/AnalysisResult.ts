export interface AnalysisResult {
  analysis: {
    highlightedData: Array<{
      data: string;
      category: string;
    }>;
    rawText: string;
  };
  score: {
    level: 'Green' | 'Yellow' | 'Red';
    description: string;
  };
}
