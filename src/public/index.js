import Nav from './components/nav.js'
import MainView from './components/main-view.js'
import sampleData from './data/sample-data.js'
import Toolbar from './components/toolbar.js'

class App {
  set state(state) {
    this.stateValue = state
    this.render()
  }

  get state() {
    return this.stateValue
  }

  init(container) {
    this.appDataPresent = localStorage.hasOwnProperty('appData')
    this.container = container
    this.store = JSON.parse(localStorage.getItem('appData'))
    this.navContainer = this.container.querySelector('[data-main-nav]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')
    this.state = { ui: 'default', appDataPresent: this.store ? true : false }

    this.addEventListeners()
    ;(function appDataIsPresent() {
      // if (this.appDataPresent) {
      //   if (this.store.app && this.store.app.version) {
      //     console.log('local storage app version: ', this.store.app.version)
      //   }
      // }
    })()

    this.forceUpgradeStorage()
  }

  router() {
    // console.log('routing...', window.location.pathname)
    this.mainView = new MainView(this.mainViewContainer, { target: window.location })
  }

  addEventListeners() {
    document.addEventListener('record-delete', deleteRecordHandler)
    document.addEventListener('seed-state', seedStateHandler.bind(this))
    document.addEventListener('save-sample-data', saveSampleDataHandler.bind(this))
    document.addEventListener('navigate', this.router.bind(this))
    window.addEventListener('load', this.router.bind(this))
  }

  render() {
    new Nav(this.navContainer)
    new Toolbar(document.querySelector('[data-toolbar]'))
  }

  forceUpgradeStorage() {
    if (this.appDataPresent) {
      if (!this.store.app) {
        localStorage.removeItem('appData')
        this.render()
      }
    }
  }

  constructor(container) {
    this.init(container)
  }
}

function seedStateHandler() {
  this.state = { user: 'Benedikt' }
}

function saveSampleDataHandler() {
  console.log('saveSampleDataHandler()')

  localStorage.setItem('appData', JSON.stringify(sampleData))
  this.render()
}

function deleteRecordHandler(event) {
  console.log('recieved delete event', event)
}

const app = new App(document.documentElement)
window.app = app
