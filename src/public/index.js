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
      case 'calendar':
        // new Calendar(this.viewComponent)
        break
      case 'settings':
        // new Settings(this.viewComponent)
        break

      default:
        break
    }
  }

  addEventListeners() {
    document.addEventListener('navigate', this.router.bind(this))
    window.addEventListener('load', this.router.bind(this))

    document.addEventListener(
      'record-add-new',
      function recordAddNewHandler(event) {
        console.log('recieved add new event', event)
        this.prepareMainViewComponent()
        new RecordForm(this.viewComponent, { mode: 'new' })
      }.bind(this)
    )

    document.addEventListener(
      'record-edit',
      function editRecordHandler(event) {
        console.log('recieved edit event', event)
        const record = this.store.records.find(record => {
          return record.id == event.detail.id
        })
        this.prepareMainViewComponent()
        new RecordForm(this.viewComponent, { mode: 'edit', record })
      }.bind(this)
    )

    document.addEventListener('record-delete', function deleteRecordHandler(event) {
      console.log('recieved delete event', event)
    })

    document.addEventListener(
      'save-sample-data',
      function saveSampleDataHandler() {
        console.log('saveSampleDataHandler()')

        localStorage.setItem('appData', JSON.stringify(sampleData))
        this.render()
      }.bind(this)
    )

    document.addEventListener(
      'submitNewRecord',
      function subNewRecordHandler(event) {
        const newRecord = Utils.processRecordFormData(event.detail.formData)
        Store.write.record(newRecord)
      }.bind(this)
    )

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

const app = new App(document.documentElement)
window.app = app
window.store = Store
