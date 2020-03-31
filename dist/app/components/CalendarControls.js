import BaseComponent from './BaseComponent.js'
import proxyState from '../lib/Proxy.js'
import { events } from './../utils.js'
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
      const operation = event.target.dataset.dateOperation
      events.publish('operateDate', { operation })
    })
  }

  constructor(tag, state) {
    super(tag, state)
  }
}

export default Home
