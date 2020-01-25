const { ipcMain, dialog } = require('electron')
const supportedFileTypes = require('../utils/supported-file-types')

const messageBoxDefaultOptions = {
  type: 'error',
  buttons: ['OK'],
  defaultId: 0,
  title: 'Error'
}

exports.setUpIpcMainEvents = (mainWindow) => {
  ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog(mainWindow, {
      filters: [
        { name: 'Video files', extensions: supportedFileTypes }
      ],
      properties: ['openFile']
    }, (files) => {
      if (files) {
        event.sender.send('selected-file', files[0])
      }
    })
  })

  ipcMain.on('show-player-error-message-box', (event, playerError) => {
    let errorType
    const errorDetail = playerError.message

    switch (playerError.code) {
      case 3:
        errorType = 'Decoding error.'
        break
      case 4:
        errorType = 'File/Media type not supported.'
        break
      default:
        errorType = 'An unexpected error ocurred.'
    }

    const options = { ...messageBoxDefaultOptions, message: errorType, detail: errorDetail }

    dialog.showMessageBox(mainWindow, options)
  })

  ipcMain.on('show-file-type-not-supported-message-box', (event) => {
    const options = { ...messageBoxDefaultOptions, message: 'File type not supported' }

    dialog.showMessageBox(mainWindow, options)
  })

  ipcMain.on('show-not-a-file-message-box', (event) => {
    const options = { ...messageBoxDefaultOptions, message: 'The item you dropped is not a file' }

    dialog.showMessageBox(mainWindow, options)
  })
}