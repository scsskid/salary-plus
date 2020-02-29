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
    this.addEventListeners()
  }

  addEventListeners() {
    this.container.querySelector('[data-button-record-new]').addEventListener('click', event => {
      const recordAddEvent = new CustomEvent('record-add-new', { bubbles: true })

      if (event.target.dataset.href) {
        const url = new URL(event.target.dataset.href)

        window.history.pushState({}, '', url)
        this.container.dispatchEvent(recordAddEvent)
      }
    })
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
