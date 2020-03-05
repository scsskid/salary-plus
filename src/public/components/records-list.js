import RecordsListItem from './records-list-item.js'
import sampleData from '../data/sample-data.js'
// import Store from './store.js'
// const sampleData = {}

var { jobs } = sampleData

export default class RecordsList {
  set state(state) {
    this.stateValue = state
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
    // console.log('RecordsList render()', this.state.records)
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
        this.recordsListItem = new RecordsListItem(this.recordsListItemContainer, record)
      })
    }
  }

  static markup(records) {
    return `
      <h2>All Records</h2>
      <div class="records-list"></div>`
  }

  constructor(container) {
    this.init(container)
  }
}
