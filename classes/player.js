const { sanitizeFilePath } = require('../utils/helpers')

class Player {
  constructor(mediaElement) {
    this.media = mediaElement
  }

  get error() {
    return this.media.error
  }

  get isReady() {
    return this.media.readyState === 4
  }

  get isPaused() {
    return this.media.paused
  }

  loadFile(filePath) {
    this.media.src = sanitizeFilePath(filePath)
  }

  play() {
    this.media.play()
  }

  pause() {
    this.media.pause()
  }

  toggle() {
    this.isPaused ? this.play() : this.pause()
  }

  on(eventNames, handler) {
    let events = []
    Array.isArray(eventNames) ? events = [ ...eventNames ] : events.push(eventNames)

    events.forEach(event => {
      switch (event) {
        case 'error':
          this.media.addEventListener('error', handler)
          break
        case 'load':
          this.media.addEventListener('loadedmetadata', handler)
          break
        case 'play':
          this.media.addEventListener('play', handler)
          break
        case 'pause':
          this.media.addEventListener('pause', handler)
          break
        case 'end':
          this.media.addEventListener('ended', handler)
          break
        case 'playback-position-change':
          this.media.addEventListener('timeupdate', handler)
          break
        case 'volume-change':
          this.media.addEventListener('volumechange', handler)
          break
        case 'speed-change':
          this.media.addEventListener('ratechange', handler)
          break
      }
    })
  }
}

module.exports = Player