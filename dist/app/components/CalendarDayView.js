import BaseComponent from './BaseComponent.js'

export default class CalendarDayView extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
  }
  render() {
    console.error('Day View')
  }
  constructor(tag, state) {
    this.init(tag, state)
  }
}
