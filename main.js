const { app, BrowserWindow } = require('electron')
const windowStateKeeper = require('electron-window-state')

const { setUpIpcMainEvents } = require('./events/ipc-main')

let mainWindow

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 640,
    defaultHeight: 360,
    maximize: false,
    fullScreen: false
  })

  mainWindow = new BrowserWindow({
    minWidth: 640,
    minHeight: 360,
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    backgroundColor: '#333',
    frame: false,
    show: false,
    icon: __dirname + '/images/player.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.setMenu(null)

  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools({ mode: 'detach' })

  mainWindowState.manage(mainWindow)

  setUpIpcMainEvents(mainWindow)

  mainWindow.once('ready-to-show', function() {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  if (mainWindow === null) createWindow()
})