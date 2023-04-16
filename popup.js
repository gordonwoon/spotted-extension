// Get the stop-capture button element by its ID using getElementById method and initialize the trackedIndex variable to 0
const stopCaptureButton = document.getElementById('stop-capture')
let trackedIndex = 0

// When the stop-capture button is clicked, send a message with an action of 'stop-tracking' along with the current tracked index to the runtime object
stopCaptureButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({
    action: 'stop-tracking',
    trackedIndex
  })

  window.close()
})

// Listen for clicks on the track-selector button and update the trackedIndex variable and displayed text accordingly
document.getElementById('track-selector').addEventListener('click', () => {
  const selectedSelector = document.querySelector(
    'input[name=selector]:checked'
  )
  trackedIndex = selectedSelector.id.split('-')[1]

  document.getElementById('tracked-selector').textContent =
    selectedSelector.value
})

// Listen for messages from other parts of the extension that contain an array of user actions and update the DOM of the popup window
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { userActions } = message

  // Clear the selector form before appending new elements
  const selectorForm = document.getElementById('selector-form')
  selectorForm.innerHTML = ''

  // Create and append radio input fields for each user action with corresponding labels
  userActions.forEach((action, index) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'radio')
    input.setAttribute('name', 'selector')
    input.setAttribute('id', `selector-${index}`)
    input.setAttribute('value', action.textContent)

    const labelText = `Selector: ${action.selector}, <strong>Text: ${action.textContent}</strong>`
    const label = document.createElement('label')
    label.for = `selector-${index}`
    label.innerHTML = labelText

    const selectorItem = document.createElement('div')
    selectorItem.classList.add('selector-item')

    selectorItem.appendChild(input)
    selectorItem.appendChild(label)

    selectorForm.appendChild(selectorItem)
  })
})
