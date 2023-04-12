// Initializing variables to null
let requestTabId = null
let targetTabId = null
let popupId = null

// Listen for incoming messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    // Send response with required data
    case 'send-selector':
      console.log('received selector', request.selector)
      chrome.tabs.sendMessage(requestTabId, {
        action: 'send-selector',
        selector: request.selector
      })

      chrome.runtime.sendMessage(popupId, { selector: request.selector })
      break

    // Send response with required data
    case 'stop-tracking':
      chrome.tabs.sendMessage(requestTabId, {
        action: 'stop-tracking',
        selector: request.selector
      })
      break

    // Create a new tab and execute a script in it
    case 'start-tracking':
      console.log('Create tab message received')

      chrome.tabs.create({ url: request.trackingId }, newTab => {
        console.log(
          `New tab created with id ${newTab.id} at index ${newTab.index}, with URL ${newTab.url}`
        )

        requestTabId = sender.tab.id
        targetTabId = newTab.id

        chrome.scripting.executeScript(
          {
            target: { tabId: targetTabId },
            files: ['injected-content.js']
          },
          () => {
            chrome.scripting.executeScript({
              target: { tabId: targetTabId },
              args: [requestTabId],
              func: (...args) => setRequestTabId(...args)
            })

            chrome.windows.create(
              {
                url: chrome.runtime.getURL('popup.html'),
                type: 'popup',
                height: 600,
                width: 400
                /* can also set width/height here, see docs */
              },
              popup => {
                popupId = popup.id
              }
            )

            // function openPopup() {
            //   chrome.browserAction.openPopup({ popup: 'popup.html' })
            // }

            // chrome.scripting.executeScript({
            //   target: { tabId: targetTabId },
            //   func: openPopup
            // })
          }
        )
      })
      break
  }
})
