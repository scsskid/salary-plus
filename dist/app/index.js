import Store from './store.js'
import Router from './router.js'
import Routes from './data/routes.js'
import Nav from './components/MainNav.js'
import StatusBar from './components/StatusBar.js'
import Utils, { events } from './utils.js'
import { isEmpty, mutateArray, deleteObjInArrayById } from './lib/helpers.js'
import proxyState from './lib/Proxy.js'
import diffObjects from './vendor/objects-diff.js'

const store = new Store()
class App {
  set state(state) {
    this.stateValue = state
  }

  get state() {
    return this.stateValue
  }

  init(container) {
    this.state = proxyState

    this.container = container
    this.mainHeader = this.container.querySelector('.main-header')
    this.statusBar = new StatusBar('div')
    this.viewTitle = document.querySelector('[data-view-title]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')
    this.mainFooter = this.container.querySelector('[data-main-footer]')

    this.moduleRegistry = []
    this.addEventListeners()
    this.router = new Router(Routes)

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

    // Process Form Data
    events.on('record-submitted', data => {
      console.log('record-sumitted Handler')
      // MapFormData then pass to Store and State
      let records = store.get('records').return()
      const record = Utils.mapFormDataToStorageObject(data.formData)
      // Mutate Array
      records = mutateArray(record, [...records])
      this.commit('records', records)
      proxyState.records = records
      proxyState.inputDate = new Date(data.formData.dateBegin)

      // console.log(this.moduleRegistry.find(module => module.id == 'Home'))

      events.publish('navigate', { pathname: '/' })
    })

    events.on('record-delete', data => {
      console.log('record-delete Handler')

      let records = store.get('records').return()
      records = deleteObjInArrayById(data.id, [...records])
      this.commit('records', records)
      events.publish('navigate', {
        pathname: data.origin,
        pathname: '/',
        params: { records } // ? why
      })
    })

    // Admin Tools
    events.on('save-sample-data', Store.saveSampleData)
    events.on('clear-storage', _ => localStorage.clear())
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
    this.requestedRoute = data.route
    const route = this.requestedRoute
    this.requestedRouteParams = { ...data.params, ...data.props, ...route.params }

    const params = this.requestedRouteParams

    const connectedEl = this.moduleRegistry.find(el => el.status == 'connected')
    const cachedEl = this.moduleRegistry.find(el => el.module.id == route.moduleName)

    // Route not Found
    if (typeof route.moduleName === 'undefined') {
      importAndConnectModule.bind(this)('404')
      updateTitle.bind(this)('Not Found')
      return
    }

    // Found
    // Intial page Load
    if (!connectedEl) {
      importAndConnectModule.call(this, this.requestedRoute.moduleName)
      return
    }

    // check if connect module is requested again
    // console.log('is connected module is the requested', connectedEl == cachedEl, connectedEl, cachedEl)
    // if (connectedEl != cachedEl) {
    // }

    if (typeof cachedEl !== 'undefined') {
      // requested module is found in registry
      console.log(`Requesting [ ${cachedEl.module.id} ] from Registry`)
      // Handle: The Requested Module IS PRESENT in registry
      // needs to refresh?
      let stateHasChanged = false
      if (!isEmpty(params)) {
        stateHasChanged = !isEmpty(diffObjects(cachedEl.module.state, params))
      }
      // ? move diff to component?
      // DIff State of existing instance with requested props
      console.warn(`[ ${cachedEl.module.id} ] stateHasChanged?`, stateHasChanged, cachedEl.module.state, params)
      if (stateHasChanged) {
        // Trigger Setter Fn of Module
        cachedEl.module.state = params
      } else if (cachedEl.module.id == 'RecordForm') {
        // ! Exception: Rerender Form every Time, because there is no check when it's used for 'new' entry after state was 'edit' before
        // console.log('Form exception handler', requestedRegistryEl.module.state)
        // if state.recordId (and)but pathname records/new, flush state to trigger rerender
        if (cachedEl.module.state.recordId !== undefined && window.location.pathname == '/records/new') {
          cachedEl.module.state = {}
          //! Input Date Remains == proyyState InputDate
        }
      }

      // but is it already in dom?
      if (connectedEl.module == cachedEl.module) {
        console.log('already in dom', params)
        // always refresh form when displayed
      } else if (connectedEl.module != cachedEl.module) {
        console.log('the requested is not the one in the dom')

        disconnectModule(connectedEl)
        connectModule.call(this, cachedEl)
      }
    } else if (typeof cachedEl === 'undefined') {
      // Handle: The Requested Module IS NOT PRESENT in registry
      console.log('req not in registry, importing...')

      disconnectModule(connectedEl)
      importAndConnectModule.call(this, route.moduleName)
    } else {
      console.error('EXCEPTION')
    }
  }

  onNavigate(data) {
    if (data && data.pathname) {
      window.history.pushState({}, '', data.pathname)
    }
    const pathnameSplit = window.location.pathname.toLowerCase().split('/')
    const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''
    this.router.loadRoute({ pathSegments, params: { ...data.params, ...data.props } })

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
    store.set(prop, data)
    // pass to State
    // proxyState[prop] = data
  }

  // todo: move fn to Store Module

  constructor(container) {
    this.init(container)
  }
}

const app = new App(document.documentElement)
window.app = app
window.store = store
window.proxyState = proxyState
window.events = events

//

function updateTitle(title) {
  this.viewTitle.innerHTML = typeof title !== 'undefined' ? title : 'Untitled View'
}

function disconnectModule(moduleEl) {
  moduleEl.status = 'disconnected'
  moduleEl.module.disconnectedCallback()
  moduleEl.module.container.remove()
}

function connectModule(moduleEl) {
  console.log('connectModule()', moduleEl)
  this.mainViewContainer.appendChild(moduleEl.module.container)
  moduleEl.module.connectedCallback()
  moduleEl.status = 'connected'
  proxyState.connectedMainViewComponent = moduleEl.module.id
  updateTitle.bind(this)(moduleEl.module.id)
}

function importAndConnectModule(moduleName) {
  import(`./components/${moduleName}.js`)
    .then(handleModuleImport.bind(this))
    .then(_ => {
      updateTitle.bind(this)(this.requestedRoute.title)
    })
}

function handleModuleImport(moduleClass) {
  const name = moduleClass.default.name
  // const name = moduleClass.default.getClassName() // if minifier changes function names

  // dont pass parameters?
  const module = new moduleClass.default('div', { ...this.params })

  // connect
  this.mainViewContainer.appendChild(module.container)

  // Set Module Name as id, so if can be checked if already instanciated later
  module.id = name
  proxyState.connectedMainViewComponent = name
  module.container.dataset.mainViewComponent = name
  this.moduleRegistry.push({ module, status: 'connected' })

  return module
}
