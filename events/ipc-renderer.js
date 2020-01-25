const path = require('path')
const { ipcRenderer } = require('electron')
const { sanitizeFilePath } = require('../utils/helpers')

exports.setUpIpcRendererEvents = (player, view) => {
  ipcRenderer.on('selected-file', (event, filePath) => {
    if (filePath) {
      player.media.src = sanitizeFilePath(filePath)
      view.updateAppTitle(path.basename(filePath))
    }
  })
}