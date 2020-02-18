import RecordsList from './components/records-list.js'
import sampleData from './data/sample-data.js'

setTimeout(() => {
  var recordsList = new RecordsList(document.querySelector('.records-list'))
  recordsList.state = { records: sampleData.records, jobs: sampleData.jobs }
  // recordsList.records = sampleData.records
  // recordsList.jobs = sampleData.jobs
}, 100)

// document.addEventListener('DOMContentLoaded', () => {})
