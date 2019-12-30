const path = require('path')
const { remote } = require('electron')

const { BrowserWindow } = remote
const win = remote.getCurrentWindow()
let keyboardShortcutsWindow

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

    this.elements.keyboardShortcutsButton.addEventListener('click', () => {
      const keyboardShortcutsWindowPath = path.join('file://', __dirname, '../secondary_windows/keyboard_shortcuts/index.html')

      keyboardShortcutsWindow = new BrowserWindow({
        width: 360,
        height: 664,
        parent: win,
        modal: true,
        frame: false,
        resizable: false,
        maximizable: false,
        backgroundColor: '#333',
        show: false,
        webPreferences: {
          nodeIntegration: true
        }
      })

      keyboardShortcutsWindow.loadURL(keyboardShortcutsWindowPath)

      // keyboardShortcutsWindow.webContents.openDevTools({ mode: 'detach' })

      keyboardShortcutsWindow.once('ready-to-show', () => {
        keyboardShortcutsWindow.show()
      })

      keyboardShortcutsWindow.on('close', () => { keyboardShortcutsWindow = null })
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