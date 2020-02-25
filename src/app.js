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
    this.state = undefined

    this.addEventListeners()
  }

  addEventListeners() {
    this.removeEventListeners()
    document.addEventListener('record-delete', deleteRecordHandler)
    document.addEventListener('seed-state', seedStateHandler.bind(this))
    document.addEventListener('save-state', saveStateHandler.bind(this))
  }

  removeEventListeners() {
    document.removeEventListener('record-delete', deleteRecordHandler)
    document.removeEventListener('seed-state', seedStateHandler.bind(this))
    document.removeEventListener('save-state', saveStateHandler.bind(this))
  }

  render() {
    console.log('APP render()')

    if (this.state == undefined) {
      console.log('%cAUTOSEED', 'color: white; background: red')

      seedStateHandler.bind(this)()
    }

    // Render Main Components
    // todo: merge app.state

    this.nav = new Nav(document.querySelector('[data-main-nav]'))
    this.mainView = new MainView(document.querySelector('[data-main-view]'))
    this.mainView.state = Object.assign({ target: 'home' }, this.state)
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
    // const recordsListContainer = document.createElement('div')
    // this.container.querySelector('main').appendChild(recordsListContainer)
    // var recordsList = new RecordsList(recordsListContainer)
    // recordsList.state = this.state
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
