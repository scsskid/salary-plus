import { getObjById } from './lib/helpers.js'
import sampleData from './data/sample-data.js'
// import proxyState from './lib/Proxy.js'

const settings = {
  localStoragePrefix: 'sp_'
}

export default function Store() {
  this.results = []
}

// only temp expose
Store.prototype.getAll = function() {
  const appData = {}
  Object.entries(localStorage).forEach(el => {
    const key = el[0].replace(`${settings.localStoragePrefix}`, '')
    const value = JSON.parse(el[1])
    appData[key] = value
  })
  return appData
}

Store.prototype.get = function(key) {
  const item = localStorage.getItem(`${settings.localStoragePrefix}${key}`)
  this.results = item ? JSON.parse(item) : null
  return this
}

Store.prototype.filter = function(handler) {
  this.results = this.results.filter(handler)
  return this
}

Store.prototype.byId = function(id) {
  this.results = this.results.find(el => el.id == id)
  return this
}

Store.prototype.return = function() {
  return this.results
}

Store.prototype.set = function(key, value) {
  console.log('STORE SET 2')

  return localStorage.setItem(`${settings.localStoragePrefix}${key}`, JSON.stringify(value)) || undefined
}

// Store.set = function(key, data) {
//   console.log('STORE SET')

//   return localStorage.setItem(`${settings.localStoragePrefix}${key}`, JSON.stringify(data)) || undefined
// }

Store.saveSampleData = function() {
  localStorage.setItem('sp_app', JSON.stringify(sampleData.app))
  localStorage.setItem('sp_user', JSON.stringify(sampleData.user))
  localStorage.setItem('sp_records', JSON.stringify(sampleData.records))
  localStorage.setItem('sp_jobs', JSON.stringify(sampleData.jobs))
  localStorage.setItem('sp_patterns', JSON.stringify(sampleData.patterns))
}

const store = new Store()

console.log(
  store
    .get('jobs')
    .filter(el => {
      return el.id == 1
    })
    .return()[0]
)
