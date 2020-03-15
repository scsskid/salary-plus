import BaseComponent from './BaseComponent.js'
import Calendar from './Calendar.js'
import Utils, { events } from './../utils.js'
import { Store } from '../store.js'
import CalendarDayView from './CalendarDayView.js'

class Home extends BaseComponent {
  init(tag, state) {
    const inputDate = new Date()

    this.container = document.createElement(tag)
    this.state = { ...state, calendar: { inputDate: inputDate, records: this.getRecordsOfMonth(inputDate) } }

    this.dayView = new CalendarDayView('div')

    this.content = {
      title: 'Overview'
    }
  }
  render() {
    console.log(this.state)

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

    this.calendar = new Calendar('div', this.state.calendar)
    this.container.appendChild(this.calendar.container)

    this.addEventListeners()

    // console.log(getRecordsOfMonth())
  }

  getRecordsOfMonth(date = new Date()) {
    return Store.get('records').filter(record => {
      return new Date(record.begin).getMonth() == date.getMonth()
    })
  }

  addEventListeners() {
    events.on('select-date', data => {
      console.log('on:select-date')
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
      const recordsOfDate = Store.get('records').filter(record => {
        const dateBegin = new Date(record.begin)
        return dateBegin.getFullYear() == date.getFullYear() && dateBegin.getMonth() == date.getMonth() && dateBegin.getDate() == date.getDate()
      })

      // display dayview
      if (recordsOfDate.length) {
        const dayView = this.dayView
        dayView.state = { records: recordsOfDate }
        this.container.appendChild(dayView.container)
        console.log(recordsOfDate)
      }
    })

    this.container.querySelector('[data-calendar-controls]').addEventListener('click', event => {
      this.dayView.container.remove()
      let inputDate = this.calendar.state.inputDate

      if ('monthDecrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, -1)
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.getRecordsOfMonth(inputDate) }
      } else if ('monthIncrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, 1)
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.getRecordsOfMonth(inputDate) }
      } else if ('monthReset' in event.target.dataset) {
        inputDate = new Date()
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.getRecordsOfMonth() }
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
