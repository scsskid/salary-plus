import BaseComponent from './base-component.js'
import RecordsList from './records-list.js'
import ButtonRecordNew from './record-button-new.js'
import Calendar from './calendar.js'

export default class Home extends BaseComponent {
  render() {
    this.container.innerHTML = `
    <header style="margin-bottom: 1rem" data-home-header />
    <section data-home-main />
    `

    new ButtonRecordNew(this.container.querySelector('[data-home-header]'))
    // new Calendar(this.container.querySelector('[data-home-main]'))

    // New Records List
    if (this.state.displayRecords) {
      var recordsListContainer = document.createElement('section')
      new RecordsList(recordsListContainer)
      this.container.appendChild(recordsListContainer)
    }

    this.addEventListeners()
  }

  addEventListeners() {}

  constructor(container, state) {
    super(container, state)
  }
}
