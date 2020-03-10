import { routeDataSetHref } from '../utils.js.js'

export default class ButtonRecordNew {
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
    const markup = `
      <button data-href="${window.location.origin}/records/new" data-button-record-new>Add New Record</button>
    `
    this.container.insertAdjacentHTML('beforeend', markup)
    this.container.querySelector('[data-button-record-new]').addEventListener('click', routeDataSetHref)
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
