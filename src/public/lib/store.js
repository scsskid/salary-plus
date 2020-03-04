import Utils from './../utils.js'

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
    record: function(submittedRecord) {
      let appData = JSON.parse(localStorage.getItem('appData'))
      appData = { ...appData }
      submittedRecord = Utils.processRecordFormData(submittedRecord)

      if (submittedRecord.id == 'undefined') {
        // new
        submittedRecord.id = Store.recordsMaxId + 1
        appData.records.push(submittedRecord)
      } else {
        // update existing
        const targetIndex = appData.records.findIndex(el => {
          return el.id == submittedRecord.id
        })
        appData.records[targetIndex] = submittedRecord
      }
      localStorage.setItem('appData', JSON.stringify(appData))
    }
  }
}
