import state from './../data/sample-data.js'
import Home from './home.js'
import RecordsList from './records-list.js'

export default class MainView {
  set state(state) {
    this.stateValue = state
    this.render()
    // console.log('setting state')
  }

  get state() {
    // console.log('getting state')
    return this.stateValue
  }

  init(container) {
    this.container = container

    this.render()
  }

  render() {
    this.container.innerHTML = `inside mainView Component`
    document.addEventListener('navigate', event => {
      this.navTarget = event.srcElement.dataset.navTarget
      console.log(this.navTarget)
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
    })
  }

  addEventListeners() {}

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      // console.log('constructur called of subComp', container)
      this.ref = Math.random()
      MainView.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return MainView.refs[container.dataset.ref]
    }
  }
}

MainView.refs = {}
