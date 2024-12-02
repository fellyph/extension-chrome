export class TextAnalyzer {
  static async createAISession() {
    // Check if AI capabilities are available
    const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();

    if (!capabilities?.available) {
      console.warn('AI analysis not available');
    }
    if (capabilities.available === 'no') {
      const session = await chrome.aiOriginTrial.languageModel.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
    }

    // Create an AI session with appropriate system prompt
    return await chrome.aiOriginTrial.languageModel.create({
      systemPrompt: `You are a highly sensitive data detection AI. Your primary goal is to identify and categorize sensitive information with high accuracy and minimal false positives. Prioritize user privacy and data security. Always err on the side of caution when identifying potentially sensitive data, even if it means occasionally flagging something that is not truly sensitive.`,
      temperature: 0.5,
      topK: capabilities.defaultTopK,
    });
  }

  static async analyzeText(text) {
    try {
      const session = await this.createAISession();
      if (!session) {
        console.warn('AI analysis not available');
      }

      const result = await session.prompt(`Analyze the following text for sensitive information, including:
        Credit card numbers
        Social Security numbers (SSNs)
        Email addresses
        Phone numbers
        Full names
        Highlight any sensitive data found and categorize each instance by its type (e.g., 'credit card', 'SSN', etc.): "${text}"`);
      return result;
    } catch (error) {
      console.warn('AI analysis failed, falling back to basic checks:', error);
    }
  }
}