import BaseComponent from './BaseComponent.js'
import { dispatchEvent } from './../utils.js'
class Calendar extends BaseComponent {
  render() {
    this.container.innerHTML = '...Settings'

    dispatchEvent('render', this.container, { title: 'Settings' })
  }

  constructor(container) {
    super(container)
  }
}

export default Calendar
