exports.generateTimeText = (seconds) => {
  const string = new Date(seconds * 1000).toISOString()
  return seconds < 3600 ? string.substr(14, 5) : string.substr(11, 8)
}

exports.generatePositionText = (seconds, duration) => {
  const string = new Date(seconds * 1000).toISOString()
  return duration < 3600 ? string.substr(14, 5) : string.substr(11, 8)
}

exports.sanitizeFilePath = path => path.replace('#', '%23')