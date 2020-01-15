const supportedFileTypes = require('./supported-file-types')

exports.isFileTypeSupported = filePath => supportedFileTypes.includes(filePath.split('.').pop().toLowerCase())

exports.sanitizeFilePath = path => path.replace('#', '%23')

exports.formatSeconds = (time1, time2) => {
  if (Number.isNaN(time1)) time1 = 0
  if (Number.isNaN(time2)) time2 = 0

  const string = new Date(time1 * 1000).toISOString()

  return (time2 || time1) < 3600 ? string.substr(14, 5) : string.substr(11, 8)
}