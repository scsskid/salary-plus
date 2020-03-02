export const Store = {
  // localStorageKey: 'appData',
  appDataPresent: localStorage.hasOwnProperty('appData'),

  appData: JSON.parse(localStorage.getItem('appData')),

  getRecord: function(id) {
    var requestedRecord = this.appData.records.find(function(record) {
      return record.id == id
    })
    return requestedRecord
  },

  get recordsMaxId() {
    var maxId = 0
    this.appData.records.forEach(record => {
      if (maxId < record.id) {
        maxId = record.id
      }
    })
    return maxId
  },

  write: {
    appData: function(appData) {
      localStorage.setItem('appData', JSON.stringify(appData))
    },
    record: function(record) {
      console.log(record)

      let appData = JSON.parse(localStorage.getItem('appData'))
      appData = { ...appData }
      appData.records.push(record)
      localStorage.setItem('appData', JSON.stringify(appData))

      // if id undefined -> write new
      // ...
      //  else
      // .. write existing
    }
  }
}
