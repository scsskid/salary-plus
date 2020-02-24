import utils from '../utils.js'
import RecordsListItem from './records-list-item.js'
import sampleData from './../data/sample-data.js'

var { jobs } = sampleData

export default class RecordsList {
  set state(state) {
    this.stateValue = state
    this.render()
  }

  get state() {
    return this.stateValue
  }

  init(container) {
    this.container = container
  }

  render() {
    var records = this.state.records
    this.container.innerHTML = RecordsList.markup(records)

    // Sub Component
    this.recordsListItemContainer = this.container.querySelector('.records-list')
    this.state.records.forEach(record => {
      this.recordsListItem = new RecordsListItem(this.recordsListItemContainer)
      this.recordsListItem.state = record
    })

    // Listen for Custom Event from Child
    document.addEventListener('record-delete', event => {
      let stateToMerge = {
        records: this.state.records.filter(record => record.id != event.detail.id)
      }
      this.state = { ...this.state, ...stateToMerge }
    })
  }

  static markup(records) {
    let markup = ''

    if (records.length) {
      markup = `<ul class="records-list"></ul>`
    } else {
      markup = '<p>no data</p>'
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
