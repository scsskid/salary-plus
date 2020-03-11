import BaseComponent from './BaseComponent.js'

class Calendar extends BaseComponent {
  render() {
    const inputDate = this.state.inputDate !== undefined ? new Date(this.state.inputDate) : new Date() // new Date(null) == now

    console.log('CAL inputDate', inputDate)
    // console.log(inputDate.toLocaleDateString('en', { month: 'long' }))

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
      </style>
      <section data-calendar>
        <p>Year: ${inputDate.getFullYear()} / Month: ${inputDate.toLocaleDateString('en', { month: '2-digit' })}</p>
      </section>
    `

    this.calendar = this.container.querySelector('[data-calendar]')

    // Construct Cal

    this.createCalendar(inputDate)
  }
}

export default Calendar

// Calendar Helper Functions

function createCalendar(inputDate) {
  // const inputDate = new Date(date)
  console.log('create Cal Fn', inputDate)

  // save firstWeekDay Int (Sun to Sat) to check for later
  // and Adjust that Mon = 0

  {
    const copyDate = new Date(inputDate.getTime())
    copyDate.setDate(1)
    console.log(copyDate)

    var firstDay = (copyDate.getDay() + 6) % 7 // Mo = 0; Sun = 6
    console.log((inputDate.getDay() + 6) % 7)
  }

  // console.log(year, month, firstDay)

  const table = createTableOuter()

  let date = 1
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr')
    table.appendChild(row)

    // Create Rows
    for (let j = 0; j < 7; j++) {
      // console.log(j)

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

function daysInMonth(date) {
  console.log('daysInMonth Fn', date.getMonth())

  return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate()
}
