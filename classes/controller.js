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

  setUpEventListeners() {
    this.setUpEventListenersForPlayer()
    this.setUpEventListenersForView()
    this.setUpEventListenersForWindow()

    ipcRenderer.on('selected-file', (event, filePath) => {
      if (filePath) {
        player.media.src = sanitizeFilePath(filePath)
        view.updateAppTitle(path.basename(filePath))
      }
    })
  }
}

module.exports = Controller