import BaseComponent from './BaseComponent.js'
import proxyState from '../lib/Proxy.js'

class Home extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.inputDate = new Date(proxyState.inputDate.getTime())
    this.state = state
    console.log(typeof proxyState.inputDate)
  }

  render() {
    this.container.innerHTML = `
      <style>
        [data-calendar-controls] button { touch-action: manipulation; }
      </style>
      
      <div data-calendar-controls>
        <button data-date-operation="month-decrease">prev</button>
        <button data-date-operation="month-increase">next</button>
        <button data-date-operation="today">today</button>
      </div>

    `
    this.addEventListeners()
  }

  addEventListeners() {
    this.container.querySelector('[data-calendar-controls]').addEventListener('click', event => {
      let targetDate = new Date(proxyState.inputDate.getTime())
      let operation = event.target.dataset.dateOperation
      proxyState.inputDate = operateDate(operation, targetDate)
    })
  }

  constructor(tag, state) {
    super(tag, state)
  }
}

export default Home

function changeMonth(date, num) {
  var now = new Date()
  var newDate = new Date(date.getTime())
  newDate.setMonth(date.getMonth() + num, 1)

  if (now.getMonth() == newDate.getMonth() && now.getFullYear() == newDate.getFullYear()) {
    return now
  } else {
    return newDate
  }
}

function operateDate(operation, targetDate) {
  if ('month-decrease' == operation) {
    return changeMonth(targetDate, -1)
  } else if ('month-increase' == operation) {
    return changeMonth(targetDate, 1)
  } else if ('today' == operation) {
    return new Date()
  }
}
