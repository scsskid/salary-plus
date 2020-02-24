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
    var records = this.state.records.map(this.reMapRecord)
    this.container.innerHTML = RecordsList.markup(records)
    this.buttonDeleteRecord = this.container.querySelectorAll('.record-delete')
    this.addEventListeners()

    // Sub Component

    this.recordsListItemDom = this.container.querySelector('.singleRecordsListItem')
    this.recordsListItem = new RecordsListItem(this.recordsListItemDom)
    this.recordsListItem.state = 'fooState from Parent, Props Down'
    // this.recordsListItemComponent =

    // if (this.state.records != undefined /* && this.records */) {
    //   this.pageElement = this.container.querySelector('.record-header')
    //   var recordsListItem = new Generic(this.pageElement)
    //   recordsListItem.title = 'foo'
    // }
  }

  static markup(records) {
    var markup = ``

    if (records.length) {
      markup += `<ul class="records-list">`
      records.forEach(record => {
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
            <div class="singleRecordsListItem" />
          </li>
        `
      })
      markup += `</ul>`
    } else {
      markup = 'no data'
    }

    return markup
  }

  addEventListeners() {
    this.buttonDeleteRecord.forEach(button => {
      button.addEventListener('click', () => {
        console.log('clicked', button.closest('li').dataset.id)
        this.state.records = this.state.records.filter(record => {
          return record.id != button.closest('li').dataset.id
        })

        this.render()
      })
    })
  }

  reMapRecord(record) {
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
