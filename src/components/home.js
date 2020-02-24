import state from './../data/sample-data.js'
import RecordsList from './records-list.js'

export default class Home {
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
    // this.state = state

    this.render()
  }

  render() {
    console.log('this.state: ', this.state)

    this.container.innerHTML = `
      <h1>Welcome Home</h1>
      <button data-init-state>Set State with sampleData</button>
    `

    this.container.querySelector('[data-init-state]').addEventListener('click', event => {
      this.state = state
      const recordsListContainer = document.createElement('div')
      this.container.appendChild(recordsListContainer)
      var recordsList = new RecordsList(recordsListContainer)
      recordsList.state = state
    })
  }

  static markup(record) {
    return `empty markup`
  }

  addEventListeners() {}

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      // console.log('constructur called of subComp', container)
      this.ref = Math.random()
      Home.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return Home.refs[container.dataset.ref]
    }
  }
}

Home.refs = {}
