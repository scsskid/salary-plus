import BaseComponent from './BaseComponent.js'
import { events } from './../utils.js'

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
        markup += `
          <div data-day-view-el data-record-id="${record.id}">
            ${new Date(record.begin).toLocaleTimeString()}<br>
            ${new Date(record.end).toLocaleTimeString()}
            <hr>
          </div>
        `
      })
    }

    this.container.insertAdjacentHTML('beforeend', markup)
    this.addEventListeners()
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
