import { Store } from './lib/store.js'
import Nav from './components/nav.js'
import sampleData from './data/sample-data.js'
import Toolbar from './components/toolbar.js'
import Home from './components/home.js'
import RecordsList from './components/records-list.js'
import Record from './components/record.js'
import RecordForm from './components/record-form.js'
import Utils from './utils.js'

import Router from './components/router.js'

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
    this.store = JSON.parse(localStorage.getItem('appData'))
    this.navContainer = this.container.querySelector('[data-main-nav]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')
    this.state = { ui: 'default', appDataPresent: Store.appDataPresent ? true : false }

    this.router = new Router()

    window.onpopstate = onLocationChange.bind(this)
    document.addEventListener('navigate', onLocationChange.bind(this))

    function onLocationChange(event) {
      console.log(event)

      let url

      // event will be CustomEvent from Navigation or
      // PopStateEvent from window.onpopstate
      /*
      if (event instanceof CustomEvent) {
        console.log('Custom Event (navigtion)!!')
        url = event.detail.url.pathname
      } else if (event instanceof PopStateEvent) {
        console.log('Pop State EVent ()!!')
        url = window.location.pathname
      }
      */

      // console.log('URL to send to router', url)

      console.log('sync', window.location.pathname)

      const pathnameSplit = window.location.pathname.toLowerCase().split('/')
      const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''
      // console.log(pathnameSplit, pathnameSplit.length, pathSegments)

      this.router.loadRoute(pathSegments)

      // catch the moment when the new document state is already fully in place
      // by pushing the setTimeout CB to be processed at the end of the browser event loop (see mdn popstateEvent#historyStack)
      setTimeout(event => {
        console.log('async', window.location.pathname)

        // todo: split and/or splice
        // this.router.loadRoute([''])
      }, 0)
    }

    // window.onpopstate = function(event) {
    //   console.log(`location: ${window.location}, state: ${JSON.stringify(event.state)}`)
    //   this.router()
    // }.bind(this)

    // this.router.loadRoute(['records', '2'])

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
    let r = url.split('/').slice(1)
    let request = {
      resource: null,
      id: null,
      verb: null
    }
    request.resource = r[0]
    request.id = r[1]
    request.verb = r[2]

    return request
  }

  // router() {
  //   this.prepareMainViewComponent()
  //   const request = this.parseRequestURL()

  //   switch (request.resource) {
  //     case '':
  //       new Home(this.viewComponent, { displayRecords: true })
  //       break
  //     case 'records':
  //       if (request.verb) {
  //         switch (request.verb) {
  //           case 'edit':
  //             new RecordForm(this.viewComponent, { record: Store.getRecord(request.id) })
  //             break

  //           default:
  //             break
  //         }
  //       } else if (request.id) {
  //         if ('new' == request.id) {
  //           new RecordForm(this.viewComponent, {})
  //         } else {
  //           // /records/${id}
  //           new Record(this.viewComponent, Store.getRecord(request.id))
  //         }
  //       } else {
  //         new RecordsList(this.viewComponent)
  //       }

  //       break
  //     case 'calendar':
  //       // new Calendar(this.viewComponent)
  //       break
  //     case 'settings':
  //       // new Settings(this.viewComponent)
  //       break

  //     default:
  //       break
  //   }
  // }

  addEventListeners() {
    // document.addEventListener('navigate', this.router.bind(this))
    // window.addEventListener('load', this.router.bind(this))

    window.document.addEventListener(
      'record-add-new',
      function recordAddNewHandler(event) {
        this.prepareMainViewComponent()
        new RecordForm(this.viewComponent, { mode: 'new' })
      }.bind(this)
    )

    document.addEventListener(
      'record-edit',
      function editRecordHandler(event) {
        const record = Store.getRecord(event.detail.id)
        this.prepareMainViewComponent()
        new RecordForm(this.viewComponent, { mode: 'edit', record })
      }.bind(this)
    )

    document.addEventListener('record-delete', function deleteRecordHandler(event) {
      console.log('recieved delete event', event)

      Store.write.delete(event.detail.id)
    })

    document.addEventListener(
      'save-sample-data',
      function saveSampleDataHandler() {
        localStorage.setItem('appData', JSON.stringify(sampleData))
        this.render()
      }.bind(this)
    )

    document.addEventListener(
      'recordSubmitted',
      function subNewRecordHandler(event) {
        Store.write.record(event.detail.formData)
      }.bind(this)
    )
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
