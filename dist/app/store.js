import Utils from './utils.js'
import sampleData from './data/sample-data.js'
// import proxyState from './lib/Proxy.js'

const settings = {
  localStoragePrefix: 'sp_'
}

export function Store() {}

Store.getAll = function() {
  const appData = {}
  Object.entries(localStorage).forEach(el => {
    const key = el[0].replace(`${settings.localStoragePrefix}`, '')
    const value = JSON.parse(el[1])
    appData[key] = value
  })
  return appData
}

Store.getAll()

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
  submittedRecord = Utils.mapFormDataToStorageObject(submittedRecord)

  mutateRecords(submittedRecord, records)

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

/**
 * add record or alter record of records array
 * @param {obj} record
 * @param {array} records
 */
function mutateRecords(record, records) {
  // add new
  if (typeof record.id == 'undefined') {
    record.id = getMaxId(records) + 1
    records.push(record)
  } else {
    // update existing
    const targetIndex = records.findIndex(el => {
      return el.id == record.id
    })
    records[targetIndex] = record
  }

  return records
}

/**
 * get maxId of array with objects, which contain prop obj.id
 * @param {array} array
 */
function getMaxId(array) {
  var maxId = 0
  array.forEach(obj => {
    if (maxId < obj.id) {
      maxId = parseInt(obj.id)
    }
  })
  return maxId
}

Store.saveSampleData = function() {
  localStorage.setItem('sp_app', JSON.stringify(sampleData.app))
  localStorage.setItem('sp_user', JSON.stringify(sampleData.user))
  localStorage.setItem('sp_records', JSON.stringify(sampleData.records))
  localStorage.setItem('sp_jobs', JSON.stringify(sampleData.jobs))
  localStorage.setItem('sp_patterns', JSON.stringify(sampleData.patterns))
}
