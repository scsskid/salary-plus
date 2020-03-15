import BaseComponent from './BaseComponent.js'

export default class CalendarDayView extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.container.dataset.module = 'calendar-day-view'
    this.state = state
  }
  render() {
    this.container.innerHTML = ''
    let markup = ``

    if (typeof this.state.records !== 'undefined') {
      this.state.records.forEach(record => {
        markup += `${new Date(record.begin).toLocaleTimeString()}<br>`
      })
    }

    this.container.insertAdjacentHTML('beforeend', markup)
  }
  constructor(tag, state) {
    super(tag, state)
  }
}
