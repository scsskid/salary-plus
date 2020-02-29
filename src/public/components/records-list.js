import RecordsListItem from './records-list-item.js'
import sampleData from '../data/sample-data.js'
// import Store from './store.js'
// const sampleData = {}

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
    const storedAppData = JSON.parse(localStorage.getItem('appData'))

    this.state = storedAppData ? { records: storedAppData.records, jobs: storedAppData.jobs } : undefined /* || { records: sampleData.records, jobs: sampleData.jobs } */
  }

  render() {
    // console.log('RecordsList render()', this.state)
    if (!this.state || !this.state.records) {
      console.log('RecordsList State undefined')
      this.container.innerHTML = `
        <p>No Data.</p>
      `
    } else {
      var records = this.state.records

      this.container.innerHTML = RecordsList.markup(records)

      // Sub Component
      this.recordsListItemContainer = this.container.querySelector('.records-list')
      this.state.records.forEach(record => {
        this.recordsListItem = new RecordsListItem(this.recordsListItemContainer)
        this.recordsListItem.state = record
      })
    }
  }

  static markup(records) {
    return `
      <h2>All Records</h2>
      <ul class="records-list"></ul>`
  }

  constructor(container) {
    this.init(container)
  }
}
