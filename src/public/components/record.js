// todo: only import selected utils AND also consider not to abstract away when only used once
import utils from '../utils.js'

export default class Record {
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
    const record = utils.mapRecord(this.state)
    this.rootEl = document.createElement('article')
    this.rootEl.classList.add('records-list-item')
    this.rootEl.dataset.id = record.id
    this.container.appendChild(this.rootEl)
    this.rootEl.innerHTML = Record.markup(record)
    this.addEventListeners()
  }

  static markup(record) {
    const { id, dateBegin, timeBegin, timeEnd, timeElapsed, earned } = record
    return `
        <header class="record-header">
          <h1>SINGLE RECORD</h1>
          <p>id: ${id}</p>
          <h3>${dateBegin}</h3>
        </header>
        <p class="record-body">
          ${timeBegin} - ${timeEnd} |
          <span class="record-time-elapsed">${timeElapsed}</span> |
          ${earned}
        </p>

        <footer class="record-footer">
          <button class="record-edit">Edit</button>
          <button class="record-delete">Delete</button>
        </footer>
        <div class="singleRecordsListItem"></div>
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
