import Utils from './utils.js'

const settings = {
  localStoragePrefix: 'sp_'
}

export function Store() {}

Store.get = function(key) {
  return JSON.parse(localStorage.getItem(`${settings.localStoragePrefix}${key}`))
}

Store.set = function(key, data) {
  return localStorage.setItem(`${settings.localStoragePrefix}${key}`, JSON.stringify(data))
}

export const Storage = {
  user: { ...Store.get('user') },
  records: [...Store.get('records')],
  jobs: [...Store.get('jobs')]
}

Store.setRecord = function(submittedRecord) {
  let records = [...Store.get('records')]
  submittedRecord = Utils.processRecordFormData(submittedRecord)

  if (submittedRecord.id == 'undefined') {
    // new
    submittedRecord.id = Store.recordsMaxId + 1
    records.push(submittedRecord)
  } else {
    // update existing
    const targetIndex = records.findIndex(el => {
      return el.id == submittedRecord.id
    })
    records[targetIndex] = submittedRecord
  }
  Store.set('records', records)
}

Store.deleteRecord = function(id) {
  let records = [...Store.get('records')]
  console.log('delete', id)

  const targetIndex = records.findIndex(el => {
    return el.id == id
  })

  records.splice(targetIndex, 1)

  Store.set('records', records)
}

Store.getRecord = function(id) {
  var requestedRecordObj = Store.get('records').find(function(record) {
    return record.id == id
  })
  return requestedRecordObj
}

Store.getRecordsMaxId = function() {
  var maxId = 0
  Store.get('records').forEach(record => {
    if (maxId < record.id) {
      maxId = record.id
    }
  })
  return maxId
}
