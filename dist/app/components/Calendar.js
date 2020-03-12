import BaseComponent from './BaseComponent.js'

class Calendar extends BaseComponent {
  init(container, state) {
    this.container = container
    this.state = { ...state, inputDate: state.inputDate !== undefined ? new Date(state.inputDate) : new Date() }
  }

  render() {
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

        [data-is-today] {
          color: red;
          font-weight: bold;
        }
      </style>
      <section data-calendar>
        <p style="text-align: center; padding-top: 1rem"><b>${inputDate.toLocaleDateString('en', { month: 'long' })}</b><br>${inputDate.getFullYear()}</p>
      </section>
    `

    this.createCalendar(inputDate)
  }
  constructor(container, state) {
    super(container, state)
  }
}

export default Calendar

// Calendar Helper Functions

function createCalendar(inputDate) {
  const table = createTableOuter()
  var dateNow = new Date()
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
        cellText = document.createTextNode('😴')
      } else if (date > daysInMonth(inputDate)) {
        cellText = document.createTextNode('😱')
      } else {
        console.log(inputDate)

        cellText = document.createElement('span')
        cellText.dataset.dateString = `${inputDate.getFullYear()}-${inputDate.getMonth() + 1}-${date}`
        cellText.appendChild(document.createTextNode(date))

        if (date == dateNow.getDate() && inputDate.getFullYear() == dateNow.getFullYear() && inputDate.getMonth() == dateNow.getMonth()) {
          cellText.dataset.isToday = ''
          // cellText.insertAdjacentHTML('beforeEnd', ` *`)
        }

        date++
      }

      cell.appendChild(cellText)
      row.appendChild(cell)
    }
  }

  this.container.querySelector('[data-calendar]').appendChild(table)
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
