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