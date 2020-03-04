import Utils from './../utils.js'
// ? Rewrite to Function

const settings = {
  localStorageKey: 'appData'
}

export const Store = {
  appData: JSON.parse(localStorage.getItem(settings.localStorageKey)),

  appDataPresent: function() {
    return localStorage.hasOwnProperty(settings.localStorageKey)
  },

  getRecord: function(id) {
    var requestedRecord = Store.appData.records.find(function(record) {
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
      let appData = { ...Store.appData }
      submittedRecord = Utils.processRecordFormData(submittedRecord)

      if (submittedRecord.id == 'undefined') {
        // new
        submittedRecord.id = Store.recordsMaxId + 1
        appData.records.push(submittedRecord)
      } else {
        // update existing
        const targetIndex = Store.appData.records.findIndex(el => {
          return el.id == submittedRecord.id
        })
        Store.appData.records[targetIndex] = submittedRecord
      }
      localStorage.setItem('appData', JSON.stringify(appData))
    },
    delete: function(id) {
      console.log('delete', id)
      let appData = { ...Store.appData }
      const targetIndex = Store.appData.records.findIndex(el => {
        return el.id == id
      })

      Store.appData.records.splice(targetIndex, 1)

      localStorage.setItem('appData', JSON.stringify(appData))
    }
  }
}
