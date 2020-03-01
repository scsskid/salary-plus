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
    this.container.innerHTML = RecordForm.markup(this.state)

    this.populateForm()
    this.addEventListeners()
  }

  static markup(state) {
    return `
      <section class="data-insert">
        <h2><b>--${state.mode}--</b> Record</h2>
        <form action="">
          <div class="form-el">
            <label for="entry-date">Date</label>
            <input name="entry-date" id="entry-date" type="date">
          </div>
          <div class="form-el">
            <label for="entry-begin-time">Begin Time</label>
            <input name="entry-begin-time" id="entry-begin-time" type="time">
          </div>
          <div class="form-el">
            <label for="entry-end-time">End Time</label>
            <input name="entry-end-time" id="entry-end-time" type="time">
          </div>

          <div class="form-el">
            <button data-button-submit>Save New</button>
          </div>
        </form>
      </section>    
    `
  }

  addEventListeners() {
    // this.form = document.querySelector('.data-insert form')
    // this.buttonSubmit = this.container.querySelector('[data-button-submit]')

    this.form.addEventListener('submit', event => {
      event.preventDefault()
      var formData = new FormData(this.form)

      // for (var [key, value] of formData.entries()) {
      //   console.log(key, value)
      // }

      const formDataTransport = {}
      for (var [formElementName, value] of formData.entries()) {
        formDataTransport[formElementName] = value
      }

      console.log(formDataTransport)
      event.target.dispatchEvent(
        new CustomEvent('submitNewRecord', {
          bubbles: true,
          detail: {
            formData: formDataTransport
          }
        })
      )
      // mapInputs
      // ...
      // event mit daten zu index.js
    })
  }

  populateForm() {
    this.form = document.querySelector('.data-insert form')

    this.inputDate = this.form.querySelector('#entry-date')
    this.inputBeginTime = this.form.querySelector('#entry-begin-time')
    this.inputEndTime = this.form.querySelector('#entry-end-time')

    this.inputDate.value = utils.getTimeZoneAwareIsoString(new Date())
    this.inputBeginTime.value = utils.formatTime(new Date())
    this.inputEndTime.value = utils.formatTime(new Date())
  }

  constructor(container, state) {
    this.init(container, state)
  }
}
