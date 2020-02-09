import appSettings from './app-settings.js'

export default {
  formatDate: function(string) {
    return new Date(string).toLocaleDateString(undefined, appSettings.dateFormatOptions)
  },
  formatTime: function(string) {
    return new Date(string).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }
}
