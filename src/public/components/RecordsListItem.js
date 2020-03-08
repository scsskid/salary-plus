// todo: only import selected utils AND also consider not to abstract away when only used once
import utils, { routeDataSetHref } from '../utils.js'
import RecordTools from './RecordTools.js'
export default class RecordsListItem {
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
    // record.recordEditButton = new RecordEditButton(document.querySelector('.record-footer'), this.state.id).render()

    this.rootEl = document.createElement('article')
    this.rootEl.classList.add('records-list-item')
    this.rootEl.dataset.id = record.id
    this.container.appendChild(this.rootEl)
    this.rootEl.innerHTML = RecordsListItem.markup(record)
    new RecordTools(this.rootEl.querySelector('.record-footer'), { id: this.state.id })

    this.addEventListeners()
  }

  static markup(record) {
    const { id, dateBegin, timeBegin, timeEnd, timeElapsed, earned, jobId } = record
    return `
        <header class="record-header">
          <p>id: ${id} </p>
          <h3><a href="/records/${id}" data-href="/records/${id}">${dateBegin}</a></h3>
        </header>
        <p class="record-body">
          ${timeBegin} - ${timeEnd} |
          <span class="record-time-elapsed">${timeElapsed}</span> |
          ${earned}
          <br>jobId: ${jobId}
        </p>
        <footer class="record-footer" />
    `
  }

  addEventListeners() {
    // Click on Link to Single Record
    this.rootEl.addEventListener('click', routeDataSetHref)
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
