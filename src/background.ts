import type { UpdateBadgeMessage } from './types/UpdateBadgeMessage';
import type { StorageData } from './types/StorageData';

// Type guard for message type
function isUpdateBadgeMessage(message: any): message is UpdateBadgeMessage {
  return (
    message?.type === 'UPDATE_BADGE' &&
    typeof message.payload?.color === 'string' &&
    typeof message.payload?.text === 'string'
  );
}

console.log('Background script loaded');

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated');
  chrome.action.setBadgeText({ text: '' });

  // Create context menu item
  chrome.contextMenus.create({
    id: 'analyzeSensitiveData',
    title: 'Analyze for Sensitive Data',
    contexts: ['selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'analyzeSensitiveData' && info.selectionText) {
    const selectedText = info.selectionText;

    // Store the selected text temporarily
    await chrome.storage.local.set({ selectedText } satisfies StorageData);

    // Update badge to indicate processing
    await chrome.action.setBadgeText({ text: '...' });

    // Try to open popup, fall back to creating window if not supported
    try {
      await chrome.action.openPopup();
    } catch (error) {
      // Fallback for browsers that don't support openPopup
      await chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 450,
        height: 600,
        top: 100,
        left: 100,
      });
    }
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener(
  (
    message: unknown,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    console.log('Message received:', message);

    if (isUpdateBadgeMessage(message)) {
      const { color, text } = message.payload;
      chrome.action.setBadgeBackgroundColor({ color });
      chrome.action.setBadgeText({ text });
    }
  }
);
