import RecordsListItem from './RecordsListItem.js'
import BaseComponent from './BaseComponent.js'
import { Store } from '../store.js'
import { dispatchEvent } from './../utils.js'

class RecordsList extends BaseComponent {
  init(container) {
    this.container = container
    this.state = Store.get('app') ? { records: Store.get('records'), jobs: Store.get('jobs') } : undefined /* || { records: sampleData.records, jobs: sampleData.jobs } */
  }

  render() {
    // console.log('RecordsList render()', this.state.records)
    if (!this.state || !this.state.records) {
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

    dispatchEvent('render', this.container, { title: 'List' })
  }

  static markup(records) {
    return `
      <h2>All Records</h2>
      <div class="records-list"></div>`
  }

  constructor(container) {
    super(container)
  }
}

export default RecordsList
