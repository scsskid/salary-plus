import utils from '../utils.js'
import RecordsListItem from './records-list-item.js'
import sampleData from './../data/sample-data.js'

var { jobs } = sampleData

export default class RecordsList {
  set state(state) {
    this.stateValue = state
    // console.log('Setting state')

    this.render()
  }

  get state() {
    // console.log('Getting state')
    return this.stateValue
  }

  init(container) {
    this.container = container
  }

  render() {
    var records = this.state.records
    this.container.innerHTML = RecordsList.markup(records)

    // this.buttonDeleteRecord = this.container.querySelectorAll('.record-delete')
    // this.addEventListeners()

    // Sub Component

    this.recordsListItemContainer = this.container.querySelector('.records-list')

    this.state.records.forEach(record => {
      this.recordsListItem = new RecordsListItem(this.recordsListItemContainer)
      this.recordsListItem.state = record
    })
  }

  static markup(records) {
    var markup = ``

    if (records.length) {
      markup += `<ul class="records-list">`

      markup += `</ul>`
    } else {
      markup = 'no data'
    }

    return markup
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      this.ref = Math.random()
      RecordsList.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return RecordsList.refs[container.dataset.ref]
    }
  }
}

RecordsList.refs = {}
