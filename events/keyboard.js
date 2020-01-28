const { remote } = require('electron')
const win = remote.getCurrentWindow()

exports.setUpKeyboardShortcuts = (player, view) => {
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Home' && !view.elements.progressBarInput.disabled) {
      player.media.currentTime = 0

      view.showMessage('position')
    }

    if (event.code === 'ArrowLeft' && !event.ctrlKey && !view.elements.progressBarInput.disabled) {
      player.media.currentTime -= 5

      view.showMessage('position')
    }

    if (event.code === 'ArrowRight' && !event.ctrlKey && !view.elements.progressBarInput.disabled) {
      player.media.currentTime += 5

      view.showMessage('position')
    }

    if (event.code === 'ArrowLeft' && event.ctrlKey && !view.elements.progressBarInput.disabled) {
      player.media.currentTime -= 15

      view.showMessage('position')
    }

    if (event.code === 'ArrowRight' && event.ctrlKey && !view.elements.progressBarInput.disabled) {
      player.media.currentTime += 15

      view.showMessage('position')
    }
    
    if (event.code === 'KeyO' && event.ctrlKey) {
      view.elements.openFileButton.click()
    }
    
    if (event.code === 'Space') {
      view.elements.playPauseToggle.click()
      
      view.showMessage('status')
    }
    
    if (event.code === 'KeyM') {
      view.elements.muteButton.click()
      
      view.showMessage('volume')
    }
    
    if (event.code === 'ArrowUp' && !event.ctrlKey) {
      view.elements.volumeSlider.value = parseFloat(view.elements.volumeSlider.value) + 0.05
      view.elements.volumeSlider.dispatchEvent(new Event('input'))

      view.showMessage('volume')
    }

    if (event.code === 'ArrowDown' && !event.ctrlKey) {
      view.elements.volumeSlider.value = parseFloat(view.elements.volumeSlider.value) - 0.05
      view.elements.volumeSlider.dispatchEvent(new Event('input'))

      view.showMessage('volume')
    }

    if (event.code === 'KeyS') {
      view.elements.resetSpeedButton.click()

      view.showMessage('speed')
    }

    if (event.code === 'ArrowUp' && event.ctrlKey) {
      view.elements.speedSlider.value = parseFloat(view.elements.speedSlider.value) + 0.05
      view.elements.speedSlider.dispatchEvent(new Event('input'))

      view.showMessage('speed')
    }

    if (event.code === 'ArrowDown' && event.ctrlKey) {
      view.elements.speedSlider.value = parseFloat(view.elements.speedSlider.value) - 0.05
      view.elements.speedSlider.dispatchEvent(new Event('input'))

      view.showMessage('speed')
    }

    if (event.code === 'KeyR') {
      view.elements.repeatToggle.click()

      view.showMessage('repeat')
    }

    if (event.code === 'KeyF') {
      view.elements.fullscreenButton.click()
    }

    if (event.code === 'Escape' && win.isFullScreen()) {
      view.elements.fullscreenButton.click()
    }
  })
}