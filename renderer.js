const Controller = require('./classes/controller')
const App = require('./classes/app')

const controller = new Controller()
const app = new App(controller)

app.init()