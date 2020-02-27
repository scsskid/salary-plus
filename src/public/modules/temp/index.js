import Model from './modules/model.js'
import View from './modules/view.js'
import Controller from './modules/controller.js'

var app = new Controller(new Model(), new View())

window.app = app
