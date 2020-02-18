import utils from '../utils.js'
import RecordsListItem from './records-list-item.js'
import Generic from './generic.js'

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
    // this.render()
  }

  render() {
    this.state.records = this.state.records.map(record => {
      var job = this.state.jobs.find(job => {
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
    })

    console.log(this)

    this.container.innerHTML = RecordsList.markup(this)
    // if (this.state.records != undefined /* && this.records */) {
    //   this.pageElement = this.container.querySelector('.record-header')
    //   var recordsListItem = new Generic(this.pageElement)
    //   recordsListItem.title = 'foo'
    // }
  }

  static markup({ state }) {
    // console.log(records)

    let markup = ``

    if (state.records) {
      markup += `<ul>`
      state.records.forEach(record => {
        const { id, dateBegin, timeBegin, timeEnd, timeElapsed, earned } = record
        markup += `
          <li class="records-list-item" data-id="${id}">
            <header class="record-header">
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
