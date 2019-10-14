const { app, BrowserWindow } = require('electron')
const windowStateKeeper = require('electron-window-state')

let mainWindow

function createWindow() {
  let mainWindowState = windowStateKeeper()

  mainWindow = new BrowserWindow({
    width: 640,
    height: 360,
    minWidth: 640,
    minHeight: 360,
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

  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools({ mode: 'detach' })

  mainWindowState.manage(mainWindow)

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