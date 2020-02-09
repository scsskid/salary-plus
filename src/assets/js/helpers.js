import appSettings from './app-settings.js'

export default {
  formatDate: function(string) {
    return new Date(string).toLocaleDateString(undefined, appSettings.dateFormatOptions)
  }
}
