import BaseComponent from './BaseComponent.js'
import Calendar from './Calendar.js'
import Utils, { events, isCurrentMonth } from './../utils.js'
import { Store } from '../store.js'
import CalendarDayView from './CalendarDayView.js'

class Home extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.inputDate = typeof state.inputDate !== 'undefined' ? new Date(state.inputDate) : new Date()

    this.state = state
    this.dayView = new CalendarDayView('div')

    this.content = {
      title: 'Overview'
    }
    console.log(state)
  }
  render() {
    this.container.innerHTML = `
      <style>
        [data-calendar-controls] button {
          touch-action: manipulation;
        }
        [data-date-selected] {
          background: green;
        }
      </style>
      
      <div data-calendar-controls>
        <button data-month-decrease>prev</button>
        <button data-month-increase>next</button>
        <button data-month-reset>today</button>
      </div>

    `

    this.calendar = new Calendar('div', {
      inputDate: this.inputDate,
      records: this.getRecordsOfMonth(this.inputDate) || []
    })
    this.container.appendChild(this.calendar.container)

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
    events.on('select-date', data => {
      const dateItems = document.querySelectorAll('.date-item')
      const date = data.date

      // unselect current selected day
      dateItems.forEach(el => delete el.dataset.dateSelected)
      // clear day view
      this.dayView.container.remove()

      // find dateToBeSelected
      const dateToBeSelected = Array.from(dateItems).find(dateItem => {
        return dateItem.dataset.dateString == Utils.getTimeZoneAwareIsoString(date)
      })

      dateToBeSelected.dataset.dateSelected = ''

      // find records of date
      // ! Move To Store
      const recordsOfDate = Store.get('records')
        ? Store.get('records').filter(record => {
            const dateBegin = new Date(record.begin)
            return (
              dateBegin.getFullYear() == date.getFullYear() &&
              dateBegin.getMonth() == date.getMonth() &&
              dateBegin.getDate() == date.getDate()
            )
          })
        : []

      // display dayview
      if (recordsOfDate.length) {
        const dayView = this.dayView
        dayView.state = { records: recordsOfDate, jobs: this.state.jobs }
        this.container.appendChild(dayView.container)
      }
    })

    this.container.querySelector('[data-calendar-controls]').addEventListener('click', event => {
      this.dayView.container.remove()
      let inputDate = this.calendar.state.inputDate

      // if inputDate = current Month set day to today

      if ('monthDecrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, -1)
        inputDate = isCurrentMonth(inputDate) ? new Date() : inputDate
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.getRecordsOfMonth(inputDate) }
      } else if ('monthIncrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, 1)
        inputDate = isCurrentMonth(inputDate) ? new Date() : inputDate
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.getRecordsOfMonth(inputDate) }
      } else if ('monthReset' in event.target.dataset) {
        inputDate = new Date()
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.getRecordsOfMonth(new Date()) }
      }
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
