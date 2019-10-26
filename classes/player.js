class Player {
  constructor(mediaElement) {
    this.media = mediaElement
  }

  get isPaused() {
    return this.media.paused
  }

  get error() {
    return this.media.error.code
  }

  get isReady() {
    return this.media.readyState === 4
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
}

module.exports = Player