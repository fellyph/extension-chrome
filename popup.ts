import { SuggestionGenerator } from './utils/suggestionGenerator';
import { marked } from 'marked';
import type { BadgeColors } from './types/BadgeColors';
import type { UpdateBadgeMessage } from './types/UpdateBadgeMessage';

// Type definitions
type RiskScore = 'red' | 'yellow' | 'green' | 'black';

// Configure marked for security
marked.setOptions({
  sanitize: true, // Prevents XSS attacks
});

document.addEventListener('DOMContentLoaded', async () => {
  // DOM element references with type assertions
  const textInput = document.getElementById('textInput') as HTMLTextAreaElement;
  const improveBtn = document.getElementById('improveBtn') as HTMLButtonElement;
  const suggestionsList = document.getElementById('suggestionsList') as HTMLDivElement;
  const spinner = document.getElementById('spinner') as HTMLDivElement;
  const analysisSection = document.getElementById('analysisSection') as HTMLElement;
  const header = document.querySelector('.app-header') as HTMLElement;
  const closeBtn = document.getElementById('closeBtn') as HTMLButtonElement;

  // Add close button handler
  closeBtn.addEventListener('click', () => {
    window.close();
  });

  // Check for selected text from context menu
  const { selectedText } = (await chrome.storage.local.get('selectedText')) as StorageData;
  if (selectedText) {
    textInput.value = selectedText;
    // Clear the stored text
    await chrome.storage.local.remove('selectedText');
    // Automatically trigger analysis
    await analyzeText(selectedText);
  }

  improveBtn.addEventListener('click', () => {
    const text = textInput.value;
    analyzeText(text);
  });

  async function analyzeText(text: string): Promise<void> {
    try {
      // Clear previous results and hide analysis section
      suggestionsList.innerHTML = '';
      analysisSection.classList.add('hidden');

      // Update button to loading state
      improveBtn.disabled = true;
      spinner.classList.remove('hidden');

      const result = await SuggestionGenerator.generate(text);

      if (!result) {
        throw new Error('Failed to generate analysis');
      }

      // Update badge based on score
      await updateBadge(result.score.level.toLowerCase() as RiskScore);
      console.log(result);
      // Generate HTML for the analysis
      const analysisHtml = `
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="font-semibold">Risk Level:</span>
            <span class="p-1 rounded text-sm text-white bg-${result.score.level.toLowerCase()}-500">
              ${result.score.level}
            </span>
          </div>
          <p class="text-gray-600 text-sm">${result.score.description}</p>
        </div>
        <div class="mt-4">
          <h4 class="font-semibold mb-2">Full Analysis:</h4>
          ${marked(result.analysis.rawText)}
        </div>
      `;

      suggestionsList.innerHTML = analysisHtml;
      analysisSection.classList.remove('hidden');
    } catch (error) {
      console.error('Error processing suggestions:', error);
      suggestionsList.innerHTML = `
        <div class="p-3 bg-red-50 text-red-600 rounded">
          Error processing text. Please try again.
        </div>
      `;
      analysisSection.classList.remove('hidden');
    } finally {
      // Restore button to active state
      improveBtn.disabled = false;
      spinner.classList.add('hidden');
    }
  }

  async function updateBadge(riskScore: RiskScore) {
    // Get color based on risk score
    const badgeColors: BadgeColors = {
      black: '#000000', // Black for highest risk
      red: '#ef4444', // Tailwind red-500
      yellow: '#eab308', // Tailwind yellow-500
      green: '#22c55e', // Tailwind green-500
    };

    // Send message to background script to update badge
    await chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      payload: {
        color: badgeColors[riskScore],
        text: '', // Remove the initial from the badge
      },
    } as UpdateBadgeMessage);
  }
});
