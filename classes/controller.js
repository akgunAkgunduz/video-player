const Player = require('./player')
const View = require('./view')
const uiElements = require('../utils/ui-elements')

const player = new Player(document.getElementById('video'))
const view = new View(uiElements)

class Controller {
  setUpEventListeners() {
    player.media.addEventListener('loadedmetadata', () => {
      view.elements.progressBarInput.max = player.media.duration

      view.resizeVideo()
    })

    player.media.addEventListener('timeupdate', () => {
      view.updateTimeInfo(player)
      view.updateProgressBar(player)
    })

    player.media.addEventListener('ended', () => {
      view.updatePlayPauseToggle(player)
    })

    player.media.addEventListener('volumechange', () => {
      view.updateVolume(player.media.volume)
    })

    view.elements.progressBarInput.addEventListener('input', (event) => {
      player.media.currentTime = event.target.value

      view.updateProgressBar(player)
    })

    view.elements.progressBarInput.addEventListener('mousemove', (event) => {
      view.showProgressBarInfo(player, event)
    })

    view.elements.playPauseToggle.addEventListener('click', () => {
      player.toggle()

      view.updatePlayPauseToggle(player)
    })

    view.elements.volumeSlider.addEventListener('input', (event) => {
      player.media.volume = event.target.value
    })

    window.addEventListener('resize', () => {
      view.resizeVideo()
      view.updateProgressBar(player)
    }
    )
  }
}

module.exports = Controller