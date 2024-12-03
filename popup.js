import { SuggestionGenerator } from './utils/suggestionGenerator.js';
import { marked } from 'marked';

// Configure marked for security
marked.setOptions({
  sanitize: true, // Prevents XSS attacks
});

document.addEventListener('DOMContentLoaded', async () => {
  const textInput = document.getElementById('textInput');
  const improveBtn = document.getElementById('improveBtn');
  const suggestionsList = document.getElementById('suggestionsList');
  const spinner = document.getElementById('spinner');
  const analysisSection = document.getElementById('analysisSection');
  const header = document.querySelector('.app-header');

  // Add close button handler
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.className = 'absolute top-2 right-2 text-gray-500 hover:text-gray-700';
  closeBtn.addEventListener('click', () => {
    window.close();
  });
  header.appendChild(closeBtn);

  // Check for selected text from context menu
  const { selectedText } = await chrome.storage.local.get('selectedText');
  if (selectedText) {
    textInput.value = selectedText;
    // Clear the stored text
    await chrome.storage.local.remove('selectedText');
    // Automatically trigger analysis
    analyzeText(selectedText);
  }

  improveBtn.addEventListener('click', () => {
    const text = textInput.value;
    analyzeText(text);
  });

  async function analyzeText(text) {
    try {
      // Clear previous results and hide analysis section
      suggestionsList.innerHTML = '';
      analysisSection.classList.add('hidden');

      // Disable button and show spinner
      improveBtn.disabled = true;
      spinner.classList.remove('hidden');

      const response = await SuggestionGenerator.generate(text);

      // Extract Risk Score
      const riskScoreMatch = response.match(/Risk Score=(Red|Yellow|Green)/i);
      const riskScore = riskScoreMatch ? riskScoreMatch[1].toLowerCase() : null;

      // Remove the Risk Score line from the response
      const cleanResponse = response.replace(/Risk Score=(?:Red|Yellow|Green)\n?/i, '');

      // Update badge
      if (riskScore) {
        await updateBadge(riskScore);
      }

      // Render markdown without the risk score line
      const html = marked(cleanResponse);
      suggestionsList.innerHTML = html;

      // Show analysis section after content is loaded
      analysisSection.classList.remove('hidden');
    } catch (error) {
      console.error('Error processing suggestions:', error);
      suggestionsList.innerHTML =
        '<div class="p-2 text-red-600">Error processing text. Please try again.</div>';
      analysisSection.classList.remove('hidden');
    } finally {
      // Re-enable button and hide spinner
      improveBtn.disabled = false;
      spinner.classList.add('hidden');
    }
  }

  async function updateBadge(riskScore) {
    // Get color based on risk score
    const badgeColors = {
      red: '#ef4444', // Tailwind red-500
      yellow: '#eab308', // Tailwind yellow-500
      green: '#22c55e', // Tailwind green-500
    };

    // Send message to background script to update badge
    await chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      payload: {
        color: badgeColors[riskScore],
        text: riskScore[0].toUpperCase(), // First letter: R, Y, or G
      },
    });
  }
});
