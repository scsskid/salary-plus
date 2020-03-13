import { Store } from './store.js'
import Router from './router.js'
import Routes from './data/routes.js'
import Nav from './components/MainNav.js'

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
    this.state = { ui: 'default', appDataPresent: Store.appDataPresent ? true : false }
    this.moduleRegistry = []
    this.router = new Router(Routes)

    this.addEventListeners()
    this.fixHeight()
    window.addEventListener('render', event => {
      console.log('here', event)

      document.querySelector('[data-view-title]').innerHTML = event.detail.title
    })
  }

  render() {
    this.mainViewContainer.innerHTML = ''
    this.mainFooter.appendChild(new Nav('main-navigation').container)

    window.addEventListener('popstate', this.onNavigate.bind(this))
    window.addEventListener('navigate', this.onNavigate.bind(this))

    window.addEventListener('routeLoad', this.onRouteLoad.bind(this))

    // Set Component Title
    // todo promise render, then emmit event, then (in index.js listener) title innerhtml change
  }

  addEventListeners() {
    document.addEventListener('recordSubmitted', event => Store.setRecord(event.detail.formData)) // Main Target: Form
    document.addEventListener('record-delete', event => Store.deleteRecord(event.detail.id)) // Main Target: List Item ot others
    document.addEventListener('save-sample-data', this.saveSampleData)

    document.addEventListener('clear-storage', () => {
      localStorage.clear()
    })
  }

  onRouteLoad(event) {
    const route = event.detail.route
    const state = { ...route.params }

    const registeredModule = this.moduleRegistry.find(moduleRegistryEl => {
      return moduleRegistryEl.id == route.module
    })

    document.querySelectorAll('[data-main-view] > *').forEach(function disconnectEl(el) {
      el.remove()
    })

    if (typeof registeredModule === 'undefined') {
      import(`./components/${route.module}.js`).then(moduleClass => {
        const importedModule = new moduleClass.default('div', state)
        importedModule.id = route.module // toString() ?
        importedModule.container.dataset.id = route.module // toString() ?
        this.moduleRegistry.push(importedModule)
        this.mainViewContainer.append(importedModule.container)
      })
    } else {
      this.mainViewContainer.appendChild(registeredModule.container)
    }
  }

  onNavigate(event) {
    if (event.detail && event.detail.pathname) {
      window.history.pushState({}, '', event.detail.pathname)
    }
    const pathnameSplit = window.location.pathname.toLowerCase().split('/')
    const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''
    this.router.loadRoute(pathSegments)

    // catch the moment when the new document state is already fully in place
    // by pushing the setTimeout CB to be processed at the end of the browser event loop (see mdn popstateEvent#historyStack)
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
