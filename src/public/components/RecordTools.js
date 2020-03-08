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
      <button class="record-edit" data-href="${window.location.origin}/records/${this.state.id}/edit">Edit Compo</button>
      <button class="record-delete">0 Delete</button>
    `
    this.container.insertAdjacentHTML('beforeend', markup)
    this.addEventListeners()
  }

  addEventListeners() {
    // Click on Link to Single Record
    this.container.querySelector('.record-delete').addEventListener('click', handleClickDeleteRecord)

    function handleClickDeleteRecord(event) {
      const listItem = event.target.closest('.records-list-item')
      const recordDeleteEvent = new CustomEvent('record-delete', {
        bubbles: true,
        detail: { id: listItem.dataset.id }
      })
      listItem.dispatchEvent(recordDeleteEvent)
    }
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
