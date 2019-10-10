const { remote } = require('electron')
const win = remote.getCurrentWindow()

class TitleBar {
  constructor(elements) {
    this.elements = elements
  }

  setUpEventListeners() {
    win.on('minimize', () => {
      this.elements.minimize.classList.remove('hovered')
    })

    win.on('maximize', () => {
      this.elements.maximize.innerHTML = '&#xE923;'
    })

    win.on('unmaximize', () => {
      this.elements.maximize.innerHTML = '&#xE922;'
    })

    win.on('focus', () => {
      this.elements.bar.classList.remove('blurred')
    })

    win.on('blur', () => {
      this.elements.bar.classList.add('blurred')
    })

    this.elements.minimize.addEventListener('click', () => {
      win.minimize()
    })

    this.elements.maximize.addEventListener('click', () => {
      win.isMaximized() ? win.unmaximize() : win.maximize()
    })

    this.elements.close.addEventListener('click', () => {
      win.close()
    })

    this.elements.buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.classList.add('hovered')
      })

      button.addEventListener('mouseleave', () => {
        button.classList.remove('hovered')
      })
    })
  }
}

module.exports = TitleBar