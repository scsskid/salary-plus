import BaseComponent from './BaseComponent.js'
import Utils, { events } from './../utils.js'

export default class CalendarDayView extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.container.dataset.module = 'calendar-day-view'
    this.state = state
    // this.dayViewEls =
  }
  render() {
    this.container.innerHTML = ''
    let markup = ``

    if (typeof this.state.records !== 'undefined') {
      this.state.records.forEach(record => {
        const jobName = this.state.jobs.find(job => job.id == record.jobId).name
        const earned = this.salaryOfShift(record)
        const bonus = new Intl.NumberFormat([], { style: 'currency', currency: 'EUR' }).format(record.bonus)
        markup += `
          <div class="day-view-el" data-day-view-el data-record-id="${record.id}">
            <div class="day-view-el-time">
              <span>${new Date(record.begin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span style="opacity: .5">${new Date(record.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div class="day-view-el-content">
              Job: ${jobName}<br>
              Earned: ${earned} + ${bonus}
            </div>
            
          </div>
        `
      })
    }

    this.container.insertAdjacentHTML('beforeend', markup)
    this.addEventListeners()
  }

  salaryOfShift(record) {
    var timeElapsed = Utils.getTimeElapsed(new Date(record.end) - new Date(record.begin))
    var earnedNumber = Utils.timeToDecimal(timeElapsed) * record.rate
    var earned = new Intl.NumberFormat([], { style: 'currency', currency: 'EUR' }).format(earnedNumber)
    return earned
  }

  addEventListeners() {
    this.container.querySelectorAll('[data-day-view-el]').forEach(el => {
      el.addEventListener('click', event => {
        events.publish('navigate', { pathname: `records/${el.closest('[data-day-view-el]').dataset.recordId}` })
      })
    })
  }

  constructor(tag, state) {
    super(tag, state)
  }
}
