import Nav from './components/nav.js'
import MainView from './components/main-view.js'
import RecordsList from './components/records-list.js'
import sampleData from './data/sample-data.js'

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
    this.container = container
    this.store = localStorage.getItem('appData')
    this.navContainer = this.container.querySelector('[data-main-nav]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')
    this.state = { ui: 'default', appDataPresent: this.store ? true : false }

    this.addEventListeners()
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
  }

  constructor(container) {
    this.init(container)
  }
}

function seedStateHandler() {
  this.state = { user: 'Benedikt' }
}

function saveSampleDataHandler() {
  localStorage.setItem('appData', JSON.stringify(sampleData))
  this.render()
}

function deleteRecordHandler(event) {
  console.log('recieved delete event', event)
}
