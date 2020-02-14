import settings from './settings.js'

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
    return new Date(string).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
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
  /**
   * if timeBegin is gt timeEnd assuming endDate to be next day
   * @param {Object} record
   */

  sanitizeRecordEndDate: function todo(record) {
    if (record.timeBegin <= record.timeEnd) {
      record.dateEnd = record.date
    } else {
      var recordedDate = new Date(record.date)
      var recordedDay = recordedDate.getDate()
      recordedDate.setDate(recordedDay + 1)
      record.dateEnd = this.getTimeZoneAwareIsoString(recordedDate)
    }
    return record
  }
}
