// todo: only import selected utils AND also consider not to abstract away when only used once
import utils from '../utils.js'

export default class RecordForm {
  set state(state) {
    this.stateValue = state
    this.render()
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container
    this.state = state
  }

  render() {
    console.log('redner')
    this.container.innerHTML = RecordForm.markup(this.state)
  }

  static markup(record) {
    const { id, dateBegin, timeBegin, timeEnd, timeElapsed, earned } = record
    return `
      form
    `
  }

  addEventListeners() {
    this.rootEl.querySelector('.record-delete').addEventListener('click', event => {
      const id = event.target.closest('.records-list-item').dataset.id
      const recordDeleteEvent = new CustomEvent('record-delete', {
        bubbles: true,
        detail: { id }
      })
      this.rootEl.dispatchEvent(recordDeleteEvent)
    })
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
