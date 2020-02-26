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
    document.addEventListener('record-delete', deleteRecordHandler)
    document.addEventListener('seed-state', seedStateHandler.bind(this))
    document.addEventListener('save-sample-data', saveSampleDataHandler.bind(this))
  }

  render() {
    console.log('APP render()')

    if (this.state == undefined) {
      console.log('%cAUTOSEED', 'color: white; background: red')
      seedStateHandler.bind(this)()
    }

    // Render Main Components

    this.nav = new Nav(document.querySelector('[data-main-nav]'))
    this.mainView = new MainView(document.querySelector('[data-main-view]'))
    this.mainView.state = Object.assign({ target: 'home' }, this.state)
  }

  constructor(container) {
    this.init(container)
  }
}

function seedStateHandler() {
  this.state = { ...sampleData }
}

function saveSampleDataHandler() {
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
