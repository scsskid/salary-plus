import state from './../data/sample-data.js'
import RecordsList from './records-list.js'

export default class Home {
  set state(state) {
    // console.log('HOME set state', state)
    this.stateValue = state
    this.render()
    // if (state) {
    //   this.render()
    // }
  }

  get state() {
    return this.stateValue
  }

  init(container) {
    this.container = container
    this.state = undefined
    this.render()
    this.addEventListeners()
  }

  render() {
    // console.log('HOME render() ', this.state)
    this.container.innerHTML = `
      <h1>Welcome Home</h1>
      <button data-init-state>Set State with sampleData</button>
      <button data-save-state>Save State to localStorage</button>
      
    `

    this.addEventListeners()

    if (this.state != undefined && 'records' in this.state) {
      var recordsListContainer = document.createElement('section')
      var recordsList = new RecordsList(recordsListContainer)
      recordsList.state = this.state
      this.container.appendChild(recordsListContainer)
    } else {
      // push to logFile
      // console.log('state undefined or no records prop in state')
    }
  }

  static markup(record) {
    return `empty markup`
  }

  addEventListeners() {
    this.container.querySelector('[data-init-state]').addEventListener('click', event => {
      this.container.dispatchEvent(
        new CustomEvent('seed-state', {
          bubbles: true
        })
      )
    })
    this.container.querySelector('[data-save-state]').addEventListener('click', event => {
      this.container.dispatchEvent(
        new CustomEvent('save-state', {
          bubbles: true
        })
      )
    })
  }

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
