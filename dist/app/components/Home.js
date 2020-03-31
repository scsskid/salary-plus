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
    this.state = { records: [...proxyState.records], jobs: [...proxyState.jobs] }
  }

  render() {
    this.container.innerHTML = `
      <style>
        [data-date-selected] {
          background: green;
        }
      </style>
    `

    const inputDate = proxyState.inputDate

    console.log(recordsOfInputDateMonth(inputDate))

    this.calendarControls = new CalendarControls('div', { inputDate })
    this.container.appendChild(this.calendarControls.container)

    this.calendar = new Calendar('div', {
      inputDate,
      records: recordsOfInputDateMonth(inputDate) || []
    })
    this.container.appendChild(this.calendar.container)

    this.addEventListeners()
  }

  addEventListeners() {
    events.on('operateDate', data => {
      const { operation } = data
      let targetDate = new Date(proxyState.inputDate.getTime())
      proxyState.inputDate = operateDate(operation, targetDate)
    })

    events.on('date-select', _ => {
      console.log('on date Select')

      updateDayView.bind(this)
    })

    events.on('proxy inputDate change', _ => {
      console.log('Home proxy date change handler', recordsOfInputDateMonth(proxyState.inputDate))
      this.calendar.state.inputDate = proxyState.inputDate
      this.calendar.state.records = recordsOfInputDateMonth(proxyState.inputDate)

      this.calendar.state = Object.assign(
        { ...this.calendarControls.state },
        {
          inputDate: proxyState.inputDate,
          records: recordsOfInputDateMonth(proxyState.inputDate)
        }
      )
    })

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

function recordsOfInputDateMonth(date) {
  return store
    .get('records')
    .filter(record => {
      return (
        new Date(record.begin).getMonth() == date.getMonth() &&
        new Date(record.begin).getFullYear() == date.getFullYear()
      )
    })
    .return()
}

function changeMonth(date, num) {
  var now = new Date()
  var newDate = new Date(date.getTime())
  newDate.setMonth(date.getMonth() + num, 1)

  if (now.getMonth() == newDate.getMonth() && now.getFullYear() == newDate.getFullYear()) {
    return now
  } else {
    return newDate
  }
}

function operateDate(operation, targetDate) {
  if ('month-decrease' == operation) {
    return changeMonth(targetDate, -1)
  } else if ('month-increase' == operation) {
    return changeMonth(targetDate, 1)
  } else if ('today' == operation) {
    return new Date()
  }
}
