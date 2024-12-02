console.log('Background script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  if (message.type === 'UPDATE_BADGE') {
    const { color, text } = message.payload;
    chrome.action.setBadgeBackgroundColor({ color });
    chrome.action.setBadgeText({ text });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated');
  chrome.action.setBadgeText({ text: '' });
});