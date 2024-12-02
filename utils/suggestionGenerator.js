import { TextAnalyzer } from './textAnalyzer.js';

export class SuggestionGenerator {
  static async generate(text) {
    let result = "";
    
    try {
      // Get grammar issues (now awaiting the async call)
      const textAnalyses = await TextAnalyzer.analyzeText(text);
      console.log(textAnalyses);
      return textAnalyses;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }
}