module.exports = {
  appTitleBar: document.getElementById('title-bar'),
  appTitle: document.getElementById('app-name').querySelector('.handle'),
  appMain: document.getElementById('app-main'),

  messageContainer: document.getElementById('message-container'),
  message: document.getElementById('message'),

  videoContainer: document.getElementById('video-container'),
  video: document.getElementById('video'),

  dragAndDropInfo: document.getElementById('drag-and-drop-info'),

  controlsContainer: document.getElementById('controls-container'),

  progressBar: document.getElementById('progress-bar'),
  progressBarInput: document.getElementById('progress-bar-input'),
  progressBarThumb: document.getElementById('progress-bar-thumb'),
  progressBarProgress: document.getElementById('progress-bar-progress'),
  progressBarBackground: document.getElementById('progress-bar-background'),
  progressBarInfo: document.getElementById('progress-bar-info'),
  progressBarVideoPreviewThumbnail: document.getElementById('progress-bar-video-preview-thumbnail'),
  progressBarVideoPreviewThumbnailCanvas: document.getElementById('progress-bar-video-preview-thumbnail-canvas'),

  openFileButton: document.getElementById('open-file-btn'),
  playPauseToggle: document.getElementById('play-pause-toggle'),
  muteButton: document.getElementById('mute-btn'),
  volumeSlider: document.getElementById('volume'),
  volumeText: document.getElementById('volume-text'),
  timeInfo: document.getElementById('time-info'),
  resetSpeedButton: document.getElementById('reset-speed-btn'),
  speedSlider: document.getElementById('speed'),
  speedText: document.getElementById('speed-text'),
  repeatToggle: document.getElementById('repeat-toggle'),
  fullscreenButton: document.getElementById('fullscreen-btn'),

  controlsToEnable: document.querySelectorAll('.control-to-enable')
}