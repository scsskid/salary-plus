import { events } from '../utils.js'

export default class BaseComponent {
  set state(state) {
    this.stateValue = state || {}
    this.render()
  }

  get state() {
    return this.stateValue
  }

  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
  }

  connectedCallback() {
    console.warn('No connect() func provided by Component', this.__proto__)
  }

  disconnectCallback() {
    // todo
    this.deleteEventListeners()
  }

  deleteEventListeners() {
    // todo
  }

  refresh() {
    console.error('no refresh specified')
  }

  render() {
    console.error('no render specified')
  }
  constructor(tag, state) {
    this.init(tag, state)
  }
}
