import { Store } from './store.js'
import Routes from './data/routes.js'
import Nav from './components/MainNav.js'
import sampleData from './data/sample-data.js'
import Toolbar from './components/Toolbar.js'
import Router from './router.js'

// console.log(new StoreFn().appData)

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
    this.navContainer = this.container.querySelector('[data-main-nav]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')
    this.state = { ui: 'default', appDataPresent: Store.appDataPresent ? true : false }

    this.router = new Router(Routes)

    this.addEventListeners()
    this.fixHeight()
  }

  prepareMainViewComponent() {
    if (this.viewComponent) {
      this.viewComponent.remove()
    }
    this.viewComponent = this.mainViewContainer.appendChild(document.createElement('div'))
    this.viewComponent.dataset.viewComponent = ''
  }

  render() {
    this.mainViewContainer.innerHTML = ''

    // todo: resolve single compoenents like toolbar in parent component like footer
    new Nav(this.navContainer).render()
    // new Toolbar(document.querySelector('[data-toolbar]'))

    window.addEventListener('popstate', onPopState.bind(this))
    window.addEventListener('navigate', onNavigate.bind(this))

    function onPopState() {
      console.log(this, 'onPopstate sync wlp', window.location.pathname)

      //! todo: refactor
      const pathnameSplit = window.location.pathname.toLowerCase().split('/')
      const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''

      this.router.loadRoute(pathSegments)
    }

    function onNavigate(event) {
      window.history.pushState({}, '', event.detail.pathname)
      // console.log('onNavigateSync wlp', window.location.pathname)

      // ! todo: refactor
      const pathnameSplit = window.location.pathname.toLowerCase().split('/')
      const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''

      this.router.loadRoute(pathSegments)

      // catch the moment when the new document state is already fully in place
      // by pushing the setTimeout CB to be processed at the end of the browser event loop (see mdn popstateEvent#historyStack)
      // setTimeout(event => {}, 0)
    }

    window.addEventListener('routeLoad', event => {
      // console.log('recieved routeLoad event', event.detail.route)

      const route = event.detail.route
      // const state = { ...route.params, ...route.data }
      const state = { ...route.params }

      // console.log(Object.keys(route.params).length)

      import(`./components/${route.module}.js`)
        .then(moduleClass => {
          this.prepareMainViewComponent()
          const module = new moduleClass.default(this.viewComponent, state)

          // console.log('module:', module, 'state:', state)
          module.render()
        })
        .catch(err => {
          console.log(err)
        })
    })

    window.addEventListener('render', event => {
      console.log(event)
      document.querySelector('[data-view-title]').innerHTML = event.detail.title
    })
  }

  addEventListeners() {
    document.addEventListener('recordSubmitted', event => Store.setRecord(event.detail.formData)) // Main Target: Form
    document.addEventListener('record-delete', deleteRecord) // Main Target: List Item ot others

    function deleteRecord() {
      Store.deleteRecord(event.detail.id)
    }

    document.addEventListener('save-sample-data', () => {
      localStorage.setItem('sp_app', JSON.stringify(sampleData.app))
      localStorage.setItem('sp_user', JSON.stringify(sampleData.user))
      localStorage.setItem('sp_records', JSON.stringify(sampleData.records))
      localStorage.setItem('sp_jobs', JSON.stringify(sampleData.jobs))
      this.render()
    })
  }

  constructor(container) {
    this.init(container)
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
}

const app = new App(document.documentElement)
window.app = app
window.store = Store
window.storage = Storage
