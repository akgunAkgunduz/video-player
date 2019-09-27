const { remote } = require('electron')
const win = remote.getCurrentWindow()

class TitleBar {
  constructor(elements) {
    this.elements = elements
  }

  setUpEventListeners() {
    win.on('maximize', () => {
      this.elements.maximize.querySelector('i').classList.remove('unfold_more')
      this.elements.maximize.querySelector('i').classList.add('unfold_less')
    })

    win.on('unmaximize', () => {
      this.elements.maximize.querySelector('i').classList.remove('unfold_less')
      this.elements.maximize.querySelector('i').classList.add('unfold_more')
    })

    this.minimize.addEventListener('click', () => win.minimize())

    this.maximize.addEventListener('click', () => win.isMaximized() ? win.unmaximize() : win.maximize())

    this.close.addEventListener('click', () => win.close())
  }
}

module.exports = TitleBar