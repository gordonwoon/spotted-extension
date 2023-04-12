const startCaptureButton = document.getElementById('startCapture')
const stopCaptureButton = document.getElementById('stopCapture')

startCaptureButton.addEventListener('click', () => {
  chrome.tabs.executeScript({ code: 'startCapture();' })
})

stopCaptureButton.addEventListener('click', () => {
  chrome.tabs.executeScript({ code: 'stopCapture();' })
})
