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

// Array to store user actions
const userActions = []

const getText = element => {
  return element && element.textContent ? element.textContent.trim() : ''
}

// Handler function for click events
function handleClick(event) {
  // Only capture clicks if capturing is enabled
  if (!capturing) return

  // event.preventDefault()
  // event.stopPropagation()

  const selector = getCssPath(event.target)
  const textContent = getText(document.querySelector(selector))

  console.log('clicked:', selector)

  // Add the selector to the array of click selectors
  userActions.push({ selector, textContent })

  // Send a message to the browser extension with the clicked element's selector
  chrome.runtime.sendMessage({
    action: 'send-action',
    userActions
  })
}

function handleRoute(data) {
  // Store route change information
  const route = data.newUrl
  console.log('route changed:', route)

  const lastAction = userActions[userActions.length - 1]

  userActions[userActions.length - 1] = { ...lastAction, route }

  chrome.runtime.sendMessage({
    action: 'send-action',
    userActions
  })
}

// Function to stop capturing
function stopCapture() {
  capturing = false
  console.log('Capture stopped')
  console.log('User Actions:', userActions)

  chrome.runtime.sendMessage({
    action: 'stop-tracking',
    userActions
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

// // Add route changes event listener
// const wrapHistoryMethod = methodName => {
//   const originalMethod = history[methodName]

//   history[methodName] = function (state, title, url) {
//     const result = originalMethod.apply(this, arguments)

//     const event = new CustomEvent('urlchange', {
//       detail: { state, title, url, method: methodName }
//     })

//     window.dispatchEvent(event)

//     return result
//   }
// }

// wrapHistoryMethod('pushState')
// wrapHistoryMethod('replaceState')

// window.addEventListener('urlchange', handleRoute)

// Monitor URL changes
let lastUrl = window.location.href

const checkUrlChange = () => {
  if (lastUrl !== window.location.href) {
    lastUrl = window.location.href
    console.log('URL changed:', lastUrl)
    handleRoute({ lastUrl, newUrl: window.location.href })
    // Store route change information
  }
  setTimeout(checkUrlChange, 500) // Check every 500 ms
}

checkUrlChange()

// Observe DOM changes and reattach the click event listener
const observer = new MutationObserver(mutations => {
  document.body.removeEventListener('click', handleClick)
  document.body.addEventListener('click', handleClick)
})

observer.observe(document, { childList: true, subtree: true })
