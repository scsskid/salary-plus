export const Store = {
  appData: JSON.parse(localStorage.getItem('appData')),

  getRecord: function(id) {
    var requestedRecord = this.appData.records.find(recordById)
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
  }
}

function recordById(id) {
  return function() {
    return record.id == id
  }
}
