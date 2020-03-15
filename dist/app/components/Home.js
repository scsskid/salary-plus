import BaseComponent from './BaseComponent.js'
import Calendar from './Calendar.js'
import { events } from './../utils.js'
import { Store } from '../store.js'
import CalendarDayView from './CalendarDayView.js'

class Home extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.content = {
      title: 'Overview'
    }
    this.dayView = new CalendarDayView('div')
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
    // this.calendar = new Calendar(this.container.querySelector('[data-home-calendar]'), { inputDate: '1999-12' })
    this.calendar = new Calendar('div', { inputDate: new Date(), records: this.recordsOfMonth() })
    this.container.appendChild(this.calendar.container)

    this.addEventListeners()

    // console.log(recordsOfMonth())
  }

  recordsOfMonth(date = new Date()) {
    return Store.get('records').filter(record => {
      return new Date(record.begin).getMonth() == date.getMonth()
    })
  }

  addEventListeners() {
    this.container.querySelector('[data-calendar-controls]').addEventListener('click', event => {
      this.dayView.container.remove()
      let inputDate = this.calendar.state.inputDate

      if ('monthDecrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, -1)
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.recordsOfMonth(inputDate) }
      } else if ('monthIncrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, 1)
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.recordsOfMonth(inputDate) }
      } else if ('monthReset' in event.target.dataset) {
        inputDate = new Date()
        this.calendar.state = { ...this.calendar.state, inputDate, records: this.recordsOfMonth() }
      }
    })

    this.container.addEventListener('click', event => {
      const dateString = event.target.dataset.dateString
      const date = new Date(dateString)
      document.querySelectorAll('.date-item').forEach(el => delete el.dataset.dateSelected)
      this.dayView.container.remove()
      if (dateString) {
        event.target.dataset.dateSelected = ''
        const recordsOfDate = Store.get('records').filter(record => {
          const dateBegin = new Date(record.begin)
          return dateBegin.getFullYear() == date.getFullYear() && dateBegin.getMonth() == date.getMonth() && dateBegin.getDate() == date.getDate()
        })
        if (recordsOfDate.length) {
          const dayView = this.dayView
          dayView.state = { records: recordsOfDate }
          console.log(dayView)

          this.container.appendChild(dayView.container)
          console.log(recordsOfDate)
        }
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
