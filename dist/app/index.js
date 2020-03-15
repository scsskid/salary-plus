import { Store } from './store.js'
import Router from './router.js'
import Routes from './data/routes.js'
import Nav from './components/MainNav.js'
import { events } from './utils.js'

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
    this.mainFooter = this.container.querySelector('[data-main-footer]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')
    this.viewTitle = document.querySelector('[data-view-title]')
    this.state = { ui: 'default', appDataPresent: Store.appDataPresent ? true : false }

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
  }

  render() {
    this.mainViewContainer.innerHTML = ''
    this.mainFooter.appendChild(new Nav('main-navigation').container)

    window.addEventListener('popstate', this.onNavigate.bind(this))
    events.on('navigate', this.onNavigate.bind(this))

    // window.addEventListener('routeLoad', this.onRouteLoad.bind(this))

    // Set Component Title
  }

  addEventListeners() {
    // Routing
    events.on('routeLoad', this.onRouteLoad.bind(this))
    events.on('update-view-title', data => (this.viewTitle.innerHTML = typeof data !== 'undefined' ? data.title : 'Untitled View'))

    // Process Form Data
    events.on('record-submitted', data => Store.setRecord(data.formData))
    events.on('record-delete', data => Store.deleteRecord(data.id))

    // Admin Tools
    events.on('save-sample-data', Store.saveSampleData)
    events.on('clear-storage', () => localStorage.clear())
  }

  onRouteLoad(data) {
    const route = data.route
    const state = { ...route.params }

    // Check if module was loaded before and pushed to registry
    const module = this.moduleRegistry.find(moduleRegistryEl => {
      return moduleRegistryEl.id == route.module
    })

    // Remove existing viewContainer from Dom (It remains in Regsitry)
    document.querySelectorAll('[data-main-view] > *').forEach(function disconnectEl(el) {
      el.remove()
    })

    // todo: promise render, then emmit event, then (in index.js listener) title innerhtml change
    {
      if (typeof module === 'undefined') {
        import(`./components/${route.module}.js`)
          .then(processImportedModule.bind(this))
          .then(updateViewTitle)
      } else {
        this.mainViewContainer.appendChild(module.container)
        events.publish('update-view-title', module.content)
      }
    }

    function processImportedModule(moduleClass) {
      const module = new moduleClass.default('div', state)

      module.id = route.module
      module.container.dataset.id = route.module

      // Dont Register Record Form
      if (route.module != 'RecordForm') {
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
    this.router.loadRoute(pathSegments)

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
