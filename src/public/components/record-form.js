import BaseComponent from './base-component.js'
// todo: only import selected utils AND also consider not to abstract away when only used once
import Utils from '../utils.js'

class RecordForm extends BaseComponent {
  set state(state) {
    this.stateValue = state
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container

    // If no record prop in state, mode is 'new', otherwise 'edit
    this.state =
      {
        ...state,
        ...{ mode: state.record != undefined ? 'edit' : 'new' }
      } || {}
    this.form = this.container.querySelector('.data-insert form')
    this.inputDate = this.container.querySelector('#entry-date')
    this.inputBeginTime = this.container.querySelector('#entry-begin-time')
    this.inputEndTime = this.container.querySelector('#entry-end-time')

    console.log(this.state.record)
    // Defaults
    this.defaultFormValues = {
      jobId: 1,
      dateBegin: Utils.formatDate.rfc3339(new Date()),
      timeBegin: '14:00',
      timeEnd: '00:00'
    }

    // set state.record to default if { mode: new }
    if (this.state.mode == 'new') {
      this.state = {
        ...this.state,
        ...{ record: this.defaultFormValues }
      }
    } else if (this.state.mode == 'edit') {
      this.state = {
        ...this.state,
        ...{ record: Utils.mapRecord(this.state.record, 'form') }
      }
    }
    console.log(this.state)
    // Utils.mapRecord(this.state.record, 'form')

    this.render()
  }

  render() {
    this.container.innerHTML = RecordForm.markup(this.state)
    this.form = this.container.querySelector('.data-insert form')
    this.inputDate = this.container.querySelector('#entry-date')
    this.inputBeginTime = this.container.querySelector('#entry-begin-time')
    this.inputEndTime = this.container.querySelector('#entry-end-time')
    this.populateForm()
    this.addEventListeners()
  }

  addEventListeners() {
    this.form.addEventListener('submit', event => {
      event.preventDefault()
      var formData = new FormData(this.form)

      const formDataTransport = {}
      for (var [formElementName, value] of formData.entries()) {
        formDataTransport[formElementName] = value
      }

      // console.log(formDataTransport)
      event.target.dispatchEvent(
        new CustomEvent('submitNewRecord', {
          bubbles: true,
          detail: {
            formData: formDataTransport
          }
        })
      )

      this.form.reset()
    })
  }

  static markup(state) {
    return `
      <section class="data-insert">
        <h2><b>--${state.mode}--</b> Record</h2>
        <form action="">
          <div class="form-el">
            <label for="entry-job">Job</label>
            <select name="jobId" id="entry-job" type="date">
              <option value="1">BND</option>
              <option value="2" selected>Palsta</option>
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
            <button data-button-submit>Save New</button>
          </div>
        </form>
      </section>    
    `
  }

  populateForm() {
    // Map Record To Form

    // use defaults if no state is given
    // ? mode prop not necessary

    // Set Values

    console.log(this.state.record)

    this.inputDate.value = this.state.record.dateBegin
    this.inputBeginTime.value = this.state.record.timeBegin
    this.inputEndTime.value = this.state.record.timeEnd
  }

  constructor(container, state) {
    super(container, state)
  }
}

export default RecordForm
