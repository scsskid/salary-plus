import Nav from './components/nav.js'
import MainView from './components/main-view.js'
import RecordsList from './components/records-list.js'
import sampleData from './data/sample-data.js'
import Toolbar from './components/toolbar.js'

export default class App {
  set state(state) {
    console.log('APP set state', state)
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

    if (this.appDataPresent) {
      if (this.store.app && this.store.app.version) {
        console.log('local storage app version: ', this.store.app.version)
      }
    }

    this.forceUpgradeStorage()
  }

  addEventListeners() {
    document.addEventListener('record-delete', deleteRecordHandler)
    document.addEventListener('seed-state', seedStateHandler.bind(this))
    document.addEventListener('save-sample-data', saveSampleDataHandler.bind(this))

    // document.addEventListener('navigate', navigationHandler.bind(this))
    document.addEventListener('navigate', event => {
      console.log('engage!', event)
    })
  }

  render() {
    console.log('APP render()')

    // Render Main Components
    this.nav = new Nav(this.navContainer)
    this.mainView = new MainView(this.mainViewContainer, { target: 'home' })
    const toolbar = new Toolbar(document.querySelector('[data-toolbar]'))
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
