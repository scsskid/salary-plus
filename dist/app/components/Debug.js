import BaseComponent from './BaseComponent.js'
import Utils, { events } from './../utils.js'
// import MajaRecords from './../data/records.js'
import { Store } from './../store.js'

class Debug extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.content = {
      title: 'Debug'
    }
    // this.importSalaryBookRecords()
  }

  importSalaryBookRecords() {
    let aiid = 0
    const map = MajaRecords.map((record, i) => {
      // console.log(record)
      const dateFragments = record['Datum'].split('.')
      const dateBegin = `${dateFragments[2]}-${dateFragments[1]}-${dateFragments[0]}`
      // console.log(record['Datum'], new Date(dateBegin))

      record = {
        id: ++aiid,
        jobId: 1,
        dateBegin: dateBegin,
        timeBegin: record['Beginn'],
        timeEnd: record['Ende'],
        bonus: record['Zusätzl. Bezahlung'].split(' ')[0].replace(',', '.'),
        note: record['Notizen'],
        rate: record['Stundenlohn'].split(' ')[0].replace(',', '.'),
        rateInterval: 'hourly'
      }

      record = Utils.processRecordFormData(record)
      return { ...record }
    })

    // console.log(map)

    // Store.set('records', map)

    map.forEach(el => {
      for (const prop in el) {
        // console.log(prop, el[prop])
      }
    })
  }

  render() {
    this.container.innerHTML = ''

    this.container.insertAdjacentHTML('beforeend', `<p><button data-save-sample-data>Insert SampleData</button></p>`)
    this.container.insertAdjacentHTML('beforeend', `<p><button data-clear-storage>Clear localStorage</button></p>`)

    this.addEventListeners()

    // events.publish('update-view-title', { title: Debug.common.title })
  }

  addEventListeners() {
    this.container.addEventListener('click', event => {
      if ('saveSampleData' in event.target.dataset) {
        events.publish('save-sample-data')
      } else if ('clearStorage' in event.target.dataset) {
        events.publish('clear-storage')
      }
    })
  }

  constructor(container) {
    super(container)
  }
}

export default Debug
