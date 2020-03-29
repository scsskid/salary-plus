import BaseComponent from './BaseComponent.js'
import Utils, { events } from './../utils.js'
// import MajaRecords from './../data/records.js'
import { Store } from './../store.js'

class Debug extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.content = {
      title: 'Debug'
    }
    // this.importSalaryBookRecords()
  }

  importSalaryBookRecords() {
    let aiid = 0
    const map = MajaRecords.map((record, i) => {
      // console.log(record)
      const dateFragments = record['Datum'].split('.')
      const dateBegin = `${dateFragments[2]}-${dateFragments[1]}-${dateFragments[0]}`
      // console.log(record['Datum'], new Date(dateBegin))

      record = {
        id: ++aiid,
        jobId: 1,
        dateBegin: dateBegin,
        timeBegin: record['Beginn'],
        timeEnd: record['Ende'],
        bonus: record['Zusätzl. Bezahlung'].split(' ')[0].replace(',', '.'),
        note: record['Notizen'],
        rate: record['Stundenlohn'].split(' ')[0].replace(',', '.'),
        rateInterval: 'hourly'
      }

      record = Utils.processRecordFormData(record)
      return { ...record }
    })

    // console.log(map)

    // Store.set('records', map)

    map.forEach(el => {
      for (const prop in el) {
        // console.log(prop, el[prop])
      }
    })
  }

  generateData() {
    const data = {
      jobs: [
        {
          id: 1,
          name: 'Amazon',
          rate: 3.5
        },
        {
          id: 2,
          name: 'Blackrock',
          rate: 2500
        }
      ],
      records: []
    }

    for (let i = 1; i <= 10; i++) {
      data.records.push({
        id: i,
        dateBegin: new Date().toISOString(),
        dateEnd: new Date().toISOString(),
        jobId: 0
      })
    }

    for (const el of data.records) {
      console.log(el)
    }
    console.log(data.jobs)
  }

  print(data) {
    this.container.insertAdjacentHTML('beforeend', `<pre style="font-size: 9px">${JSON.stringify(data, null, 2)}</pre>`)
  }

  render() {
    this.container.insertAdjacentHTML('beforeend', `<p><button data-save-sample-data>Insert SampleData</button></p>`)
    this.container.insertAdjacentHTML('beforeend', `<p><button data-clear-storage>Clear localStorage</button></p>`)
    this.container.insertAdjacentHTML('beforeend', `<p><button data-generate-data>Generate</button></p>`)
    this.container.insertAdjacentHTML('beforeend', `<p><button data-list-all>List All Records</button></p>`)

    this.addEventListeners()

    // this.generateData()

    // events.publish('update-view-title', { title: Debug.common.title })
  }

  addEventListeners() {
    this.container.addEventListener('click', event => {
      if ('saveSampleData' in event.target.dataset) {
        events.publish('save-sample-data')
      } else if ('clearStorage' in event.target.dataset) {
        events.publish('clear-storage')
      } else if ('generateData' in event.target.dataset) {
        this.generateData()
      } else if ('listAll' in event.target.dataset) {
        events.publish('navigate', { pathname: '/records' })
      }
    })
  }

  constructor(container) {
    super(container)
  }
}

export default Debug

const discoverProperties = function(obj, level, excludePrefix) {
  var indent = '----------------------------------------'.substring(0, level * 2)
  var str = indent + 'level ' + level + '\r\n'
  if (typeof obj == 'undefined') return ''
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      var propVal
      try {
        propVal = eval('obj.' + property)
        str += indent + property + '(' + propVal.constructor.name + '):' + propVal + '\r\n'
        if (
          typeof propVal == 'object' &&
          level < 10 &&
          propVal.constructor.name != 'Date' &&
          property.indexOf(excludePrefix) != 0
        ) {
          if (propVal.hasOwnProperty('length')) {
            for (var i = 0; i < propVal.length; i++) {
              if (typeof propVal == 'object' && level < 10) {
                if (typeof propVal[i] != 'undefined') {
                  str += indent + propVal[i].constructor.name + '[' + i + ']\r\n'
                  str += this.discoverProperties(propVal[i], level + 1, excludePrefix)
                }
              } else str += indent + propVal[i].constructor.name + '[' + i + ']:' + propVal[i] + '\r\n'
            }
          } else str += this.discoverProperties(propVal, level + 1, excludePrefix)
        }
      } catch (e) {}
    }
  }
  return str
}
