import BaseComponent from './BaseComponent.js'
import Calendar from './Calendar.js'
import Utils, { events, isCurrentMonth } from './../utils.js'
import Store from '../store.js'
import CalendarDayView from './CalendarDayView.js'
import proxyState from '../lib/Proxy.js'

class Home extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.inputDate = proxyState.inputDate
    this.state = state
  }

  render() {
    // this.inputDate = proxyState.inputDate

    this.container.innerHTML = `

      <style>
        [data-calendar-controls] button {
          touch-action: manipulation;
        }
      </style>
      
      <div data-calendar-controls>
        <button data-month-decrease>prev</button>
        <button data-month-increase>next</button>
        <button data-month-reset>today</button>
      </div>

    `
    this.addEventListeners()
  }

  // ! Move To Store
  getRecordsOfMonth(date) {
    if (this.state.records) {
      return this.state.records.filter(record => {
        return new Date(record.begin).getMonth() == date.getMonth()
      })
    } else {
      return false
    }
  }

  addEventListeners() {
    this.container.querySelector('[data-calendar-controls]').addEventListener('click', event => {
      events.publish('calendar-controls-action', {})
      let inputDate = this.inputDate

      if ('monthDecrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, -1)
        inputDate = isCurrentMonth(inputDate) ? new Date() : inputDate
      } else if ('monthIncrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, 1)
        inputDate = isCurrentMonth(inputDate) ? new Date() : inputDate
      } else if ('monthReset' in event.target.dataset) {
        inputDate = new Date()
      }

      events.publish('change inputDate', { inputDate })
    })
  }

  constructor(tag, state) {
    super(tag, state)
  }
}

export default Home

function changeMonth(date, num) {
  var newDate = new Date(date.setMonth(date.getMonth() + num))
  newDate.setDate(1)
  return newDate
}
