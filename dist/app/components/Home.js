import RecordsList from './RecordsList.js'
import ButtonRecordNew from './ButtonNewRecord.js'

import { dispatchEvent } from './../utils.js'

export default class Home {
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
    this.container.innerHTML = `
    
    <header style="margin-bottom: 1rem" data-home-header />
    <section data-home-main>

    </section>
    `

    new ButtonRecordNew(this.container.querySelector('[data-home-header]'))
    // new Calendar(this.container.querySelector('[data-home-main]'))

    // New Records List
    if (this.state.displayRecords) {
      var recordsListContainer = document.createElement('section')
      new RecordsList(recordsListContainer, {}).render()
      this.container.appendChild(recordsListContainer)
    }

    this.addEventListeners()

    dispatchEvent('render', this.container, { title: 'Overview' })
  }

  addEventListeners() {}

  constructor(container, state) {
    this.init(container, state)
  }
}
