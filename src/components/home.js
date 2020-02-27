import RecordsList from './records-list.js'

export default class Home {
  set state(state) {
    // console.log('HOME set state', state)
    this.stateValue = state
    this.render()
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container
    this.state = state || undefined

    // this.render()
  }

  render() {
    console.log('HOME render() ', this.state)

    this.container.innerHTML = `
      <h1>Home</h1>

    `

    if (this.state.displayRecords) {
      var recordsListContainer = document.createElement('section')
      var recordsList = new RecordsList(recordsListContainer)
      this.container.appendChild(recordsListContainer)
    }

    this.addEventListeners()
  }

  addEventListeners() {}

  constructor(container, state) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      // console.log('constructur called of subComp', container)
      this.ref = Math.random()
      Home.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container, state)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return Home.refs[container.dataset.ref]
    }
  }
}

Home.refs = {}
