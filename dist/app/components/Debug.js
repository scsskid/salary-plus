import RecordsList from './RecordsList.js'

import { dispatchEvent } from './../utils.js'

export default class Debug {
  set state(state) {
    this.stateValue = state
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container
    this.state = state
  }

  render() {
    this.container.innerHTML = ''

    this.container.insertAdjacentHTML('beforeend', `<p><button data-save-sample-data>Insert SampleData</button></p>`)
    this.container.insertAdjacentHTML('beforeend', `<p><button data-clear-storage>Clear localStorage</button></p>`)

    this.addEventListeners()

    dispatchEvent('render', this.container, { title: 'Debug' })
  }

  addEventListeners() {
    this.container.addEventListener('click', event => {
      event.preventDefault()

      if ('saveSampleData' in event.target.dataset) {
        dispatchEvent('save-sample-data', this.container)
      }
      if ('clearStorage' in event.target.dataset) {
        dispatchEvent('clear-storage', this.container)
      }
    })
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
