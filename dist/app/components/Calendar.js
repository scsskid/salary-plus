import BaseComponent from './BaseComponent.js'

class Calendar extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    // this.observe()
  }

  render() {
    // console.log(this.state)
    // todo: rewrite to reduce() ?
    this.recordsMap = {}
    this.state.records.forEach(record => {
      const mapDateKey = new Date(record.begin).getDate()
      if (typeof this.recordsMap[mapDateKey] === 'undefined') {
        this.recordsMap[mapDateKey] = []
      }
      this.recordsMap[mapDateKey].push(record)
    })

    console.log(this.state.records)
    console.log(this.recordsMap)

    const inputDate = this.state.inputDate

    this.createCalendar = createCalendar
    this.insertRecords = insertRecords
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
    setTimeout(() => {
      this.createCalendar(inputDate, this.insertRecords.bind(this))
    }, 0)
  }
  constructor(tag, state) {
    super(tag, state)
  }
}

export default Calendar

// Calendar Helper Functions

function createCalendar(inputDate, cb) {
  const table = createTableOuter()

  const inputDateMonth = inputDate.getMonth()
  const inputDateFullYear = inputDate.getFullYear()

  var dateNow = new Date()
  const dateNowDate = dateNow.getDate()
  const dateNowMonth = dateNow.getMonth()
  const dateNowFullYear = dateNow.getFullYear()
  // save firstWeekDay Int (Sun to Sat) to check for later
  // and Adjust that Mon = 0

  {
    const copyDate = new Date(inputDate.getTime())
    copyDate.setDate(1)
    var firstDay = (copyDate.getDay() + 6) % 7 // Mo = 0; Sun = 6
  }

  let date = 1
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
        const dateHasRecords = typeof this.recordsMap[date] !== 'undefined'
        cellText = document.createElement('span')
        cellText.classList.add('date-item')
        cellText.dataset.dateString = `${inputDateFullYear}-${inputDateMonth + 1}-${date}`

        if (dateHasRecords) {
          for (const item of this.recordsMap[date]) {
            console.log(item)
            cellText.insertAdjacentHTML('beforeend', '🥵')
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

  // Append Table to Dom
  this.container.querySelector('[data-calendar]').appendChild(table)
}

function insertRecords() {
  console.log(this, this.dateItemsLive, this.dateItemsLive.length, Array.from(this.dateItemsLive))
  // setTimeout(() => {}, timeout)
  // for (const item of Array.from(this.dateItemsLive)) {
  //   console.log('foo', item)
  // }
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
