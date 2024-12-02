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

      const result = await session.prompt(`**Task:** Analyze the following text for sensitive information and assign a risk score.

**Risk Scoring:**

*   Green (Low Risk):** No sensitive data found.
*   Yellow (Medium Risk):**  Some potentially identifying data found (e.g., company name, first name, website URL).
*   Red (High Risk):** Sensitive information found (e.g., credit card numbers, Social Security numbers (SSNs), email addresses, phone numbers, full names,  dates of birth, medical information, driver's license numbers, passport numbers, bank account numbers, etc.).

**Output:**


1.  **Highlighted Data:** Highlight all sensitive or potentially identifying data found in the text.
2.  **Categorization:** Categorize each instance of highlighted data by its type (e.g., "credit card," "SSN," "email address," "full name," "company name," etc.).
3.  [Risk Score=Assign a risk score (Green, Yellow, or Red) based on the detected information]
 "${text}"`);
      return result;
    } catch (error) {
      console.warn('AI analysis failed, falling back to basic checks:', error);
    }
  }
}