import BaseComponent from './BaseComponent.js'
import Calendar from './Calendar.js'
import { dispatchEvent, events } from './../utils.js'
import { Store } from '../store.js'

class Home extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.content = {
      title: 'Overview'
    }
  }
  render() {
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
      <section data-home-calendar></section>
    `
    // this.calendar = new Calendar(this.container.querySelector('[data-home-calendar]'), { inputDate: '1999-12' })
    this.calendar = new Calendar('div', { inputDate: new Date(), records: recordsOfMonth() })
    this.container.appendChild(this.calendar.container)

    this.addEventListeners()

    function recordsOfMonth(date = new Date()) {
      return Store.get('records').filter(record => {
        return new Date(record.begin).getMonth() == date.getMonth()
      })
    }

    // console.log(recordsOfMonth())
  }

  addEventListeners() {
    this.container.querySelector('[data-calendar-controls]').addEventListener('click', event => {
      let inputDate = this.calendar.state.inputDate

      if ('monthDecrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, -1)
        this.calendar.state = { ...this.calendar.state, inputDate }
      } else if ('monthIncrease' in event.target.dataset) {
        inputDate = changeMonth(inputDate, 1)
        this.calendar.state = { ...this.calendar.state, inputDate }
      } else if ('monthReset' in event.target.dataset) {
        inputDate = new Date()
        this.calendar.state = { ...this.calendar.state, inputDate }
      }
    })

    this.container.addEventListener('click', event => {
      const date = event.target.dataset.dateString
      if (date) {
        console.log(date)
        // Get Records which begin-date = date
        console.log(Store.get('records'))
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
