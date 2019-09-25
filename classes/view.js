const { generatePositionText, generateTimeText } = require('../utils/helpers')

class View {
  constructor(uiElements) {
    this.elements = uiElements
    this.resizeVideo = this.resizeVideo.bind(this)
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

  updateProgressBar(player) {
    this.elements.progressBarInput.value = player.media.currentTime

    const inputWidth = this.elements.progressBarInput.offsetWidth
    const current = player.media.currentTime
    const duration = player.media.duration

    this.elements.progressBarProgress.style.width = `${inputWidth * (current / duration)}px`
    this.elements.progressBarProgress.style.width = `${current * 100 / duration}%`
    this.elements.progressBarThumb.style.left = `${this.elements.progressBarProgress.offsetWidth - 1}px`
  }

  showProgressBarInfo(player, event) {
    const inputWidth = this.elements.progressBarInput.offsetWidth
    const cursorPositionRelative = event.clientX - event.target.offsetLeft
    const cursorPositionTime = player.media.duration * (cursorPositionRelative / inputWidth)
    const infoWidth = this.elements.progressBarInfo.offsetWidth  

    if (cursorPositionRelative < 0) {
      this.elements.progressBarInfo.innerText = generateTimeText(0)  
    } else if (cursorPositionRelative > inputWidth) {
      this.elements.progressBarInfo.innerText = generateTimeText(player.media.duration)
    } else {
      this.elements.progressBarInfo.innerText = generateTimeText(cursorPositionTime)
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
    const position = generatePositionText(player.media.currentTime, player.media.duration)
    const duration = generateTimeText(player.media.duration)

    this.elements.timeInfo.innerText = `${position} / ${duration}`
  }

  updatePlayPauseToggle(player) {
    if (player.isPaused) {
      this.elements.playPauseToggle.innerText = 'Play'
    } else {
      this.elements.playPauseToggle.innerText = 'Pause'
    }
  }
}

module.exports = View