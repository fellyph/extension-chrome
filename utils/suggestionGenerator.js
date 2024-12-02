import { TextAnalyzer } from './textAnalyzer.js';

export class SuggestionGenerator {
  static async generate(text) {
    const result = "";
    
    try {
      // Get grammar issues (now awaiting the async call)
      const grammarIssues = await TextAnalyzer.analyzeText(text);
      result = grammarIssues;

      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }
}