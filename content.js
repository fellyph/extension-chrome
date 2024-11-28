// Listen for text input in editable elements
document.addEventListener('input', (e) => {
  if (e.target.matches('textarea, input[type="text"], [contenteditable="true"]')) {
    // Send text to background script for analysis
    chrome.runtime.sendMessage({
      type: 'analyzeText',
      text: e.target.value || e.target.textContent
    });
  }
});

// Listen for suggestions from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'suggestions') {
    // Handle suggestions (e.g., show tooltip or underline)
    showSuggestions(message.suggestions);
  }
});

function showSuggestions(suggestions) {
  // Create or update tooltip with suggestions
  const tooltip = document.getElementById('text-improver-tooltip') || 
                 createTooltip();
  
  tooltip.innerHTML = suggestions.map(s => 
    `<div class="suggestion">${s.suggestion}</div>`
  ).join('');
}

function createTooltip() {
  const tooltip = document.createElement('div');
  tooltip.id = 'text-improver-tooltip';
  tooltip.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 10000;
    display: none;
  `;
  document.body.appendChild(tooltip);
  return tooltip;
}