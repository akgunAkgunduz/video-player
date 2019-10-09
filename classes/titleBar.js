const { remote } = require('electron')
const win = remote.getCurrentWindow()

class TitleBar {
  constructor(elements) {
    this.elements = elements
  }

  setUpEventListeners() {
    win.on('maximize', () => {
      this.elements.maximize.querySelector('i').innerHTML = 'unfold_less'
    })

    win.on('unmaximize', () => {
      this.elements.maximize.querySelector('i').innerHTML = 'unfold_more'
    })

    win.on('focus', () => {
      this.elements.bar.classList.remove('blurred')
    })

    win.on('blur', () => {
      this.elements.bar.classList.add('blurred')
    })

    this.elements.minimize.addEventListener('click', () => win.minimize())

    this.elements.maximize.addEventListener('click', () => win.isMaximized() ? win.unmaximize() : win.maximize())

    this.elements.close.addEventListener('click', () => win.close())
  }
}

module.exports = TitleBar