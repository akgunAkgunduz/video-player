const path = require('path')

const { ipcRenderer, remote } = require('electron')

const Player = require('./player')
const View = require('./view')

const uiElements = require('../utils/ui-elements')
const { sanitizeFilePath } = require('../utils/helpers')

const win = remote.getCurrentWindow()

const player = new Player(document.getElementById('video'))
const view = new View(uiElements)

class Controller {
  setUpEventListenersForPlayer() {
    player.media.addEventListener('loadedmetadata', () => {
      view.elements.progressBarInput.max = player.media.duration
      view.resizeVideo()
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
      view.updateVolume(player.media.volume)
      view.updateMuteButton(player.media.volume)
    })

    player.media.addEventListener('ratechange', () => {
      view.updateSpeed(player.media.playbackRate)
    })
  }

  setUpEventListenersForView() {
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
      player.media.volume = !player.media.volume
    })

    view.elements.volumeSlider.addEventListener('input', (event) => {
      player.media.volume = event.target.value
    })

    view.elements.speedSlider.addEventListener('input', (event) => {
      player.media.playbackRate = event.target.value
    })

    view.elements.resetSpeedButton.addEventListener('click', () => {
      player.media.playbackRate = 1
    })

    view.elements.loopButton.addEventListener('click', () => {
      player.media.loop = !player.media.loop

      view.updateLoopButton()
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
      }

      if (event.code === 'ArrowLeft' && !view.elements.progressBarInput.disabled) {
        player.media.currentTime -= 5
      }

      if (event.code === 'ArrowRight' && !view.elements.progressBarInput.disabled) {
        player.media.currentTime += 5
      }

      if (event.code === 'KeyO' && event.ctrlKey) {
        view.elements.openFileButton.click()
      }

      if (event.code === 'Space') {
        view.elements.playPauseToggle.click()
      }

      if (event.code === 'KeyM') {
        view.elements.muteButton.click()
      }

      if (event.code === 'ArrowUp' && !event.ctrlKey) {
        view.elements.volumeSlider.value = parseFloat(view.elements.volumeSlider.value) + 0.05
        view.elements.volumeSlider.dispatchEvent(new Event('input'))
      }

      if (event.code === 'ArrowDown' && !event.ctrlKey) {
        view.elements.volumeSlider.value = parseFloat(view.elements.volumeSlider.value) - 0.05
        view.elements.volumeSlider.dispatchEvent(new Event('input'))
      }

      if (event.code === 'KeyS') {
        view.elements.resetSpeedButton.click()
      }

      if (event.code === 'ArrowUp' && event.ctrlKey) {
        view.elements.speedSlider.value = parseFloat(view.elements.speedSlider.value) + 0.05
        view.elements.speedSlider.dispatchEvent(new Event('input'))
      }

      if (event.code === 'ArrowDown' && event.ctrlKey) {
        view.elements.speedSlider.value = parseFloat(view.elements.speedSlider.value) - 0.05
        view.elements.speedSlider.dispatchEvent(new Event('input'))
      }

      if (event.code === 'KeyL') {
        view.elements.loopButton.click()
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