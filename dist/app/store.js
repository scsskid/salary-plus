import Utils from './utils.js'
import { getObjById, mutateArray, deleteObjInArrayById } from './lib/helpers.js'
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

// Store.deleteRecord = function(recordId) {
//   const records = deleteObjInArrayById(recordId, [...Store.get('records')])
//   Store.set('records', records)
// }

Store.getRecord = function(id) {
  return getObjById(id, Store.get('records'))
}

Store.saveSampleData = function() {
  localStorage.setItem('sp_app', JSON.stringify(sampleData.app))
  localStorage.setItem('sp_user', JSON.stringify(sampleData.user))
  localStorage.setItem('sp_records', JSON.stringify(sampleData.records))
  localStorage.setItem('sp_jobs', JSON.stringify(sampleData.jobs))
  localStorage.setItem('sp_patterns', JSON.stringify(sampleData.patterns))
}
