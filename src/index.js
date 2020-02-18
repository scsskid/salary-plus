import RecordsList from './components/records-list.js'
import sampleData from './data/sample-data.js'

var recordsList = new RecordsList(document.querySelector('.records-list'))

window.recordsList = recordsList

setTimeout(() => {
  recordsList.state = { records: sampleData.records, jobs: sampleData.jobs }
}, 500)

setTimeout(() => {
  sampleData.records.pop()
  recordsList.state = { records: sampleData.records, jobs: sampleData.jobs }
}, 1000)

// document.addEventListener('DOMContentLoaded', () => {})
