import BaseComponent from './BaseComponent.js'
import Calendar from './Calendar.js'
import CalendarControls from './CalendarControls.js'
import Utils, { events, isCurrentMonth } from './../utils.js'
import Store from '../store.js'
import CalendarDayView from './CalendarDayView.js'
import proxyState from '../lib/Proxy.js'

const store = new Store()

class Home extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.inputDate = proxyState.inputDate
    this.dayView = new CalendarDayView('div')
    this.content = {
      title: 'Overview'
    }
    this.state = { ...proxyState }
  }

  render() {
    this.container.innerHTML = `
      <style>
        [data-date-selected] {
          background: green;
        }
      </style>
    `

    const inputDate = this.inputDate
    const recordsOfInputDateMonth = store
      .get('records')
      .filter(record => {
        return new Date(record.begin).getMonth() == inputDate.getMonth()
      })
      .return()

    this.calendarControls = new CalendarControls('div', { inputDate })
    this.container.appendChild(this.calendarControls.container)

    this.calendar = new Calendar('div', {
      inputDate,
      records: recordsOfInputDateMonth || []
    })
    this.container.appendChild(this.calendar.container)

    this.addEventListeners()
  }

  addEventListeners() {
    events.on('date-select', updateDayView.bind(this))

    function updateDayView() {
      const date = proxyState.inputDate
      this.dayView.container.remove()
      // find records of date
      // ! Move To Store
      const recordsOfDate = store
        .get('records')
        .return()
        .filter(filterByDate(proxyState.inputDate))

      function filterByDate(date) {
        return function matchDate(record) {
          const dateBegin = new Date(record.begin)
          return (
            dateBegin.getFullYear() == date.getFullYear() &&
            dateBegin.getMonth() == date.getMonth() &&
            dateBegin.getDate() == date.getDate()
          )
        }
      }

      // display dayview
      if (recordsOfDate.length) {
        this.dayView.state = { records: recordsOfDate }
        this.container.appendChild(this.dayView.container)
      }
    }
  }

  disconnectedCallback() {}

  connectedCallback() {
    console.log('Home ConnectedCallback --------------')

    let freshness = true

    if (this.state.records.length != proxyState.records.length) {
      // records were updated, set  freshness to false
      freshness = false
    } else {
      // records unchanged
    }

    if (this.inputDate != proxyState.inputDate) {
      freshness = false
      this.inputDate = proxyState.inputDate
    }

    // console.log('freshness:', freshness)
    if (!freshness) {
      console.warn('😲 : update compoenent state + rerender')

      this.state.records = [...proxyState.records]

      this.render()
      // freshness = true
    } else {
      console.log('😴 state not outdated DO NOTHING')
    }
  }

  constructor(tag, state) {
    super(tag, state)
  }
}

export default Home
