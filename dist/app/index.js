import Store from './store.js'
import Router from './router.js'
import Routes from './data/routes.js'
import Nav from './components/MainNav.js'
import StatusBar from './components/StatusBar.js'
import { events } from './utils.js'
import { isEmpty, mutateArray, deleteObjInArrayById } from './lib/helpers.js'
import Utils from './utils.js'
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
    events.on(
      'update-view-title',
      data => (this.viewTitle.innerHTML = typeof data !== 'undefined' ? data.title : 'Untitled View')
    )

    events.on('select-date', data => {
      proxyState.inputDate = data.date
      // if form exists in registry: set state = input date

      // const recordFormInstance = this.moduleRegistry.find(el => {
      //   return el.module.id == 'RecordForm'
      // })

      // if (!isEmpty(recordFormInstance)) {
      //   recordFormInstance.module.state = { inputDate: data.date }
      // }
    })

    // Process Form Data
    events.on('record-submitted', data => {
      // MapFormData then pass to Store and State
      let records = store.get('records').return()
      const record = Utils.mapFormDataToStorageObject(data.formData)
      // Mutate Array
      records = mutateArray(record, [...records])
      this.commit('records', records)
      proxyState.inputDate = new Date(data.formData.dateBegin)

      events.publish('navigate', {
        // pathname: data.origin
        pathname: '/'
      })
    })

    events.on('record-delete', data => {
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
    const route = data.route
    const params = { ...data.params, ...data.props, ...route.params }

    // Get connected module from registry
    const connectedEl = this.moduleRegistry.find(el => el.status == 'connected')

    // Check if requested  module was loaded before and pushed to registry
    const requestedRegistryEl = getRegistryEl(route.moduleName, this.moduleRegistry)
    function getRegistryEl(moduleName, registry) {
      return registry.find(el => {
        return el.module.id == moduleName
      })
    }

    // if no connected el found, or
    if (!connectedEl) {
      importAndConnectModule.bind(this)(route.moduleName)
      return
    }

    // subsequent page load
    //  requested module is found in registry
    if (typeof requestedRegistryEl !== 'undefined') {
      console.log(`Requesting [ ${requestedRegistryEl.module.id} ] from Registry`)
      // Handle: The Requested Module IS PRESENT in registry
      // needs to refresh?
      let stateHasChanged = false
      if (!isEmpty(params)) {
        stateHasChanged = !isEmpty(diffObjects(requestedRegistryEl.module.state, params))
      }
      // ! DIFF STATE HERE
      // ? move diff to component?
      // DIff State of existing instance with requested props
      console.warn(
        `[ ${requestedRegistryEl.module.id} ] stateHasChanged?`,
        stateHasChanged,
        requestedRegistryEl.module.state,
        params
      )
      if (stateHasChanged) {
        // Trigger Setter Fn of Module
        requestedRegistryEl.module.state = params
      } else if (requestedRegistryEl.module.id == 'RecordForm') {
        // ! Exception: Rerender Form every Time, because there is no check when it's used for 'new' entry after state was 'edit' before
        // console.log('Form exception handler', requestedRegistryEl.module.state)
        // if state.recordId (and)but pathname records/new, flush state to trigger rerender
        if (requestedRegistryEl.module.state.recordId !== undefined && window.location.pathname == '/records/new') {
          requestedRegistryEl.module.state = {}
          //! Input Date Remains == proyyState InputDate
        }
      }

      // but is it already in dom?
      if (connectedEl.module == requestedRegistryEl.module) {
        // console.log('already in dom', params)
        // always refresh form when displayed
      } else if (connectedEl.module != requestedRegistryEl.module) {
        // console.log('the requested is not the one in the dom')
        connectedEl.status = 'disconnect'
        connectedEl.module.container.remove()
        requestedRegistryEl.status = 'connected'
        connectModule.bind(this)(requestedRegistryEl.module)
      }
    } else if (typeof requestedRegistryEl === 'undefined') {
      // Handle: The Requested Module IS NOT PRESENT in registry
      // console.log('req not in registry, importing...')
      connectedEl.status = 'disconnect'
      connectedEl.module.container.remove()
      importAndConnectModule.bind(this)(route.moduleName)
    } else {
      console.error('EXCEPTION')
    }

    // todo: promise render, then emmit event, then (in index.js listener) title innerhtml change

    //

    function importAndConnectModule(moduleName) {
      import(`./components/${moduleName}.js`)
        .then(handleModuleImport.bind(this))
        .then(updateViewTitle)
    }

    function handleModuleImport(moduleClass) {
      // dont pass parameters?
      const module = new moduleClass.default('div', { ...params })

      // connect
      this.mainViewContainer.appendChild(module.container)

      // Set Module Name as id, so if can be checked if already instanciated later
      module.id = route.moduleName
      proxyState.mainViewComponent = route.moduleName
      module.container.dataset.mainViewComponent = route.moduleName

      // Dont Register Record Form
      // if (route.moduleName != 'RecordForm') {
      this.moduleRegistry.push({ module, status: 'connected' })
      // }

      updateViewTitle(module)

      return module
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

//

function connectModule(module) {
  console.log('connect Module Fn', module)

  this.mainViewContainer.appendChild(module.container)
  module.connectedCallback()
  events.publish('update-view-title', module.content)
  proxyState.mainViewComponent = module.id
}

function updateViewTitle(module) {
  events.publish('update-view-title', module.content)
}
