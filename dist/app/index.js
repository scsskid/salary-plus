import { Store } from './store.js'
import Router from './router.js'
import Routes from './data/routes.js'
import Nav from './components/MainNav.js'
import StatusBar from './components/StatusBar.js'
import { events } from './utils.js'
import { getObjById, mutateArray, deleteObjInArrayById } from './lib/helpers.js'
import Utils from './utils.js'
import proxyState from './lib/Proxy.js'

class App {
  set state(state) {
    this.stateValue = state
    // this.render()
  }

  get state() {
    return this.stateValue
  }

  init(container) {
    this.state = proxyState
    window.proxyState = proxyState

    this.container = container
    this.mainHeader = this.container.querySelector('.main-header')
    this.mainFooter = this.container.querySelector('[data-main-footer]')
    this.statusBar = new StatusBar('status-bar', { records: proxyState.records })
    this.mainViewContainer = this.container.querySelector('[data-main-view]')
    this.viewTitle = document.querySelector('[data-view-title]')

    this.moduleRegistry = []
    this.addEventListeners()
    this.router = new Router(Routes)

    /*
    if (Store.get('user') == null) {
      console.log('NO USER IN STATE')
      events.publish('navigate', { pathname: '/welcome' })
    }
    */

    this.fixHeight()
    this.render()
  }

  render() {
    this.mainViewContainer.innerHTML = ''
    this.mainHeader.appendChild(this.statusBar.container)
    this.mainFooter.appendChild(new Nav('main-navigation').container)

    window.addEventListener('popstate', this.onNavigate.bind(this))
    events.on('navigate', this.onNavigate.bind(this)) // ? why this position in class

    // window.addEventListener('routeLoad', this.onRouteLoad.bind(this))

    // Set Component Title
  }

  addEventListeners() {
    // Routing
    events.on('routeLoad', this.onRouteLoad.bind(this))
    events.on(
      'update-view-title',
      data => (this.viewTitle.innerHTML = typeof data !== 'undefined' ? data.title : 'Untitled View')
    )

    // Process Form Data
    events.on('record-submitted', data => {
      // MapFormData then pass to Store and State
      const record = Utils.mapFormDataToStorageObject(data.formData)
      // Mutate Array
      const records = mutateArray(record, [...Store.get('records')])
      // pass to Store
      Store.set('records', records)
      // pass to State
      proxyState.records = records

      events.publish('navigate', {
        pathname: data.origin,
        params: { msg: 'from record submitted handler 🍫', inputDate: data.formData.dateBegin }
      })
    })
    events.on('record-delete', data => {
      const records = deleteObjInArrayById(data.id, [...Store.get('records')])
      // pass to Store
      Store.set('records', records)
      // pass to State
      proxyState.records = records

      events.publish('navigate', {
        pathname: data.origin,
        params: { msg: 'from record delete handler 🍄' }
      })
    })

    // State Management
    events.on('proxyStateChanged', data => {
      console.log('proxyStateChanged sub')
      // this.logState(data)
    })

    // Admin Tools
    events.on('save-sample-data', Store.saveSampleData)
    events.on('clear-storage', () => localStorage.clear())
  }

  logState(data) {
    const { key, value } = data
    const stateCopy = { ...proxyState }

    console.groupCollapsed('Proxy State Props')
    for (const prop in stateCopy) {
      console.log(prop, stateCopy[prop])
    }
    console.groupEnd()
  }

  onRouteLoad(data) {
    const route = data.route
    const params = { ...route.params, ...data.params }

    // Check if module was loaded before and pushed to registry
    const module = this.moduleRegistry.find(moduleRegistryEl => {
      return moduleRegistryEl.id == route.module
    })

    // Remove existing viewContainer from Dom (It remains in Regsitry)
    document.querySelectorAll('[data-main-view] > *').forEach(function disconnectEl(el) {
      el.remove()
    })

    // todo: promise render, then emmit event, then (in index.js listener) title innerhtml change

    if (typeof module === 'undefined') {
      import(`./components/${route.module}.js`)
        .then(processImportedModule.bind(this))
        .then(updateViewTitle)
    } else {
      this.mainViewContainer.appendChild(module.container)
      events.publish('update-view-title', module.content)
    }

    function processImportedModule(moduleClass) {
      const module = new moduleClass.default('div', { ...params, ...this.state })

      module.id = route.module
      module.container.dataset.id = route.module

      // Dont Register Record Form
      if (route.module != 'RecordForm') {
        // ! reconsider soon
        // preserve Views
        // this.moduleRegistry.push(module)
      }
      this.mainViewContainer.appendChild(module.container)
      updateViewTitle(module)

      return module
    }

    function updateViewTitle(module) {
      events.publish('update-view-title', module.content)
    }
  }

  onNavigate(data) {
    if (data && data.pathname) {
      window.history.pushState({}, '', data.pathname)
    }
    const pathnameSplit = window.location.pathname.toLowerCase().split('/')
    const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''
    this.router.loadRoute({ pathSegments, params: data.params })

    // catch the moment when the new document state is already fully in place
    // by pushing the setTimeout CB to be processed at the end of the browser event loop
    // (see mdn popstateEvent#historyStack)
    // setTimeout(event => {}, 0)
  }

  fixHeight() {
    // !todo throttle/debounce
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }

  // todo: move fn to Store Module

  constructor(container) {
    this.init(container)
  }
}

const app = new App(document.documentElement)
window.app = app
window.store = Store
window.storage = Storage
