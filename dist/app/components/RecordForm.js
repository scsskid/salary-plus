import BaseComponent from './BaseComponent.js'
// todo: only import selected utils AND also consider not to abstract away when only used once
import Utils, { dispatchEvent, events } from '../utils.js'
import { Store } from '../store.js'
import proxyState from '../lib/Proxy.js'

// todo: eval populateForm() on stateChange ?
/*
! comp state.record is in display format, not db format
! db format belongs only in Store Component
! keep it this way
*/

class RecordForm extends BaseComponent {
  set state(state) {
    this.stateValue = state
  }

  get state() {
    return this.stateValue
  }

  init(tag, state) {
    console.log('Form Init', state)

    this.content = {
      title: 'Form'
    }
    this.container = document.createElement(tag)

    // If no record prop in state, mode is 'new', otherwise 'edit

    this.state =
      { jobs: Store.get('jobs') || [], ...state, ...{ mode: state.recordId != undefined ? 'edit' : 'new' } } || {}

    // Defaults

    this.defaultFormValues = {
      jobId: Store.get('user') ? Store.get('user').settings.defaultJobId : undefined,
      dateBegin: Utils.formatDate.rfc3339(proxyState.inputDate || new Date()),
      timeBegin: '14:00',
      timeEnd: '00:00',
      rate: Store.get('jobs').find(job => job.id == 1).rate,
      bonus: '0.00'
    }

    // set state.record to default if { mode: new }
    let record
    if (this.state.mode == 'new') {
      record = this.defaultFormValues
    } else if (this.state.mode == 'edit') {
      // map data from localstorage to format of form
      record = Utils.mapLocalStorageRecord(Store.getRecord(this.state.recordId), 'form')
    }
    this.state = { ...this.state, ...{ record } }

    this.render()
  }

  connectedCallback() {
    console.log('FORM RE-CONNECTED ')
  }

  render() {
    this.container.innerHTML = RecordForm.markup(this.state)
    this.form = this.container.querySelector('form')
    this.inputDate = this.container.querySelector('#entry-date')
    this.inputBeginTime = this.container.querySelector('#entry-begin-time')
    this.inputEndTime = this.container.querySelector('#entry-end-time')
    this.inputBonus = this.container.querySelector('#entry-bonus')
    this.inputRate = this.container.querySelector('#entry-rate')
    this.inputSickLeave = this.container.querySelector('#entry-sick-leave')

    this.populateForm()
    this.addEventListeners()
  }

  populateForm() {
    if (typeof this.state.record.id != 'undefined') {
      this.form.dataset.id = this.state.record.id
    }

    this.inputDate.value = this.state.record.dateBegin
    this.inputBeginTime.value = this.state.record.timeBegin
    this.inputEndTime.value = this.state.record.timeEnd
    this.inputBonus.value = this.state.record.bonus
    this.inputRate.value = this.state.record.rate
    this.inputSickLeave.checked = this.state.record.sickLeave == 'true' ? 'checked' : ''
  }

  addEventListeners() {
    // Submit
    this.container.addEventListener('submit', event => {
      event.preventDefault()
      const form = event.target
      const formData = {}

      for (var [formElementName, value] of new FormData(form).entries()) {
        formData[formElementName] = value
      }

      // add id from form.dataset
      if (typeof event.target.dataset.id !== 'undefined') {
        formData.id = parseInt(event.target.dataset.id)
      }

      // Dispatch Event /w attached unaltered formData
      events.publish('record-submitted', { formData, origin: window.location.origin })

      // ! trying to reconstruct Form (not working)

      // this.init('div', { record: this.defaultFormValues })
    })
  }

  static markup(state) {
    let jobsOptionsMarkup = ``
    // Fill select element with options
    state.jobs.forEach(job => {
      const selected = state.record.jobId == job.id ? 'selected ' : ''
      jobsOptionsMarkup += `
        <option ${selected}value="${job.id}">#${job.id} ${job.name} (rate: ${job.rate})</option>
        `
    })

    return `
      <section class="edit-record" data-id>
        <h2>${state.mode == 'edit' ? 'Edit' : 'Add New'} Record</h2>
        <form action="">
          <div class="form-el">
            <label for="entry-job">Job</label>
            <select name="jobId" id="entry-job" type="date">
              ${jobsOptionsMarkup.length > 0 ? jobsOptionsMarkup : `<option>!! No Jobs present</option>`}
            </select>
          </div>        
          <div class="form-el">
            <label for="entry-date">Date</label>
            <input name="dateBegin" id="entry-date" type="date">
          </div>
          <div class="form-el">
            <label for="entry-begin-time">Begin Time</label>
            <input name="timeBegin" id="entry-begin-time" type="time">
          </div>
          <div class="form-el">
            <label for="entry-end-time">End Time</label>
            <input name="timeEnd" id="entry-end-time" type="time">
          </div>
          <div class="form-el">
            <label for="entry-rate">Rate</label>
            <input inputmode="decimal"  style="text-align: right" name="rate" id="entry-rate" type="number" step="0.01"> €
          </div>            
          <div class="form-el">
            <label for="entry-bonus">Bonus</label>
            <input inputmode="decimal" style="text-align: right" name="bonus" id="entry-bonus" type="number" step="0.01"> €
          </div>        
          <div class="form-el">
            <label for="entry-sick-leave">Sick Leave</label>
            <input name="sickLeave" id="entry-sick-leave" type="checkbox">
          </div>                

          <div class="form-el">
            <button data-button-submit>Save${state.mode == 'new' ? ' New' : ''}</button>
          </div>
        </form>
      </section>    
    `
  }

  constructor(tag, state) {
    super(tag, state)
  }
}

export default RecordForm
