import { SuggestionGenerator } from './utils/suggestionGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const improveBtn = document.getElementById('improveBtn');
  const suggestionsList = document.getElementById('suggestionsList');

  improveBtn.addEventListener('click', async () => {
    const text = textInput.value;
    
    try {
      // Now awaiting the async generate method
      const suggestions = await SuggestionGenerator.generate(text);
      
      // Clear previous suggestions
      suggestionsList.innerHTML = '';
      const li = document.createElement('li');
      li.textContent = suggestions.result;
      suggestionsList.appendChild(li);

    } catch (error) {
      console.error('Error processing suggestions:', error);
      // Optionally display error to user
      suggestionsList.innerHTML = '<li class="error">Error processing text. Please try again.</li>';
    }
  });
});