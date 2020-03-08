import { Store, StoreFn } from './lib/store.js'
import Routes from './data/routes.js'
import Nav from './components/MainNav.js'
import sampleData from './data/sample-data.js'
import Toolbar from './components/Toolbar.js'
import Router from './lib/router.js'

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
    this.store = JSON.parse(localStorage.getItem('appData'))
    this.navContainer = this.container.querySelector('[data-main-nav]')
    this.mainViewContainer = this.container.querySelector('[data-main-view]')
    this.state = { ui: 'default', appDataPresent: Store.appDataPresent ? true : false }

    this.router = new Router(Routes)

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

  render() {
    this.mainViewContainer.innerHTML = ''

    // todo: resolve single compoenents like toolbar in parent component like footer
    new Nav(this.navContainer).render()
    new Toolbar(document.querySelector('[data-toolbar]')).render()

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
      const state = { ...route.params, ...route.data }

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
  }

  addEventListeners() {
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
