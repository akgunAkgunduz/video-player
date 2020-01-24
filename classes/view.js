const { remote } = require('electron')
const { formatSeconds } = require('../utils/helpers')

const win = remote.getCurrentWindow()

class View {
  constructor(uiElements, player) {
    this.elements = uiElements
    this.player = player

    this.resizeVideo = this.resizeVideo.bind(this)

    this.volume = 1
    this.timer = null
  }

  updateAppTitle(newTitle) {
    this.elements.appTitle.textContent = newTitle
    document.title = newTitle
  }

  resetScene() {
    this.updateAppTitle('Video Player')
    this.elements.dragAndDropInfo.style.display = 'flex'
    this.elements.progressBarInput.value = 0
    this.elements.progressBarProgress.style.width = 0
    this.elements.progressBarThumb.style.left = 0
    this.elements.playPauseToggle.querySelector('i').innerText = 'play_arrow'
    this.elements.timeInfo.innerText = ''
    this.disableControls()
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

  removeDragAndDropInfo() {
    this.elements.dragAndDropInfo.style.display = 'none'
  }

  enableControls() {
    this.elements.controlsToEnable.forEach(control => control.disabled = false)
  }

  disableControls() {
    this.elements.controlsToEnable.forEach(control => control.disabled = true)
  }

  updateProgressBar() {
    this.elements.progressBarInput.value = this.player.media.currentTime

    const current = this.player.media.currentTime
    const duration = this.player.media.duration

    this.elements.progressBarProgress.style.width = `${current * 100 / duration}%`
    this.elements.progressBarThumb.style.left = `${this.elements.progressBarProgress.offsetWidth - 1}px`
  }

  showProgressBarInfo(event) {
    const inputWidth = this.elements.progressBarInput.offsetWidth
    const cursorPositionRelative = event.clientX - event.target.offsetLeft
    const cursorPositionTime = this.player.media.duration * (cursorPositionRelative / inputWidth)
    const infoWidth = this.elements.progressBarInfo.offsetWidth  

    if (cursorPositionRelative < 0) {
      this.elements.progressBarInfo.innerText = formatSeconds(0)  
    } else if (cursorPositionRelative > inputWidth) {
      this.elements.progressBarInfo.innerText = formatSeconds(this.player.media.duration)
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

  updateTimeInfo() {
    const position = formatSeconds(this.player.media.currentTime, this.player.media.duration)
    const duration = formatSeconds(this.player.media.duration)

    this.elements.timeInfo.innerText = `${position}/${duration}`
  }

  updatePlayPauseToggle() {
    this.elements.playPauseToggle.querySelector('i').innerText = this.player.isPaused ? 'play_arrow' : 'pause'
    this.elements.playPauseToggle.title = this.player.isPaused ? 'Play' : 'Pause'
  }

  updateMuteButton(volume) {
    this.elements.muteButton.title = volume > 0 ? 'Mute' : 'Unmute'

    if (volume === 0) {
      this.elements.muteButton.querySelector('i').innerText = 'volume_off'
      this.elements.muteButton.querySelector('i').style.left = '0'
    } else if (volume > 0 && volume <= 0.33) {
      this.elements.muteButton.querySelector('i').innerText = 'volume_down'
      this.elements.muteButton.querySelector('i').style.left = '-2px'
    } else {
      this.elements.muteButton.querySelector('i').innerText = 'volume_up'
      this.elements.muteButton.querySelector('i').style.left = '0'
    }
  }

  updateVolume(newVolume) {
    this.volume = newVolume
  }

  updateVolumeElements(volume) {
    this.updateMuteButton(volume)
    this.elements.volumeSlider.value = volume
    this.elements.volumeText.textContent = Math.floor(volume * 100) + '%'
  }

  updateSpeedElements(speed) {
    this.elements.speedSlider.value = speed
    this.elements.speedText.textContent = speed.toFixed(2) + 'x'
  }

  updateRepeatToggle(repeat) {
    this.elements.repeatToggle.classList.toggle('on')
    this.elements.repeatToggle.title = repeat ? 'Don\'t repeat' : 'Repeat'
  }

  goFullscreen() {
    this.elements.appTitleBar.classList.add('in-fullscreen')

    this.elements.appMain.classList.add('in-fullscreen')

    this.elements.videoContainer.classList.add('in-fullscreen')
    this.elements.messageContainer.style.display = 'block'
    this.elements.controlsContainer.classList.add('in-fullscreen')

    this.elements.openFileButton.disabled = true
    this.elements.openFileButton.style.visibility = 'hidden'
    this.elements.fullscreenButton.querySelector('i').innerText = 'fullscreen_exit'
    this.elements.fullscreenButton.title = 'Exit fullscreen'
  }

  exitFullscreen() {
    this.elements.appTitleBar.classList.remove('in-fullscreen')

    this.elements.appMain.classList.remove('in-fullscreen')

    this.elements.videoContainer.classList.remove('in-fullscreen')
    this.elements.messageContainer.classList.add('hidden')
    this.elements.messageContainer.style.display = 'none'
    this.elements.controlsContainer.classList.remove('in-fullscreen')
    this.elements.controlsContainer.classList.remove('apparent')

    this.elements.openFileButton.disabled = false
    this.elements.openFileButton.style.visibility = 'visible'
    this.elements.fullscreenButton.querySelector('i').innerText = 'fullscreen'
    this.elements.fullscreenButton.title = 'Enter fullscreen'
  }

  showFullscreenControls(event) {
    if (event.clientY >= document.body.offsetHeight - this.elements.controlsContainer.offsetHeight) {
      this.elements.controlsContainer.classList.add('apparent')
    } else {
      this.elements.controlsContainer.classList.remove('apparent')
    }
  }

  showMessage(messageType) {
    if (win.isFullScreen()) {
      clearTimeout(this.timer)

      switch (messageType) {
        case 'status':
          this.elements.message.innerText = this.player.isPaused ? 'Paused' : 'Playing'
          break;
        case 'position':
          this.elements.message.innerText = `${formatSeconds(this.player.media.currentTime)} / ${formatSeconds(this.player.media.duration)}`
          break;
        case 'volume':
          this.elements.message.innerText = `Volume: ${Math.floor(this.player.media.volume * 100)}%`
          break;
        case 'speed':
          this.elements.message.innerText = `Speed: ${this.player.media.playbackRate.toFixed(2)}x`
          break;
        case 'repeat':
          this.elements.message.innerText = this.player.media.loop ? 'Repeat: On' : 'Repeat: Off'
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