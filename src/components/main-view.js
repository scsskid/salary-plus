import state from './../data/sample-data.js'
import Home from './home.js'
import RecordsList from './records-list.js'

export default class MainView {
  set state(state) {
    // console.log('mainView set state', state)
    this.stateValue = state
    if (state) {
      this.render()
    }
  }

  get state() {
    return this.stateValue
  }

  init(container) {
    this.container = container
    this.state = undefined
  }

  render() {
    this.container.innerHTML = ``

    setTimeout(() => {
      switch (this.state.target) {
        case 'home':
          this.container.innerHTML = ''
          const homeContainer = this.container.appendChild(document.createElement('div'))
          homeContainer.dataset.section = 'home'
          const home = new Home(homeContainer)
          home.state = this.state
          break
        case 'records':
          this.container.innerHTML = ''
          const recordsListContainer = this.container.appendChild(document.createElement('div'))
          new RecordsList(recordsListContainer)

          break

        default:
          break
      }
    }, 200)

    // document.addEventListener('navigate', navigationHandler.bind(this))
  }

  addEventListeners() {}

  constructor(container) {
    this.init(container)
  }
}

function navigationHandler(event) {
  this.navTarget = event.srcElement.dataset.navTarget
  switch (this.navTarget) {
    case 'home':
      this.container.innerHTML = ''
      const homeContainer = this.container.appendChild(document.createElement('div'))
      new Home(homeContainer)
      break
    case 'records':
      this.container.innerHTML = ''
      const recordsListContainer = this.container.appendChild(document.createElement('div'))
      new RecordsList(recordsListContainer)

      break

    default:
      break
  }
}
