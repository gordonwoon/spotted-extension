chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'send-selector') {
    // Forward the message to the frontend application
    window.postMessage(
      { action: 'send-selector', selector: request.selector },
      '*'
    )
  }
})

window.addEventListener('message', event => {
  if (event.source !== window) return

  if (event.data.action === 'start-tracking') {
    // Forward the message to the background script
    chrome.runtime.sendMessage({
      action: 'start-tracking',
      trackingId: event.data.trackingId
    })
  }
})
