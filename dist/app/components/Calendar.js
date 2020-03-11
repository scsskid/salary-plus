import BaseComponent from './BaseComponent.js'

class Calendar extends BaseComponent {
  init(container, state) {
    this.container = container
    this.state = state

    this.state = {
      inputDate: '1966-04'
    }

    this.createCalendar = createCalendar
  }

  render() {
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
      </style>
      <section data-calendar>
        <h2>Year: ${this.state.inputDate.split('-')[0]} / Month: ${this.state.inputDate.split('-')[1]}</h2>
      </section>
    `

    this.calendar = this.container.querySelector('[data-calendar]')

    // Construct Cal
    const inputDate = new Date(this.state.inputDate || null) // new Date(null) == now
    this.createCalendar(inputDate.getFullYear(), inputDate.getMonth())
  }
}

export default Calendar

// Calendar Helper Functions

function createCalendar(year, month) {
  const inputDate = new Date(year, month)
  // save firstWeekDay Int (Sun to Sat) to check for later
  // and Adjust that Mon = 0
  const firstDay = (inputDate.getDay() + 6) % 7 // Mo = 0; Sun = 6

  console.log(year, month, firstDay)

  const table = createTableOuter()

  let date = 1
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr')
    table.appendChild(row)

    // Create Rows
    for (let j = 0; j < 7; j++) {
      console.log(j)

      const cell = document.createElement('td')
      let cellText
      // fill empty cells until first date of manth is nth day
      // check if is first row, and interationCount is less than firstDay
      // todo: fill with last month dates
      if (i == 0 && j < firstDay) {
        console.log('empty')
        cellText = document.createTextNode('😴')
      } else if (date > daysInMonth(year, month)) {
        cellText = document.createTextNode('😱')
      } else {
        cellText = document.createTextNode(date)
        date++
      }

      cell.appendChild(cellText)
      row.appendChild(cell)
    }
  }

  this.calendar.appendChild(table)
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

function daysInMonth(iYear, iMonth) {
  return 32 - new Date(iYear, iMonth, 32).getDate()
}
