import BaseComponent from './BaseComponent.js'
import Utils, { events } from './../utils.js'
import proxyState from '../lib/Proxy.js'

class Calendar extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.inputDate = proxyState.inputDate
    this.addEventListeners()
    // console.log(state)
  }

  render() {
    console.log('CALENDAR render()')

    this.createCalendar = createCalendar.bind(this)
    this.createRecordsMap()
    const inputDate = proxyState.inputDate

    this.container.innerHTML = `
      <style>
        [data-calendar] table {
          width: 100%
        }

        [data-calendar] td {
          border: 1px dotted hsla(208, 20%, 20%, .8);
          text-align: center;
          width: calc(100% / 7);
        }

        [data-calendar] .date-item {
          display: block
        }

        [data-is-today] {
          color: red;
          font-weight: bold;
        }
      </style>
      <section data-calendar>
        <p style="text-align: center; padding-top: 1rem"><b>${inputDate.toLocaleDateString('en', {
          month: 'long'
        })}</b><br>${inputDate.getFullYear()}</p>
      </section>
    `
    // console.log(`Created Calendar with month ${inputDate.getMonth() + 1} ${inputDate.getFullYear()}`)
    this.createCalendar(inputDate).then(_ => events.publish('calendar created', {}))
  }

  addEventListeners() {
    // Handle Date Click
    this.container.addEventListener('click', event => {
      const dateString = event.target.dataset.dateString
      if (dateString) {
        event.stopPropagation()
        this.setDayMarker.bind(this)(dateString)
        // proxyState.inputDate = new Date(dateString) // Triggers Rerender, only needed for prefill add record form
        this.inputDate = new Date(dateString)
      }
    })

    events.on('proxy inputDate change', data => {
      // this.render()
    })
  }

  setDayMarker(dateString) {
    const dateItems = this.container.getElementsByClassName('date-item') // !
    const dateItem = this.container.querySelector(`[data-date-string="${dateString}"]`) // !
    Array.from(dateItems).forEach(el => delete el.dataset.dateSelected)
    dateItem.dataset.dateSelected = ''

    if ('dateSelected' in dateItem.dataset) {
      events.publish(`dayMarked`, { inputDateString: dateString })
    }
  }

  createRecordsMap() {
    // map date of Records to days of calendar
    // todo: rewrite to reduce() ?
    this.recordsMap = {}

    if (this.state.records) {
      this.state.records.forEach(record => {
        const mapDateKey = `${new Date(record.begin).getFullYear()}-${(new Date(record.begin).getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${new Date(record.begin)
          .getDate()
          .toString()
          .padStart(2, '0')}`
        if (typeof this.recordsMap[mapDateKey] === 'undefined') {
          this.recordsMap[mapDateKey] = []
        }
        this.recordsMap[mapDateKey].push(record)
      })
    }
  }

  constructor(tag, state) {
    super(tag, state)
  }
}

export default Calendar

// Calendar Helper Functions

function createCalendar(inputDate) {
  return new Promise((resolve, reject) => {
    const table = createTableOuter()
    const inputDateMonth = inputDate.getMonth()
    const inputDateFullYear = inputDate.getFullYear()
    const dateNow = new Date()
    const dateNowDate = dateNow.getDate()
    const dateNowMonth = dateNow.getMonth()
    const dateNowFullYear = dateNow.getFullYear()
    let date = 1

    // save firstWeekDay Int (Sun to Sat) to check for later
    // and Adjust that Mon = 0
    {
      const copyDate = new Date(inputDate.getTime())
      copyDate.setDate(1)
      var firstDay = (copyDate.getDay() + 6) % 7 // Mo = 0; Sun = 6
    }

    for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr')
      table.appendChild(row)

      // Create Rows
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement('td')
        let dateItem
        // fill empty cells until first date of manth is nth day
        // check if is first row, and interationCount is less than firstDay
        // todo: fill with last month dates
        if (i == 0 && j < firstDay) {
          dateItem = document.createTextNode('')
        } else if (date > daysInMonth(inputDate)) {
          dateItem = document.createTextNode('')
        } else {
          // Insert a Day [1] [2] ...
          const dateString = `${inputDateFullYear}-${(inputDateMonth + 1)
            .toString()
            .padStart(2, '0')}-${date.toString().padStart(2, '0')}`

          const dateHasRecords = typeof this.recordsMap[dateString] !== 'undefined'
          dateItem = document.createElement('span')
          dateItem.classList.add('date-item')
          dateItem.dataset.dateString = dateString

          if (dateHasRecords) {
            for (const item of this.recordsMap[dateString]) {
              dateItem.insertAdjacentHTML('beforeend', '🍩')
            }
          }

          dateItem.appendChild(document.createTextNode(date))

          if (date == dateNowDate && inputDateFullYear == dateNowFullYear && inputDateMonth == dateNowMonth) {
            dateItem.dataset.isToday = ''
            // cellText.insertAdjacentHTML('beforeEnd', ` *`)
          }

          date++
        }

        cell.appendChild(dateItem)
        row.appendChild(cell)
      }
    }

    if (this.container.querySelector('[data-calendar]').appendChild(table)) {
      resolve()
    }
  })
}

function createTableOuter() {
  const table = document.createElement('table')
  {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const row = document.createElement('tr')
    for (let i = 0; i < 7; i++) {
      const cell = document.createElement('th')
      const cellText = document.createTextNode(dayNames[i])
      cell.appendChild(cellText)
      row.appendChild(cell)
    }
    table.appendChild(row)
  }
  return table
}

function daysInMonth(date) {
  return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate()
}
