import settings from './settings.js'
import { Store } from './lib/store.js'

export default {
  formatDate: {
    nice: function(string) {
      return new Date(string).toLocaleDateString('DE-de', settings.dateFormatOptions.nice)
    },
    short: function(string) {
      return new Date(string).toLocaleDateString('DE-de', settings.dateFormatOptions.short)
    }
  },
  formatTime: function(string) {
    return new Date(string).toLocaleTimeString('DE-de', { hour: '2-digit', minute: '2-digit' })
  },
  setData: function(data) {
    localStorage.setItem('appData', JSON.stringify(data))
  },
  getData: function() {
    return JSON.parse(localStorage.getItem('appData'))
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

  processRecordFormData: function(record) {
    // set enddate to begin date
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

    return {
      id: record.id ? record.id : Store.recordsMaxId + 1,
      jobId: parseInt(record.jobId),
      begin,
      end
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

  parseRequestedURL: function() {
    console.log(location)
  },

  mapRecord(record) {
    var { jobs } = JSON.parse(localStorage.getItem('appData'))
    var job = jobs.find(job => {
      return job.id == record.jobId
    })
    var timeElapsed = this.getTimeElapsed(new Date(record.end) - new Date(record.begin))
    var earnedNumber = this.timeToDecimal(timeElapsed) * job.rate
    var earned = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(earnedNumber)

    return {
      id: record.id,
      jobId: parseInt(record.jobId),
      dateBegin: this.formatDate.nice(record.begin),
      timeBegin: this.formatTime(record.begin),
      timeEnd: this.formatTime(record.end),
      end: record.end,
      timeElapsed,
      earned
    }
  }
}
