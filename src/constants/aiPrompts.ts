export const AI_PROMPTS = {
  ANALYZE: `Analyze the following text to determine if it contains sensitive information.

Sensitive information includes:

*   **Personally Identifiable Information (PII):**  Full names, email addresses, phone numbers,  dates of birth, Social Security numbers (SSNs), driver's license numbers, passport numbers, etc.
*   **Financial Information:** Credit card numbers, bank account numbers, etc.
*   **Health Information:** Medical records, diagnoses, treatments, etc.

**Output:**

1.  **Sensitive Data Detected:** Indicate with a clear "Yes" or "No" whether sensitive information was found in the text.
2.  **Highlighted Data:** Highlight all sensitive data found in the text.
3.  **Categorization:** Categorize each instance of highlighted data by its type (e.g., "credit card," "SSN," "email address," "full name," etc.).`,

  SCORE: `Classify the following text based on its sensitivity level:

*   Green: Public - Information that can be openly shared without any adverse consequences.
*   Yellow: Internal - Data intended for use within the organization but poses no severe risk if disclosed.
*   Red: Confidential - Information that carries a risk of harm if disclosed and should only be shared with specific individuals.
*   Black: Restricted - Highly sensitive information, requiring the strictest controls. Unauthorized disclosure could lead to significant damage.

Respond with only the color classification (Green, Yellow, Red, or Black).`,
} as const;
