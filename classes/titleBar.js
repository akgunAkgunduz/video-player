const { remote } = require('electron')
const win = remote.getCurrentWindow()

class TitleBar {
  constructor(elements) {
    this.elements = elements
  }

  setUpEventListeners() {
    win.on('maximize', () => {
      this.elements.maximize.querySelector('i').innerHTML = 'unfold_more'
      this.elements.maximize.querySelector('i').innerHTML = 'unfold_less'
    })

    win.on('unmaximize', () => {
      this.elements.maximize.querySelector('i').innerHTML = 'unfold_less'
      this.elements.maximize.querySelector('i').innerHTML = 'unfold_more'
    })

    win.on('minimize', () => {
      this.elements.minimize.style.backgroundColor = '#333'
    })

    this.elements.minimize.addEventListener('click', () => win.minimize())

    this.elements.maximize.addEventListener('click', () => win.isMaximized() ? win.unmaximize() : win.maximize())

    this.elements.close.addEventListener('click', () => win.close())

    this.elements.minimize.addEventListener('mouseenter', (e) => {
      e.target.style.backgroundColor = '#555'
    })

    this.elements.minimize.addEventListener('mouseleave', (e) => {
      e.target.style.backgroundColor = '#333'
    })

    this.elements.maximize.addEventListener('mouseenter', (e) => {
      e.target.style.backgroundColor = '#555'
    })

    this.elements.maximize.addEventListener('mouseleave', (e) => {
      e.target.style.backgroundColor = '#333'
    })

    this.elements.close.addEventListener('mouseenter', (e) => {
      e.target.style.backgroundColor = '#f00'
    })

    this.elements.close.addEventListener('mouseleave', (e) => {
      e.target.style.backgroundColor = '#333'
    })
  }
}

module.exports = TitleBar