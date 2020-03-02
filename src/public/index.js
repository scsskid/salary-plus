import { Store } from './lib/store.js'
import Nav from './components/nav.js'
import sampleData from './data/sample-data.js'
import Toolbar from './components/toolbar.js'
import Home from './components/home.js'
import RecordsList from './components/records-list.js'
import Record from './components/record.js'
import RecordForm from './components/record-form.js'
import Utils from './utils.js'

class App {
  set state(state) {
    this.stateValue = state
    this.render()
  }

  get state() {
    return this.stateValue
  }

  init(container) {
    this.container = container

    // this.appDataPresent = localStorage.hasOwnProperty('appData')
    this.store = JSON.parse(localStorage.getItem('appData'))

    this.navContainer = this.container.querySelector('[data-main-nav]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')

    this.state = { ui: 'default', appDataPresent: Store.appDataPresent ? true : false }

    this.addEventListeners()

    this.forceUpgradeStorage()
  }

  prepareMainViewComponent() {
    if (this.viewComponent) {
      this.viewComponent.remove()
    }
    this.viewComponent = this.mainViewContainer.appendChild(document.createElement('div'))
    this.viewComponent.dataset.viewComponent = ''
  }

  parseRequestURL() {
    let url = window.location.pathname.toLowerCase() || '/'
    let r = url.split('/')
    let request = {
      resource: null,
      id: null,
      verb: null
    }
    request.resource = r[1]
    request.id = r[2]
    request.verb = r[3]

    return request
  }

  router() {
    this.prepareMainViewComponent()
    const request = this.parseRequestURL()

    switch (request.resource) {
      case '':
        new Home(this.viewComponent, { displayRecords: true })
        break
      case 'records':
        if (request.verb) {
          console.log('new Form, action: ', request.verb, request.id)
          switch (request.verb) {
            case 'edit':
              new RecordForm(this.viewComponent, Store.getRecord(request.id))
              break

            default:
              break
          }
        } else if (request.id) {
          if ('new' == request.id) {
            new RecordForm(this.viewComponent, { mode: 'new' })
          } else {
            new Record(this.viewComponent, Store.getRecord(request.id))
          }
        } else {
          new RecordsList(this.viewComponent)
        }

        break
      case 'settings':
        // new RecordsList(this.viewComponent)
        break

      default:
        break
    }

    // this.mainView = new MainView(this.mainViewContainer, { target: window.location })
  }

  addEventListeners() {
    document.addEventListener('record-delete', deleteRecordHandler)
    document.addEventListener('record-edit', editRecordHandler.bind(this))
    document.addEventListener('record-add-new', recordAddNewHandler.bind(this))
    document.addEventListener('seed-state', seedStateHandler.bind(this))
    document.addEventListener('save-sample-data', saveSampleDataHandler.bind(this))
    document.addEventListener('navigate', this.router.bind(this))

    document.addEventListener('submitNewRecord', event => {
      const newRecord = Utils.processRecordFormData(event.detail.formData)
      Store.write.record(newRecord)
    })

    window.addEventListener('load', this.router.bind(this))

    window.onpopstate = function(event) {
      console.log(`location: ${window.location}, state: ${JSON.stringify(event.state)}`)
      this.router()
    }.bind(this)
  }

  render() {
    this.mainViewContainer.innerHTML = ''
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

  addRecord(submittedRecord) {
    submittedRecord = utils.sanitizeRecordEndDate(submittedRecord)
    var newRecord = {
      // todo: get max id with reduce()?
      id: this.state.records.length > 0 ? this.state.records[this.state.records.length - 1].id + 1 : 1,
      jobId: 1,
      begin: `${submittedRecord.date} ${submittedRecord.timeBegin}`,
      end: `${submittedRecord.dateEnd} ${submittedRecord.timeEnd}`
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

function recordAddNewHandler(event) {
  console.log('recieved add new event', event)
  this.prepareMainViewComponent()
  new RecordForm(this.viewComponent, { mode: 'new' })
}

function editRecordHandler(event) {
  console.log('recieved edit event', event)
  const record = this.store.records.filter(record => {
    return record.id == event.detail.id
  })[0]
  this.prepareMainViewComponent()
  new RecordForm(this.viewComponent, { mode: 'edit', record })
}

const app = new App(document.documentElement)
window.app = app
window.store = Store
