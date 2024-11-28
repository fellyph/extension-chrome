export class TextAnalyzer {
  static analyzeGrammar(text) {
    const issues = [];
    
    // Common grammar rules
    const rules = [
      {
        pattern: /\b(its|it's)\b/g,
        check: (match, context) => {
          // Check for incorrect its/it's usage
          const isContraction = context.includes("it is") || context.includes("it has");
          if ((match === "its" && isContraction) || (match === "it's" && !isContraction)) {
            return `Consider using '${match === "its" ? "it's" : "its"}' instead`;
          }
        }
      },
      {
        pattern: /\b(there|their|they're)\b/g,
        check: (match, context) => {
          // Basic there/their/they're check
          return "Verify correct usage of there/their/they're";
        }
      },
      {
        pattern: /\s+,/g,
        check: () => "Remove space before comma"
      }
    ];

    rules.forEach(rule => {
      let match;
      while ((match = rule.pattern.exec(text)) !== null) {
        const suggestion = rule.check(match[0], text);
        if (suggestion) {
          issues.push({
            original: match[0],
            position: match.index,
            suggestion
          });
        }
      }
    });

    return issues;
  }

  static checkSpelling(text) {
    // Basic spelling checks (simplified version)
    const commonMisspellings = {
      'recieve': 'receive',
      'seperate': 'separate',
      'occured': 'occurred',
      'definately': 'definitely'
    };

    const issues = [];
    text.split(/\s+/).forEach(word => {
      const correction = commonMisspellings[word.toLowerCase()];
      if (correction) {
        issues.push({
          original: word,
          suggestion: `Consider using '${correction}' instead of '${word}'`
        });
      }
    });

    return issues;
  }
}