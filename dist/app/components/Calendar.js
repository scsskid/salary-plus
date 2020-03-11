import BaseComponent from './BaseComponent.js'

class Calendar extends BaseComponent {
  init(container, state) {
    this.container = container
    this.state = state

    this.createCalendar = createCalendar
  }

  render() {
    this.container.innerHTML = `
      <style>
        [data-calendar] table {
          width: 100%
        }

        [data-calendar] td {
          background: #EEE;
        }
      </style>
      <section data-calendar>
        <h2>Cal</h2>
      </section>
    `

    this.calendar = this.container.querySelector('[data-calendar]')

    // const firstDay = new Date(year, month).getDay()

    // Construct Cal

    const date = new Date()

    this.createCalendar(date.getMonth(), date.getFullYear())
  }
}

export default Calendar

// Calendar Helper Functions

function createCalendar(month, year) {
  const table = createTableOuter()

  let date = 1
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr')
    table.appendChild(row)
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td')
      const cellText = document.createTextNode('0')
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
