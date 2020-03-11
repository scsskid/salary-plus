import BaseComponent from './BaseComponent.js'
import Calendar from './Calendar.js'
import { dispatchEvent } from './../utils.js'

class Home extends BaseComponent {
  init(container, state) {
    this.container = container
    this.state = state
  }

  render() {
    this.container.innerHTML = `
      <div data-calendar-controls>
        <button data-month-decrease>prev</button>
        <button data-month-increase>next</button>
      </div>
      <section data-home-calendar></section>
    `
    this.calendar = new Calendar(this.container.querySelector('[data-home-calendar]'))
    // this.calendar = new Calendar(this.container.querySelector('[data-home-calendar]'))
    dispatchEvent('render', this.container, { title: 'Overview' })
    this.addEventListeners()
  }

  addEventListeners() {
    this.container.querySelector('[data-calendar-controls]').addEventListener('click', event => {
      if ('monthDecrease' in event.target.dataset) {
        console.log('decrease')
        this.state = { ...this.state, inputDate: '1888-01' }
      } else if ('monthIncrease' in event.target.dataset) {
        console.log('increase/ next')
      }
    })
  }

  constructor(container, state) {
    super(container, state)
  }
}

export default Home
