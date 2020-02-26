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
    const seedSampleButton = `<button data-save-sample-data>Save SampleData to localStorage</button>`
    this.container.innerHTML = `
      <h1>Home</h1>
      <button style="display: none" data-init-state>Set State with sampleData</button>
      ${seedSampleButton}
    `

    if (this.state.displayRecords) {
      var recordsListContainer = document.createElement('section')
      var recordsList = new RecordsList(recordsListContainer)
      this.container.appendChild(recordsListContainer)
    }

    this.addEventListeners()
  }

  addEventListeners() {
    this.container.querySelector('[data-init-state]').addEventListener('click', event => {
      this.container.dispatchEvent(
        new CustomEvent('seed-state', {
          bubbles: true
        })
      )
    })
    this.container.querySelector('[data-save-sample-data]').addEventListener('click', event => {
      this.container.dispatchEvent(
        new CustomEvent('save-sample-data', {
          bubbles: true
        })
      )
    })
  }

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
