import { events } from './../utils.js'

export default class RecordTools {
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
      <button class="record-edit" data-href="${window.location.origin}/records/${this.state.id}/edit">Edit</button>
      <button class="record-delete">Delete</button>
    `
    this.container.insertAdjacentHTML('beforeend', markup)
    this.addEventListeners()
  }

  addEventListeners() {
    // Click on Link to Single Record
    this.container.querySelector('.record-delete').addEventListener('click', handleDeleteButtonClick)
    function handleDeleteButtonClick(event) {
      const listItem = event.target.closest('.records-list-item')
      events.publish('record-delete', { id: listItem.dataset.id, origin: window.location.pathname })
    }
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
