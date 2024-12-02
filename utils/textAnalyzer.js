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

      const result = await session.prompt(`## Analyze Text for Sensitive Data

**Task:** Analyze the following text to determine if it contains sensitive information.

**Sensitive Information:**

Sensitive information includes, but is not limited to:

*   **Personally Identifiable Information (PII):**  Full names, email addresses, phone numbers,  dates of birth, Social Security numbers (SSNs), driver's license numbers, passport numbers, etc.
*   **Financial Information:** Credit card numbers, bank account numbers, etc.
*   **Health Information:** Medical records, diagnoses, treatments, etc.

**Output:**

1.  **Sensitive Data Detected:** Indicate with a clear "Yes" or "No" whether sensitive information was found in the text.
2.  **Highlighted Data:** Highlight all sensitive data found in the text.
3.  **Categorization:** Categorize each instance of highlighted data by its type (e.g., "credit card," "SSN," "email address," "full name," etc.). 

[text]
 "${text}"`);
      return result;
    } catch (error) {
      console.warn('AI analysis failed, falling back to basic checks:', error);
    }
  }
}