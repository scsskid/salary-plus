import BaseComponent from './BaseComponent.js'
import { dispatchEvent } from './../utils.js'
class Calendar extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
  }
  render() {
    this.container.innerHTML = '...Settings'
  }

  constructor(container) {
    super(container)
  }
}

export default Calendar
