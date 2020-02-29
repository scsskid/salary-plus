import Home from './home.js'
import RecordsList from './records-list.js'
// import UserSettings from './user-settings.js'

export default class MainView {
  set state(state) {
    // console.log('mainView set state', state)
    this.stateValue = state
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container
    this.viewComponent = this.container.querySelector('[data-view-component]')
    this.state = state || undefined
    this.render()
  }

  prepareView() {
    if (this.viewComponent) {
      this.viewComponent.remove()
    }
    this.viewComponent = this.container.appendChild(document.createElement('div'))
    this.viewComponent.dataset.viewComponent = ''
  }

  render() {
    switch (this.state.target.pathname) {
      case '/':
        this.prepareView()
        new Home(this.viewComponent, { displayRecords: true })
        break
      case '/records':
        this.prepareView()
        new RecordsList(this.viewComponent)
        break
      default:
        // 404
        break
    }
  }

  addEventListeners() {}

  constructor(container, state) {
    this.init(container, state)
  }
}
