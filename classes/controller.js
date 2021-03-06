const path = require('path')
const { ipcRenderer, remote } = require('electron')
const Player = require('./player')
const View = require('./view')
const { setUpIpcRendererEvents } = require('../events/ipc-renderer')
const { setUpKeyboardShortcuts } = require('../events/keyboard')
const uiElements = require('../utils/ui-elements')
const { sanitizeFilePath, isFileTypeSupported } = require('../utils/helpers')

const win = remote.getCurrentWindow()
const player = new Player(document.getElementById('video'))
const view = new View(uiElements, player)

class Controller {
  setUpEventListenersForPlayer() {
    player.on('error', view.handlePlayerError)
    player.on('load', view.handlePlayerMediaLoad)
    player.on(['play', 'pause', 'end'], view.updatePlayPauseToggle)
    player.on('playback-position-change', view.updateTimeRelatedElements)
    player.on('volume-change', view.updateVolumeElements)
    player.on('speed-change', view.updateSpeedElements)
  }

  setUpEventListenersForView() {
    view.videoPreview.addEventListener('loadedmetadata', () => {
      view.prepareThumbnail()
    })

    view.videoPreview.addEventListener('seeked', () => {
      view.generateThumbnail()
    })

    view.elements.videoContainer.addEventListener('dragover', (event) => event.preventDefault(), false)

    view.elements.videoContainer.addEventListener('dragleave', (event) => event.preventDefault(), false)

    view.elements.videoContainer.addEventListener('dragend', (event) => event.preventDefault(), false)

    view.elements.videoContainer.addEventListener('drop', (event) => {
      event.preventDefault()

      if (!win.isFullScreen()) {
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

      view.showMessage('volume')
    })

    view.elements.progressBarInput.addEventListener('input', (event) => {
      player.media.currentTime = event.target.value

      view.updateProgressBar()
    })

    view.elements.progressBarInput.addEventListener('mousemove', (event) => {
      view.showProgressBarInfo(event)
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
      view.updateProgressBar()
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
    setUpIpcRendererEvents(player, view)
    setUpKeyboardShortcuts(player, view)
  }
}

module.exports = Controller