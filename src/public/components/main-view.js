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
    this.viewTitle = this.container.querySelector('[data-main-view-title]')
    this.viewContent = this.container.querySelector('[data-main-view-content]')
    this.state = state || undefined
    this.render()
  }

  render() {
    // this.container.insertAdjacentHTML('afterbegin', '<p><small>Main View Component Begin</small></p>')

    this.viewTitle.innerHTML = 'render(), but no target initialized'
    this.viewContent.innerHTML = ''
    console.log(this.state.target.pathname)

    switch (this.state.target.pathname) {
      case '/':
        this.viewTitle.innerHTML = 'Home'

        const homeContainer = this.viewContent.appendChild(document.createElement('div'))
        homeContainer.dataset.section = 'home'
        new Home(homeContainer, { displayRecords: true })
        break
      case '/records':
        // this.container.innerHTML = ''
        this.viewTitle.innerHTML = 'Records'
        const recordsListContainer = this.viewContent.appendChild(document.createElement('div'))
        new RecordsList(recordsListContainer)

        break

      default:
        break
    }
  }

  addEventListeners() {}

  constructor(container, state) {
    this.init(container, state)
  }
}
