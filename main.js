const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const windowStateKeeper = require('electron-window-state')
const supportedFileTypes = require('./utils/supported-file-types')

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

ipcMain.on('open-file-dialog', (e) => {
  dialog.showOpenDialog(mainWindow, {
    filters: [
      { name: 'Video files', extensions: supportedFileTypes }
    ],
    properties: ['openFile']
  }, (files) => {
    if (files) {
      e.sender.send('selected-file', files[0])
    }
  })
})

ipcMain.on('show-file-type-not-supported-message-box', (event) => {
  const options = {
    type: 'error',
    buttons: ['OK'],
    defaultId: 0,
    title: 'Error',
    message: 'File type not supported',
  }

  dialog.showMessageBox(mainWindow, options)
})

ipcMain.on('show-not-a-file-message-box', (event) => {
  const options = {
    type: 'error',
    buttons: ['OK'],
    defaultId: 0,
    title: 'Error',
    message: 'The item you dropped is not a file',
  }

  dialog.showMessageBox(mainWindow, options)
})