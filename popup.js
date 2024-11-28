import { SuggestionGenerator } from './utils/suggestionGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const improveBtn = document.getElementById('improveBtn');
  const suggestionsList = document.getElementById('suggestionsList');

  improveBtn.addEventListener('click', () => {
    const text = textInput.value;
    const suggestions = SuggestionGenerator.generate(text);
    
    // Clear previous suggestions
    suggestionsList.innerHTML = '';
    
    // Display new suggestions
    suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.textContent = suggestion.suggestion;
      suggestionsList.appendChild(li);
    });
  });
});