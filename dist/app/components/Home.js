import BaseComponent from './BaseComponent.js'
import Calendar from './Calendar.js'
import { dispatchEvent } from './../utils.js'

class Home extends BaseComponent {
  render() {
    this.container.dataset.render = 'true'
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
    this.calendar = new Calendar('calendar-tag', {})
    this.container.appendChild(this.calendar.container)
    dispatchEvent('render', this.container, { title: 'Overview' })
    this.addEventListeners()
  }

  addEventListeners() {
    this.container.querySelector('[data-calendar-controls]').addEventListener('click', event => {
      const inputDate = this.calendar.state.inputDate
      if ('monthDecrease' in event.target.dataset) {
        this.calendar.state = { ...this.calendar.state, inputDate: changeMonth(inputDate, -1) }
      } else if ('monthIncrease' in event.target.dataset) {
        this.calendar.state = { ...this.calendar.state, inputDate: changeMonth(inputDate, 1) }
      } else if ('monthReset' in event.target.dataset) {
        this.calendar.state = { ...this.calendar.state, inputDate: new Date() }
      }
    })

    this.container.addEventListener('click', event => {
      console.log(event.target)
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
