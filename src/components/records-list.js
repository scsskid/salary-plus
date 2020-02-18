import utils from '../utils.js'
import RecordsListItem from './records-list-item.js'
import Generic from './generic.js'

export default class RecordsList {
  set records(records) {
    this.recordsValue = records
    this.render()
  }

  get records() {
    return this.recordsValue
  }

  init(container) {
    this.container = container
    this.render()

    // ? Hier Daten setzen statt in markup()?
  }

  render() {
    this.container.innerHTML = RecordsList.markup(this)
    console.log(this.records)
    if (this.records != undefined /* && this.records */) {
      this.pageElement = this.container.querySelector('.record-header')
      var recordsListItem = new Generic(this.pageElement)
      recordsListItem.title = 'foo'
    }
  }

  static markup({ records }) {
    console.log(records)

    let markup = ``

    if (records) {
      markup += `<ul>`
      records.forEach(record => {
        // var job = state.jobs.filter(function(job) {
        //   return job.id == record.jobId
        // })[0]

        var job = {}
        var timeElapsed = utils.getTimeElapsed(new Date(record.end) - new Date(record.begin))
        var earnedNumber = utils.timeToDecimal(timeElapsed) * job.rate
        var earned = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(earnedNumber)

        markup += `
          <li class="records-list-item" data-id="${record.id}">
            <header class="record-header">
              <h3>${utils.formatDate.nice(record.begin)}</h3>
            </header>
            <p class="record-body">
              ${utils.formatTime(record.begin)} - ${utils.formatTime(record.end)} |
              <span class="record-time-elapsed">${timeElapsed}</span> |
              ${earned}
            </p>
            
            <footer class="record-footer">
              <button class="record-edit">Edit</button>
              <button class="record-delete">Delete</button>
            </footer>
          </li>
        `
      })
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
