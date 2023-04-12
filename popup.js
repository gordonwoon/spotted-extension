const startCaptureButton = document.getElementById('startCapture')
const stopCaptureButton = document.getElementById('stopCapture')

startCaptureButton.addEventListener('click', () => {
  chrome.tabs.executeScript({ code: 'startCapture();' })
})

stopCaptureButton.addEventListener('click', () => {
  chrome.tabs.executeScript({ code: 'stopCapture();' })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { selector } = message

  let list = document.getElementById('clickSelectors')
  let li = document.createElement('li')
  li.innerText = selector
  list.appendChild(li)
})
