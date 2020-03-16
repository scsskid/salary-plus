import BaseComponent from './BaseComponent.js'
import Utils, { events } from './../utils.js'

class Calendar extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.addEventListeners()
  }

  render() {
    this.createRecordsMap()
    const inputDate = this.state.inputDate
    this.createCalendar = createCalendar

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
        <p style="text-align: center; padding-top: 1rem"><b>${inputDate.toLocaleDateString('en', { month: 'long' })}</b><br>${inputDate.getFullYear()}</p>
      </section>
    `
    this.createCalendar(inputDate).then(_ => events.publish('select-date', { date: this.state.inputDate }))
  }

  addEventListeners() {
    this.container.addEventListener('click', event => {
      const dateString = event.target.dataset.dateString
      if (dateString) {
        events.publish('select-date', { date: new Date(dateString) })
      }
    })
  }

  createRecordsMap() {
    // map date of Records to days of calendar
    // todo: rewrite to reduce() ?
    this.recordsMap = {}

    if (this.state.records) {
      this.state.records.forEach(record => {
        const mapDateKey = `${new Date(record.begin).getFullYear()}-${(new Date(record.begin).getMonth() + 1).toString().padStart(2, '0')}-${new Date(record.begin)
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
        let cellText
        // fill empty cells until first date of manth is nth day
        // check if is first row, and interationCount is less than firstDay
        // todo: fill with last month dates
        if (i == 0 && j < firstDay) {
          cellText = document.createTextNode('')
        } else if (date > daysInMonth(inputDate)) {
          cellText = document.createTextNode('')
        } else {
          // Insert a Day [1] [2] ...
          const dateString = `${inputDateFullYear}-${(inputDateMonth + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`

          const dateHasRecords = typeof this.recordsMap[dateString] !== 'undefined'
          cellText = document.createElement('span')
          cellText.classList.add('date-item')
          cellText.dataset.dateString = dateString

          if (dateHasRecords) {
            for (const item of this.recordsMap[dateString]) {
              cellText.insertAdjacentHTML('beforeend', '🍩')
            }
          }

          cellText.appendChild(document.createTextNode(date))

          if (date == dateNowDate && inputDateFullYear == dateNowFullYear && inputDateMonth == dateNowMonth) {
            cellText.dataset.isToday = ''
            // cellText.insertAdjacentHTML('beforeEnd', ` *`)
          }

          date++
        }

        cell.appendChild(cellText)
        row.appendChild(cell)
      }
    }

    const resp = this.container.querySelector('[data-calendar]').appendChild(table)
    if (resp) {
      resolve({ msg: 'huhu', el: resp })
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
