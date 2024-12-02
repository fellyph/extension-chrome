import { TextAnalyzer } from './textAnalyzer.js';

export class SuggestionGenerator {
  static async generate(text) {
    let result = "";
    
    try {
      // Get grammar issues (now awaiting the async call)
      const grammarIssues = await TextAnalyzer.analyzeText(text);
      result = grammarIssues;
      console.log(result);
      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }
}