import { Store } from './store.js'
import Routes from './data/routes.js'
import Nav from './components/MainNav.js'
import sampleData from './data/sample-data.js'
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

  render() {
    this.mainViewContainer.innerHTML = ''

    // todo: resolve single compoenents like toolbar in parent component like footer
    new Nav(this.navContainer)
    window.addEventListener('popstate', this.onNavigate.bind(this))
    window.addEventListener('navigate', this.onNavigate.bind(this))

    window.addEventListener('routeLoad', this.onRouteLoad.bind(this))

    // Set Component Title
    window.addEventListener('render', event => {
      document.querySelector('[data-view-title]').innerHTML = event.detail.title
    })
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
    const viewComponents = document.querySelectorAll('[data-view-component]')
    console.log('requesting', route.module)
    console.log(viewComponents.length + ' view Components present ')

    if (viewComponents) {
      viewComponents.forEach(el => {
        console.log('hiding... ', el)

        el.style.display = 'none'
      })
    }

    const existingContainer = Array.from(viewComponents).find(el => {
      return (el.dataset.module = route.module)
    })

    import(`./components/${route.module}.js`).then(moduleClass => {
      // ! move code outside of import

      // look for existing

      console.log(existingContainer)
      {
        let moduleContainer
        if (typeof existingContainer === 'undefined') {
          this.viewComponent = document.createElement('div')
          this.viewComponent.dataset.viewComponent = route.module
          this.viewComponent.dataset.module = route.module
          // ? append after instanciation, not before?
          this.mainViewContainer.appendChild(this.viewComponent)
          moduleContainer = this.viewComponent
          const module = new moduleClass.default(moduleContainer, state)
        } else {
          moduleContainer = existingContainer
          existingContainer.style.display = 'block'
        }
      }
      // new instance

      // console.log('module:', module, 'state:', state)
      // module.render()
    })

    // .catch(err => {
    //   console.log(err)
    // })
  }

  onNavigate(event) {
    if (event.detail && event.detail.pathname) {
      window.history.pushState({}, '', event.detail.pathname)
    }
    // console.log('onNavigateSync wlp', window.location.pathname)

    // ! todo: refactor
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

  saveSampleData() {
    localStorage.setItem('sp_app', JSON.stringify(sampleData.app))
    localStorage.setItem('sp_user', JSON.stringify(sampleData.user))
    localStorage.setItem('sp_records', JSON.stringify(sampleData.records))
    localStorage.setItem('sp_jobs', JSON.stringify(sampleData.jobs))
  }

  constructor(container) {
    this.init(container)
  }
}

const app = new App(document.documentElement)
window.app = app
window.store = Store
window.storage = Storage
