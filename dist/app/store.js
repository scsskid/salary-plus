import Utils from './utils.js'
import sampleData from './data/sample-data.js'

const settings = {
  localStoragePrefix: 'sp_'
}

export function Store() {}

Store.get = function(key) {
  const item = localStorage.getItem(`${settings.localStoragePrefix}${key}`)
  const result = item ? JSON.parse(item) : null
  return result
}

Store.set = function(key, data) {
  return localStorage.setItem(`${settings.localStoragePrefix}${key}`, JSON.stringify(data)) || undefined
}

Store.setRecord = function(submittedRecord) {
  let records = [...Store.get('records')]
  submittedRecord = Utils.processRecordFormData(submittedRecord)

  if (typeof submittedRecord.id == 'undefined') {
    // new
    submittedRecord.id = Store.getRecordsMaxId() + 1
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
  const records = [...Store.get('records')]

  const targetIndex = records.findIndex(el => {
    return el.id == id
  })
  // console.log('deleted index: ', targetIndex)

  if (targetIndex != -1) {
    records.splice(targetIndex, 1)
  }

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
      maxId = parseInt(record.id)
    }
  })
  return maxId
}

Store.saveSampleData = function() {
  localStorage.setItem('sp_app', JSON.stringify(sampleData.app))
  localStorage.setItem('sp_user', JSON.stringify(sampleData.user))
  localStorage.setItem('sp_records', JSON.stringify(sampleData.records))
  localStorage.setItem('sp_jobs', JSON.stringify(sampleData.jobs))
}
