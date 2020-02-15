import RecordsList from './components/records-list.js'
import sampleData from './data/sample-data.js'

var recordsList = new RecordsList(document.querySelector('.records-list'))

recordsList.records = [{}, {}]

setTimeout(() => {
  recordsList.records = sampleData.records
}, 1000)

// document.addEventListener('DOMContentLoaded', () => {})
