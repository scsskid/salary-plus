import BaseComponent from './BaseComponent.js'

class Calendar extends BaseComponent {
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
    this.createCalendar()
  }

  createCalendar() {
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

    let date = 1
    for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr')
      table.appendChild(row)
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement('td')
        const cellText = document.createTextNode('0')
        cell.appendChild(cellText)
        row.appendChild(cell)
        console.log('waaaa')
      }
    }

    this.calendar.appendChild(table)
  }
}

export default Calendar
