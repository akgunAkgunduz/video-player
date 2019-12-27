const path = require('path')
const { ipcRenderer, remote } = require('electron')
const Player = require('./player')
const View = require('./view')
const uiElements = require('../utils/ui-elements')
const { sanitizeFilePath, isFileTypeSupported } = require('../utils/helpers')

const win = remote.getCurrentWindow()
const player = new Player(document.getElementById('video'))
const view = new View(uiElements)

class Controller {
  setUpEventListenersForPlayer() {
    player.media.addEventListener('error', () => {
      ipcRenderer.send('show-player-error-message-box', { code: player.media.error.code, message: player.media.error.message })
      view.resetScene()
    })

    player.media.addEventListener('loadedmetadata', () => {
      view.elements.progressBarInput.max = player.media.duration
      view.resizeVideo()
      view.removeDragAndDropInfo()
      view.enableControls()
    })

    player.media.addEventListener('play', () => {
      view.updatePlayPauseToggle(player)
    })

    player.media.addEventListener('pause', () => {
      view.updatePlayPauseToggle(player)
    })

    player.media.addEventListener('timeupdate', () => {
      //todo: another way of fixing this?
      if (player.isReady) {
        view.updateTimeInfo(player)
        view.updateProgressBar(player)
      }
    })

    player.media.addEventListener('ended', () => {
      view.updatePlayPauseToggle(player)
    })

    player.media.addEventListener('volumechange', () => {
      view.updateVolumeElements(player.media.volume)
    })

    player.media.addEventListener('ratechange', () => {
      view.updateSpeedElements(player.media.playbackRate)
    })
  }

  setUpEventListenersForView() {
    view.elements.videoContainer.addEventListener('dragover', (event) => event.preventDefault(), false)

    view.elements.videoContainer.addEventListener('dragleave', (event) => event.preventDefault(), false)

    view.elements.videoContainer.addEventListener('dragend', (event) => event.preventDefault(), false)

    view.elements.videoContainer.addEventListener('drop', (event) => {
      event.preventDefault()
      const firstItem = event.dataTransfer.items[0].webkitGetAsEntry()

      if (firstItem.isFile) {
        const filePath = event.dataTransfer.files[0].path

        if (isFileTypeSupported(filePath)) {
          player.media.src = sanitizeFilePath(filePath)

          view.updateAppTitle(path.basename(filePath))
        } else {
          ipcRenderer.send('show-file-type-not-supported-message-box')
        }
      } else {
        ipcRenderer.send('show-not-a-file-message-box')
      }
    })

    view.elements.videoContainer.addEventListener('click', () => {
      view.elements.playPauseToggle.click()
    })
    
    view.elements.videoContainer.addEventListener('dblclick', () => {
      view.elements.fullscreenButton.click()
    })

    view.elements.videoContainer.addEventListener('wheel', (event) => {
      if (event.deltaY === -100) {
        view.elements.volumeSlider.value = parseFloat(view.elements.volumeSlider.value) + 0.05
      } else {
        view.elements.volumeSlider.value = parseFloat(view.elements.volumeSlider.value) - 0.05
      }

      view.elements.volumeSlider.dispatchEvent(new Event('input'))

      view.showMessage('volume', player)
    })

    view.elements.progressBarInput.addEventListener('input', (event) => {
      player.media.currentTime = event.target.value

      view.updateProgressBar(player)
    })

    view.elements.progressBarInput.addEventListener('mousemove', (event) => {
      view.showProgressBarInfo(player, event)
    })

    view.elements.openFileButton.addEventListener('click', () => {
      ipcRenderer.send('open-file-dialog')
    })

    view.elements.playPauseToggle.addEventListener('click', () => {
      player.toggle()
    })

    view.elements.muteButton.addEventListener('click', () => {
      if (player.media.volume === 0) {
        if (view.volume === 0) {
          view.updateVolume(0.5)
        }
        player.media.volume = view.volume
      } else {
        player.media.volume = 0
      }

      view.updateVolumeElements(player.media.volume)
    })

    view.elements.volumeSlider.addEventListener('input', (event) => {
      player.media.volume = event.target.value

      view.updateVolume(player.media.volume)
    })

    view.elements.volumeSlider.addEventListener('wheel', (event) => {
      if (event.deltaY === -100) {
        event.target.value = parseFloat(event.target.value) + 0.05
      } else {
        event.target.value = parseFloat(event.target.value) - 0.05
      }

      event.target.dispatchEvent(new Event('input'))
    })

    view.elements.speedSlider.addEventListener('input', (event) => {
      player.media.playbackRate = event.target.value
    })

    view.elements.speedSlider.addEventListener('wheel', (event) => {
      if (event.deltaY === -100) {
        event.target.value = parseFloat(event.target.value) + 0.05
      } else {
        event.target.value = parseFloat(event.target.value) - 0.05
      }

      event.target.dispatchEvent(new Event('input'))
    })

    view.elements.resetSpeedButton.addEventListener('click', () => {
      player.media.playbackRate = 1
    })

    view.elements.repeatToggle.addEventListener('click', () => {
      player.media.loop = !player.media.loop

      view.updateRepeatToggle(player.media.loop)
    })

    view.elements.fullscreenButton.addEventListener('click', () => {
      win.isFullScreen() ? win.setFullScreen(false) : win.setFullScreen(true)
    })
  }

  setUpEventListenersForWindow() {
    window.addEventListener('resize', () => {
      view.resizeVideo()
      view.updateProgressBar(player)
    })

    window.addEventListener('mousemove', (event) => {
      if (win.isFullScreen()) view.showFullscreenControls(event)
    })

    win.on('enter-full-screen', () => {
      view.goFullscreen()
    })

    win.on('leave-full-screen', () => {
      view.exitFullscreen()
    })
  }

  setUpEventListenersForKeyboard() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Home' && !view.elements.progressBarInput.disabled) {
        player.media.currentTime = 0

        view.showMessage('position', player)
      }

      if (event.code === 'ArrowLeft' && !view.elements.progressBarInput.disabled) {
        player.media.currentTime -= 5

        view.showMessage('position', player)
      }

      if (event.code === 'ArrowRight' && !view.elements.progressBarInput.disabled) {
        player.media.currentTime += 5

        view.showMessage('position', player)
      }
      
      if (event.code === 'KeyO' && event.ctrlKey) {
        view.elements.openFileButton.click()
      }
      
      if (event.code === 'Space') {
        view.elements.playPauseToggle.click()
        
        view.showMessage('status', player)
      }
      
      if (event.code === 'KeyM') {
        view.elements.muteButton.click()
        
        view.showMessage('volume', player)
      }
      
      if (event.code === 'ArrowUp' && !event.ctrlKey) {
        view.elements.volumeSlider.value = parseFloat(view.elements.volumeSlider.value) + 0.05
        view.elements.volumeSlider.dispatchEvent(new Event('input'))

        view.showMessage('volume', player)
      }

      if (event.code === 'ArrowDown' && !event.ctrlKey) {
        view.elements.volumeSlider.value = parseFloat(view.elements.volumeSlider.value) - 0.05
        view.elements.volumeSlider.dispatchEvent(new Event('input'))

        view.showMessage('volume', player)
      }

      if (event.code === 'KeyS') {
        view.elements.resetSpeedButton.click()

        view.showMessage('speed', player)
      }

      if (event.code === 'ArrowUp' && event.ctrlKey) {
        view.elements.speedSlider.value = parseFloat(view.elements.speedSlider.value) + 0.05
        view.elements.speedSlider.dispatchEvent(new Event('input'))

        view.showMessage('speed', player)
      }

      if (event.code === 'ArrowDown' && event.ctrlKey) {
        view.elements.speedSlider.value = parseFloat(view.elements.speedSlider.value) - 0.05
        view.elements.speedSlider.dispatchEvent(new Event('input'))

        view.showMessage('speed', player)
      }

      if (event.code === 'KeyR') {
        view.elements.repeatToggle.click()

        view.showMessage('repeat', player)
      }

      if (event.code === 'KeyF') {
        view.elements.fullscreenButton.click()
      }

      if (event.code === 'Escape' && win.isFullScreen()) {
        view.elements.fullscreenButton.click()
      }
    })
  }

  setUpEventListeners() {
    this.setUpEventListenersForPlayer()
    this.setUpEventListenersForView()
    this.setUpEventListenersForWindow()
    this.setUpEventListenersForKeyboard()

    ipcRenderer.on('selected-file', (event, filePath) => {
      if (filePath) {
        player.media.src = sanitizeFilePath(filePath)
        view.updateAppTitle(path.basename(filePath))
      }
    })
  }
}

module.exports = Controller