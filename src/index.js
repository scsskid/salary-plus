import RecordsList from './components/records-list.js'
import sampleData from './data/sample-data.js'

setTimeout(() => {
  var recordsList = new RecordsList(document.querySelector('.records-list'))
  recordsList.records = sampleData.records
}, 1000)

// document.addEventListener('DOMContentLoaded', () => {})
