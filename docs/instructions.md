## Introduction

This extension is designed to help you analyze text for sensitive information and provide suggestions for improving the text. The content selected in the browser is sent to the extension, which then sends it to the AI to analyze. The AI then returns a score and a list of suggestions for improving the text.

The extension uses the Gemini Nano API present on the new Google Chrome Prompt API. The Gemini Nano API is a powerful tool that can analyze text and provide suggestions for improving the text.

The extension is a prototype to analyze if the Prompt API can be used to analyze text for sensitive information.

## How to use the extension

The extension has two user's flows: the first one is the user selecting text and clicking the "Analyze" button, and the second one is the user clicking the extension icon in the Chrome toolbar and typing the text on the popup and selecting the "Analyze" option.

1. Open the extension in Chrome.
2. Select the text you want to analyze.
3. Click the "Analyze" button.
4. The extension will analyze the text and provide suggestions for improving the text.

## The extension's architecture

The extension is a Chrome extension that uses the Chrome Prompt API to analyze text. The extension is built with TypeScript and React.

The extension is composed of two main parts: the background script and the popup. The background script is the one that handles the communication with the AI and the popup is the one that displays the UI.

The background script is the one that handles the communication with the AI. It is the one that sends the text to the AI and receives the response.

The popup is the one that displays the UI. It is the one that allows the user to select the text to analyze and to see the results.

## The Extension's Prompt

The extension uses the following prompt to analyze the text:

```Analyze the following text to determine if it contains sensitive information.

Sensitive information includes:

*   **Personally Identifiable Information (PII):**  Full names, email addresses, phone numbers,  dates of birth, Social Security numbers (SSNs), driver's license numbers, passport numbers, etc.
*   **Financial Information:** Credit card numbers, bank account numbers, etc.
*   **Health Information:** Medical records, diagnoses, treatments, etc.

**Output:**

1.  **Sensitive Data Detected:** Indicate with a clear "Yes" or "No" whether sensitive information was found in the text.
2.  **Highlighted Data:** Highlight all sensitive data found in the text.
3.  **Categorization:** Categorize each instance of highlighted data by its type (e.g., "credit card," "SSN," "email address," "full name," etc.). 

Text:
{text}```

The prompt is sent to the AI and the AI returns the response. The response is then displayed in the popup.

*System instructions:*

The system instructions are the ones that tell the AI how to analyze the text. They are the ones that tell the AI what sensitive information is and how to highlight it.

*User instructions:*

The user instructions are the ones that tell the user how to use the extension. They are the ones that tell the user how to select the text to analyze and how to see the results.
