// import sampleData from './../data/sample-data.js'
// var { jobs } = sampleData

var { jobs } = JSON.parse(localStorage.getItem('appData'))

// todo: only import selected utils AND also consider not to abstract away when only used once
import utils from '../utils.js'

export default class RecordsListItem {
  set state(state) {
    this.stateValue = state
    this.render()
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container
    this.state = state
  }

  render() {
    const record = this.mapRecord(this.state)
    this.rootEl = document.createElement('article')
    this.rootEl.classList.add('records-list-item')
    this.rootEl.dataset.id = record.id
    this.container.appendChild(this.rootEl)
    this.rootEl.innerHTML = RecordsListItem.markup(record)
    this.addEventListeners()
  }

  static markup(record) {
    const { id, dateBegin, timeBegin, timeEnd, timeElapsed, earned } = record
    return `
        <header class="record-header">
          <p>id: ${id}</p>
          <h3>${dateBegin}</h3>
        </header>
        <p class="record-body">
          ${timeBegin} - ${timeEnd} |
          <span class="record-time-elapsed">${timeElapsed}</span> |
          ${earned}
        </p>

        <footer class="record-footer">
          <button class="record-edit">Edit</button>
          <button class="record-delete">Delete</button>
        </footer>
        <div class="singleRecordsListItem"></div>
    `
  }

  addEventListeners() {
    this.rootEl.querySelector('.record-delete').addEventListener('click', event => {
      const id = event.target.closest('.records-list-item').dataset.id
      const recordDeleteEvent = new CustomEvent('record-delete', {
        bubbles: true,
        detail: { id }
      })
      this.rootEl.dispatchEvent(recordDeleteEvent)
    })
  }

  mapRecord(record) {
    var job = jobs.find(job => {
      return job.id == record.jobId
    })
    var timeElapsed = utils.getTimeElapsed(new Date(record.end) - new Date(record.begin))
    var earnedNumber = utils.timeToDecimal(timeElapsed) * job.rate
    var earned = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(earnedNumber)

    return {
      id: record.id,
      jobId: record.jobId,
      dateBegin: utils.formatDate.nice(record.begin),
      timeBegin: utils.formatTime(record.begin),
      timeEnd: utils.formatTime(record.end),
      end: record.end,
      timeElapsed,
      earned
    }
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
