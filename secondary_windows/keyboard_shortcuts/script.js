const { remote } = require('electron')

const win = remote.getCurrentWindow()
const closeButton = document.getElementById('close')

closeButton.addEventListener('click', () => {
  win.close()
})