import appSettings from './settings.js'

export default {
  formatDate: function(string) {
    return new Date(string).toLocaleDateString('DE-de', appSettings.dateFormatOptions)
  },
  formatTime: function(string) {
    return new Date(string).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  },
  setData: function(data) {
    localStorage.setItem('appData', JSON.stringify(data))
  },
  getData: function() {
    return JSON.parse(localStorage.getItem('appData'))
  }
}
