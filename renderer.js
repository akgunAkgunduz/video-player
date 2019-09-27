const TitleBar = require('./classes/titleBar')
const Controller = require('./classes/controller')
const App = require('./classes/app')
const titleBarElements = require('./utils/title-bar-elements')

const titleBar = new TitleBar(titleBarElements)
const controller = new Controller()
const app = new App(titleBar, controller)

app.init()