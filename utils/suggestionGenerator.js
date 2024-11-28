import { TextAnalyzer } from './textAnalyzer.js';

export class SuggestionGenerator {
  static generate(text) {
    const suggestions = [];
    
    // Get grammar issues
    const grammarIssues = TextAnalyzer.analyzeGrammar(text);
    suggestions.push(...grammarIssues);

    // Get spelling issues
    const spellingIssues = TextAnalyzer.checkSpelling(text);
    suggestions.push(...spellingIssues);

    // Style improvements
    this.analyzeStyle(text).forEach(suggestion => {
      suggestions.push(suggestion);
    });

    return suggestions;
  }

  static analyzeStyle(text) {
    const suggestions = [];
    
    // Check for passive voice
    const passiveVoicePatterns = /\b(am|is|are|was|were|being|been|be)\s+\w+ed\b/gi;
    if (passiveVoicePatterns.test(text)) {
      suggestions.push({
        type: 'style',
        suggestion: 'Consider using active voice for clearer communication'
      });
    }

    // Check for sentence length
    const sentences = text.split(/[.!?]+/);
    sentences.forEach(sentence => {
      if (sentence.trim().split(/\s+/).length > 25) {
        suggestions.push({
          type: 'style',
          suggestion: 'Consider breaking this long sentence into smaller ones for better readability'
        });
      }
    });

    return suggestions;
  }
}