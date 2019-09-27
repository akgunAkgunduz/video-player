class App {
  constructor(titleBar, controller) {
    this.titleBar = titleBar
    this.controller = controller
  }

  init() {
    this.titleBar.setUpEventListeners()
    this.controller.setUpEventListeners()
  }
}

module.exports = App