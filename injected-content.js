// Declare variables for tracking ID, request tab ID and capturing state
let trackingId = null
let requestTabId = null
let capturing = false

// Function to set the request tab ID
function setRequestTabId(tabId) {
  console.log('setting requestTabId', tabId)
  requestTabId = tabId
  capturing = true
}

// Array to store click selectors
const clickSelectors = []

// Handler function for click events
function handleClick(event) {
  // Only capture clicks if capturing is enabled
  if (!capturing) return

  // event.preventDefault()
  // event.stopPropagation()

  const selector = getCssPath(event.target)

  // Send a message to the browser extension with the clicked element's selector
  console.log('Sending selector:', selector, requestTabId)

  chrome.runtime.sendMessage({
    action: 'send-selector',
    selector: selector
  })

  // Add the selector to the array of click selectors
  clickSelectors.push(selector)
}

// Function to stop capturing
function stopCapture() {
  capturing = false
  console.log('Capture stopped')
  console.log('Click selectors:', clickSelectors)

  chrome.runtime.sendMessage({
    action: 'stop-tracking',
    selector: clickSelectors
  })
}

// Function to generate CSS path for an element
function getCssPath(el) {
  const path = []
  while (el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase()
    if (el.id) {
      selector += '#' + el.id
      path.unshift(selector)
      break
    } else {
      let sibling = el
      let siblingSelector = selector
      let index = 1
      while ((sibling = sibling.previousElementSibling)) {
        if (sibling.nodeName.toLowerCase() === siblingSelector) {
          index++
        }
      }
      if (index > 1) {
        selector += ':nth-of-type(' + index + ')'
      }
    }
    path.unshift(selector)
    el = el.parentNode
  }
  return path.join(' > ')
}

// Add click event listener to the entire document's body
document.body.addEventListener('click', handleClick)
