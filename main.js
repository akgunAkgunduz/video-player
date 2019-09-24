const { app, BrowserWindow } = require('electron')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1600, 
    height: 900,
    minWidth: 800,
    minHeight: 450,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools({ mode: 'detach' })

  mainWindow.once('ready-to-show', function() {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})