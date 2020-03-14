import RecordsListItem from './RecordsListItem.js'
import BaseComponent from './BaseComponent.js'
import { Store } from '../store.js'
import { dispatchEvent, events } from './../utils.js'

class RecordsList extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = Store.get('app') ? { records: Store.get('records'), jobs: Store.get('jobs') } : undefined /* || { records: sampleData.records, jobs: sampleData.jobs } */
    this.meta = {
      title: 'List'
    }
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

    // dispatchEvent('render', window, { title: 'List of all Records' })
    // events.dispatch('update-title', { title: 'List Of ...' })
    // events.events['hollyyyy-cow'] = ['func1', 'func2']

    // console.log(events)
  }

  static markup(records) {
    return `
      <h2>All Records</h2>
      <div class="records-list"></div>`
  }

  constructor(container, tag) {
    super(container, tag)
  }
}

export default RecordsList
