const { remote } = require('electron')
const { formatSeconds } = require('../utils/helpers')

const win = remote.getCurrentWindow()

class View {
  constructor(uiElements) {
    this.elements = uiElements
    this.resizeVideo = this.resizeVideo.bind(this)
  }

  updateAppTitle(newTitle) {
    this.elements.appTitle.textContent = newTitle
  }

  resizeVideo() {
    const videoContainerHeight = this.elements.videoContainer.offsetHeight
    const videoContainerWidth = this.elements.videoContainer.offsetWidth
    const videoContainerAspectRatio = videoContainerWidth / videoContainerHeight
    const videoAspectRatio = this.elements.video.videoWidth / this.elements.video.videoHeight

    if (videoAspectRatio > videoContainerAspectRatio) {
      this.elements.video.style.width = '100vw'
      this.elements.video.style.height = null
      this.elements.video.style.margin = null
      this.elements.video.style.marginTop = `${((videoContainerHeight - this.elements.video.offsetHeight) / 2)}px`
    } else {
      this.elements.video.style.height = '100%'
      this.elements.video.style.width = null
      this.elements.video.style.margin = '0 auto'
    }
  }

  enableControls() {
    this.elements.controlsToEnable.forEach(control => control.disabled = false)
  }

  updateProgressBar(player) {
    this.elements.progressBarInput.value = player.media.currentTime

    const current = player.media.currentTime
    const duration = player.media.duration

    this.elements.progressBarProgress.style.width = `${current * 100 / duration}%`
    this.elements.progressBarThumb.style.left = `${this.elements.progressBarProgress.offsetWidth - 1}px`
  }

  showProgressBarInfo(player, event) {
    const inputWidth = this.elements.progressBarInput.offsetWidth
    const cursorPositionRelative = event.clientX - event.target.offsetLeft
    const cursorPositionTime = player.media.duration * (cursorPositionRelative / inputWidth)
    const infoWidth = this.elements.progressBarInfo.offsetWidth  

    if (cursorPositionRelative < 0) {
      this.elements.progressBarInfo.innerText = formatSeconds(0)  
    } else if (cursorPositionRelative > inputWidth) {
      this.elements.progressBarInfo.innerText = formatSeconds(player.media.duration)
    } else {
      this.elements.progressBarInfo.innerText = formatSeconds(cursorPositionTime)
    }

    if (event.clientX < event.target.parentNode.offsetLeft + (infoWidth / 2) ) {
      this.elements.progressBarInfo.style.left = `${0}px`
    } else if (event.clientX > inputWidth + event.target.parentNode.offsetLeft - (infoWidth / 2) ) {
      this.elements.progressBarInfo.style.left = `${inputWidth - infoWidth}px`
    } else {
      this.elements.progressBarInfo.style.left = `${cursorPositionRelative - infoWidth / 2}px`
    }
  }

  updateTimeInfo(player) {
    const position = formatSeconds(player.media.currentTime, player.media.duration)
    const duration = formatSeconds(player.media.duration)

    this.elements.timeInfo.innerText = `${position}/${duration}`
  }

  updatePlayPauseToggle(player) {
    if (player.isPaused) {
      this.elements.playPauseToggle.querySelector('i').innerText = 'play_arrow'
    } else {
      this.elements.playPauseToggle.querySelector('i').innerText = 'pause'
    }
  }

  updateMuteButton(volume) {
    if (volume > 0) {
      this.elements.muteButton.querySelector('i').innerText = 'volume_up'
    } else {
      this.elements.muteButton.querySelector('i').innerText = 'volume_off'
    }
  }

  updateVolume(volume) {
    this.elements.volumeSlider.value = volume
    this.elements.volumeText.textContent = Math.floor(volume * 100) + '%'
  }

  updateSpeed(speed) {
    this.elements.speedSlider.value = speed
    this.elements.speedText.textContent = speed.toFixed(2) + 'x'
  }

  updateLoopButton() {
    this.elements.loopButton.classList.toggle('on')
  }

  goFullscreen() {
    this.elements.appTitleBar.classList.add('in-fullscreen')
    this.elements.appMain.classList.add('in-fullscreen')
    this.elements.videoContainer.classList.add('in-fullscreen')
    this.elements.controlsContainer.classList.add('in-fullscreen')
    this.elements.fullscreenButton.querySelector('i').innerText = 'fullscreen_exit'
  }
  
  exitFullscreen() {
    this.elements.appTitleBar.classList.remove('in-fullscreen')
    this.elements.appMain.classList.remove('in-fullscreen')
    this.elements.videoContainer.classList.remove('in-fullscreen')
    this.elements.controlsContainer.classList.remove('in-fullscreen')
    this.elements.controlsContainer.classList.remove('apparent')
    this.elements.fullscreenButton.querySelector('i').innerText = 'fullscreen'
  }

  showFullscreenControls(event) {
    if (event.clientY >= document.body.offsetHeight - this.elements.controlsContainer.offsetHeight) {
      this.elements.controlsContainer.classList.add('apparent')
    } else {
      this.elements.controlsContainer.classList.remove('apparent')
    }
  }

  showMessage(messageType, player) {
    if (win.isFullScreen()) {
      clearTimeout(this.timer)

      switch (messageType) {
        case 'status':
          this.elements.message.innerText = player.isPaused ? 'Paused' : 'Playing'
          break;
        case 'position':
          this.elements.message.innerText = `${formatSeconds(player.media.currentTime)} / ${formatSeconds(player.media.duration)}`
          break;
        case 'volume':
          this.elements.message.innerText = `Volume: ${Math.floor(player.media.volume * 100)}%`
          break;
        case 'speed':
          this.elements.message.innerText = `Speed: ${player.media.playbackRate.toFixed(2)}x`
          break;
        case 'loop':
          this.elements.message.innerText = player.media.loop ? 'Loop: ON' : 'Loop: OFF'
          break;
        default:
          this.elements.message.innerText = ''
      }

      this.elements.messageContainer.classList.remove('hidden')
      this.timer = setTimeout(() => this.elements.messageContainer.classList.add('hidden'), 1000)
    }
  }
}

module.exports = View