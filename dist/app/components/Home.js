import Calendar from './Calendar.js'
import { dispatchEvent } from './../utils.js'

export default class Home {
  set state(state) {
    this.stateValue = state
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container
    this.state = state
  }

  render() {
    this.container.innerHTML = `
      <section data-home-calendar></section>
    `

    new Calendar(this.container.querySelector('[data-home-calendar]')).render()

    dispatchEvent('render', this.container, { title: 'Overview' })
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
