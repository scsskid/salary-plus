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

setTimeout(() => {
  console.log('setting recordsList.state.subComp')

  recordsList.state = Object.assign(recordsList.state, { subComp: 'set from index.js' })
}, 2000)

// document.addEventListener('DOMContentLoaded', () => {})
