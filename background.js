console.log('Background script loaded');

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated');
  chrome.action.setBadgeText({ text: '' });

  // Create context menu item
  chrome.contextMenus.create({
    id: 'analyzeSensitiveData',
    title: 'Analyze for Sensitive Data',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'analyzeSensitiveData') {
    const selectedText = info.selectionText;
    
    // Store the selected text temporarily
    await chrome.storage.local.set({ selectedText: selectedText });
    
    // Update badge to indicate processing
    chrome.action.setBadgeText({ text: '...' });
    
    // Try to open popup, fall back to creating window if not supported
    try {
      await chrome.action.openPopup();
    } catch (error) {
      // Fallback for browsers that don't support openPopup
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 450,
        height: 600,
        top: 100,
        left: 100
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  if (message.type === 'UPDATE_BADGE') {
    const { color, text } = message.payload;
    chrome.action.setBadgeBackgroundColor({ color });
    chrome.action.setBadgeText({ text });
  }
});