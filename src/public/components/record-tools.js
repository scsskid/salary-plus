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
    this.container.querySelector('.record-edit').addEventListener('click', event => {
      const recordEditEvent = new CustomEvent('record-edit', {
        bubbles: true,
        detail: { id: this.state.id }
      })

      if (event.target.dataset.href) {
        const url = new URL(event.target.dataset.href)

        window.history.pushState({}, '', url)
        this.container.dispatchEvent(recordEditEvent)
      }
    })
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
