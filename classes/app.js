class App {
  constructor(controller) {
    this.controller = controller
  }

  init() {
    this.controller.setUpEventListeners()
  }
}

module.exports = App