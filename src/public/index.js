import Nav from './components/nav.js'
import sampleData from './data/sample-data.js'
import Toolbar from './components/toolbar.js'
import Home from './components/home.js'
import RecordsList from './components/records-list.js'
import Record from './components/record.js'
import RecordForm from './components/record-form.js'

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

    this.appDataPresent = localStorage.hasOwnProperty('appData')
    this.store = JSON.parse(localStorage.getItem('appData'))

    this.navContainer = this.container.querySelector('[data-main-nav]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')

    this.state = { ui: 'default', appDataPresent: this.store ? true : false }

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
          console.log('new Form, action: ', request.verb)

          const record = this.store.records.filter(record => {
            return record.id == request.id
          })[0]

          switch (request.verb) {
            case 'edit':
              new RecordForm(this.viewComponent, record)
              break

            default:
              break
          }
        } else if (request.id) {
          if ('new' == request.id) {
            new RecordForm(this.viewComponent, {})
          } else {
            console.log('get single', this.viewComponent)

            const record = this.store.records.filter(record => {
              return record.id == request.id
            })[0]

            new Record(this.viewComponent, record)
          }
        } else {
          console.log('view list')

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
  new RecordForm(this.viewComponent, {})
}

function editRecordHandler(event) {
  console.log('recieved edit event', event)
  const record = this.store.records.filter(record => {
    return record.id == event.detail.id
  })[0]
  this.prepareMainViewComponent()
  new RecordForm(this.viewComponent, record)
}

const app = new App(document.documentElement)
window.app = app
