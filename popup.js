import { SuggestionGenerator } from './utils/suggestionGenerator.js';
import { marked } from 'marked';

// Configure marked for security
marked.setOptions({
  sanitize: true  // Prevents XSS attacks
});

document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const improveBtn = document.getElementById('improveBtn');
  const suggestionsList = document.getElementById('suggestionsList');

  improveBtn.addEventListener('click', async () => {
    try {
      const text = textInput.value;
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
      
    } catch (error) {
      console.error('Error processing suggestions:', error);
      suggestionsList.innerHTML = '<div class="p-2 text-red-600">Error processing text. Please try again.</div>';
    }
  });

  async function updateBadge(riskScore) {
    // Get color based on risk score
    const badgeColors = {
      red: '#ef4444',    // Tailwind red-500
      yellow: '#eab308', // Tailwind yellow-500
      green: '#22c55e'   // Tailwind green-500
    };
    
    // Send message to background script to update badge
    await chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      payload: {
        color: badgeColors[riskScore],
        text: riskScore[0].toUpperCase() // First letter: R, Y, or G
      }
    });
  }
});