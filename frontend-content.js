// Listen for messages from the content script and forward the message to the frontend application or stop tracking based on its action property
chrome.runtime.onMessage.addListener(
  ({ action, userActions, trackedIndex }, sender, sendResponse) => {
    if (action === 'send-action') {
      window.postMessage({ action, userActions }, '*')
    } else if (action === 'stop-tracking') {
      window.postMessage({ action, trackedIndex }, '*')
    }
  }
)

// Listen for messages from the frontend application and forward them to the background script
window.addEventListener('message', ({ source, data }) => {
  if (source !== window) return

  if (data.action === 'start-tracking') {
    chrome.runtime.sendMessage({
      action: 'start-tracking',
      url: data.url
    })
  }
})
