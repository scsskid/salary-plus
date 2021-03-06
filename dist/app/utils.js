import settings from './data/settings.js'
import Store from './store.js'

const store = new Store()

export default {
  formatDate: {
    nice: function(string) {
      return new Date(string).toLocaleDateString('DE-de', settings.dateFormatOptions.nice)
    },
    short: function(string) {
      return new Date(string).toLocaleDateString('DE-de', settings.dateFormatOptions.short)
    },
    rfc3339: function(date) {
      // target: YYYY-MM-DD
      var year = date.getFullYear().toString()
      var month = (date.getMonth() + 101).toString().substring(1) // 101 because first month is 0 not 1
      var day = (date.getDate() + 100).toString().substring(1)
      return year + '-' + month + '-' + day
    }
  },
  formatTime: function(string) {
    return new Date(string).toLocaleTimeString('DE-de', { hour: '2-digit', minute: '2-digit' })
  },
  getTimeZoneAwareIsoString: function(string) {
    var date = new Date(string)
    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
    return dateString
  },
  getDateFromIsoString: function(string) {
    var dateString = new Date(string).toISOString().split('T')[0]
    return dateString
  },
  getTimeElapsed: function(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    return `${hours}:${minutes}`
  },
  timeToDecimal: function(t) {
    var arr = t.split(':')
    var dec = parseInt((arr[1] / 6) * 10, 10)

    return parseFloat(parseInt(arr[0], 10) + '.' + (dec < 10 ? '0' : '') + dec)
  },

  mapFormDataToStorageObject: function(record) {
    record.dateBegin = record.dateBegin.replace(/-/g, '/')
    record.dateEnd = record.dateBegin

    // check if endtime is less that begin time (enddate is next day), if so add one day
    if (record.timeBegin > record.timeEnd) {
      var recordedDate = new Date(record.dateEnd)
      var recordedDay = recordedDate.getDate()
      recordedDate.setDate(recordedDay + 1)
      record.dateEnd = recordedDate.toDateString()
    }

    let begin = new Date(record.dateBegin + ' ' + record.timeBegin).toISOString()
    let end = new Date(record.dateEnd + ' ' + record.timeEnd).toISOString()

    delete record.dateEnd // ? otherwise it get returned, why?

    return {
      id: record.id,
      jobId: parseInt(record.jobId), // ? Why parseInt()?
      begin,
      end,
      bonus: record.bonus || '',
      note: record.note || '',
      sickLeave: record.sickLeave == 'on' ? 'true' : '' || '',
      status: record.status || '',
      rate: record.rate || '',
      interval: record.rateInterval || ''
    }
  },

  mapFormInputElements: function(form) {
    var formInputElements = Array.from(form.elements)

    // filter submit els
    formInputElements = formInputElements.filter(function(el) {
      var targetTypes = ['text', 'date', 'time']
      return el.nodeName == 'INPUT' && targetTypes.includes(el.type)
    })

    // map to smaller obj
    formInputElements = formInputElements.map(function returnIdValPairs(el) {
      return {
        [el.id]: el.value
      }
    })

    return formInputElements
  },

  /**
   * Maps Storage Data to Form values or to Display Values
   */
  mapLocalStorageRecord(...args) {
    const record = args[0] || undefined
    // console.log(record)
    const mode = args[1] || 'display'
    let mapped = {}
    var timeElapsed = this.getTimeElapsed(new Date(record.end) - new Date(record.begin))
    var earnedNumber = this.timeToDecimal(timeElapsed) * record.rate
    var earned = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(earnedNumber)
    // var earned = earnedNumber.toLocaleString('de-DE', { minimumFractionDigits: 2 })
    // var jobs = Store.get('jobs')
    // var job = jobs.find(job => {
    //   return job.id == record.jobId
    // })

    mapped = {
      id: record.id || undefined,
      jobId: parseInt(record.jobId || 0),
      dateBegin: this.formatDate.rfc3339(new Date(record.begin)),
      timeBegin: this.formatTime(record.begin),
      timeEnd: this.formatTime(record.end),
      timeElapsed,
      earned,
      bonus: record.bonus,
      rate: record.rate,
      sickLeave: record.sickLeave,
      status: record.status
    }

    return mapped
  }
}

export function route(path) {
  events.publish('navigate', { pathname: path })
}

// !todo rewrite ...spread
export function dispatchEvent(name, target, detail = {}, bubbles = true) {
  target.dispatchEvent(new CustomEvent(name, { bubbles, detail }))
}

export function routeDataSetHref(event) {
  event.preventDefault()
  if (event.target.dataset.href) {
    route(event.target.dataset.href)
  }
}

// Publish / Subscribe Helper
export const events = {
  events: {},
  on: function(eventName, fn) {
    // console.log('subscribe to', eventName)

    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(fn)
  },
  publish: function(eventName, data) {
    // console.log('emit', eventName, data)
    if (this.events[eventName]) {
      this.events[eventName].forEach(fn => {
        // console.log(fn)
        fn(data)
      })
    } else {
      // console.warn(`events.publish('${eventName}'): No Functions are registered for ${eventName}`)
    }
  }
}

export function isCurrentMonth(date) {
  const now = new Date()
  return date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear()
}
