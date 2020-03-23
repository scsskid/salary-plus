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
    this.statusBar = new StatusBar('div')
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
    events.on('navigate', this.onNavigate.bind(this)) // ? why this position in class
    this.mainViewContainer.innerHTML = ''
    this.mainHeader.appendChild(this.statusBar.container)
    this.mainFooter.appendChild(new Nav('main-navigation').container)

    window.addEventListener('popstate', this.onNavigate.bind(this))
  }

  addEventListeners() {
    // Routing
    events.on('routeLoad', this.onRouteLoad.bind(this))
    events.on(
      'update-view-title',
      data => (this.viewTitle.innerHTML = typeof data !== 'undefined' ? data.title : 'Untitled View')
    )

    events.on('select-date', data => {
      proxyState.inputDate = data.date
    })

    // Process Form Data
    events.on('record-submitted', data => {
      // MapFormData then pass to Store and State
      const record = Utils.mapFormDataToStorageObject(data.formData)
      // Mutate Array
      const records = mutateArray(record, [...Store.get('records')])

      this.commit('records', records)
      proxyState.inputDate = new Date(data.formData.dateBegin)

      events.publish('navigate', {
        pathname: data.origin
      })
    })
    events.on('record-delete', data => {
      const records = deleteObjInArrayById(data.id, [...Store.get('records')])

      this.commit('records', records)

      events.publish('navigate', {
        pathname: data.origin,
        params: { msg: 'from record delete handler 🍄' }
      })
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
    const requestedModuleName = route.module

    // Check if module was loaded before and pushed to registry
    let existingModuleInstance = this.moduleRegistry.find(el => {
      return el.id == requestedModuleName
    })

    // todo: get existing module and disconnect()

    // Check if current MainViewcomponent is not the reuqested module
    if (typeof existingModuleInstance === 'undefined' || existingModuleInstance.id != proxyState.mainViewComponent) {
      // Remove existing viewContainer from Dom (It remains in Regsitry)
      document.querySelectorAll('[data-main-view] > *').forEach(function disconnectEl(el) {
        el.remove()
      })
    }

    // todo: promise render, then emmit event, then (in index.js listener) title innerhtml change

    if (typeof existingModuleInstance === 'undefined') {
      // console.log('module not present, attempting to load:', requestedModuleName)

      import(`./components/${requestedModuleName}.js`)
        .then(handleModuleImport.bind(this))
        .then(updateViewTitle)
    } else {
      console.log('pstate mainviewcomp', proxyState.mainViewComponent)
      console.log('existingModuleInstance.id', existingModuleInstance.id)

      //
      if (proxyState.mainViewComponent != existingModuleInstance.id) {
        existingModuleInstance.connectedCallback()
        this.mainViewContainer.appendChild(existingModuleInstance.container)
        events.publish('update-view-title', existingModuleInstance.content)
        proxyState.mainViewComponent = existingModuleInstance.id
      }
    }

    //

    function handleModuleImport(moduleClass) {
      // console.log({ ...params, ...this.state })

      // dont pass parameters?
      const module = new moduleClass.default('div', { ...params })
      // const module = new moduleClass.default('div', { ...params, ...this.state })

      // Set Module Name as id, so if can be checked if already instanciated later
      module.id = requestedModuleName
      proxyState.mainViewComponent = requestedModuleName
      module.container.dataset.mainViewComponent = requestedModuleName

      // Dont Register Record Form
      if (requestedModuleName != 'RecordForm') {
        // ! reconsider soon
        // preserve Views
        this.moduleRegistry.push(module)
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

  commit(prop, data) {
    // pass to Store
    Store.set(prop, data)
    // pass to State
    proxyState[prop] = data
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
