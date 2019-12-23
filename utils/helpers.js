const supportedFileTypes = require('./supported-file-types')

exports.isFileTypeSupported = filePath => supportedFileTypes.includes(filePath.split('.').pop().toLowerCase())

exports.sanitizeFilePath = path => path.replace('#', '%23')

exports.formatSeconds = (position, duration) => {
  const string = new Date(position * 1000).toISOString()

  return (duration || position) < 3600 ? string.substr(14, 5) : string.substr(11, 8) 
}