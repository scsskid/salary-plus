import Nav from './components/nav.js'
import MainView from './components/main-view.js'
import RecordsList from './components/records-list.js'
import sampleData from './data/sample-data.js'

export default class App {
  set state(state) {
    // console.log('APP setting state', state)
    this.stateValue = state
  }

  get state() {
    return this.stateValue
  }

  init(container) {
    this.container = container
    this.state = undefined

    // Render Main Components
    this.nav = new Nav(document.querySelector('[data-main-nav]'))
    this.mainView = new MainView(document.querySelector('[data-main-view]'))
    this.mainView.state = { target: 'home' }
    this.addEventListeners()
  }

  addEventListeners() {
    document.addEventListener('record-delete', deleteRecordHandler)
    document.addEventListener('seed-state', seedStateHandler.bind(this))
    document.addEventListener('save-state', saveStateHandler.bind(this))
  }

  constructor(container) {
    this.init(container)
  }
}

function seedStateHandler() {
  if (this.state != undefined) {
    console.error('state present, reload to clear', this.state)
  } else {
    this.state = sampleData
    const recordsListContainer = document.createElement('div')
    this.container.querySelector('main').appendChild(recordsListContainer)
    var recordsList = new RecordsList(recordsListContainer)
    recordsList.state = this.state
  }
}

function saveStateHandler() {
  if (this.state != undefined) {
    localStorage.setItem('appData', JSON.stringify(this.state))
  } else {
    console.error('state is undefined', this.state)
  }
}

function deleteRecordHandler(event) {
  console.log('recieved delete event', event)
  // let stateToMerge = {
  //   records: this.state.records.filter(record => record.id != event.detail.id)
  // }

  // this.state = { ...this.state, ...stateToMerge }
}
