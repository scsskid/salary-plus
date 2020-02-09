import storage from './storage-functions.js'
import appSettings from './app-settings.js'
import sampleData from './../../data/sample-data.js'
import helpers from './helpers.js'

if (!storage.getData()) {
  storage.setData(sampleData)
}

var data = storage.getData()

console.log(data.records)

// var firstRecordBeginDate = new Date(data.records[0].begin);
// console.log(firstRecordBeginDate.toLocaleString("de-DE"));

if (!data) {
} else {
  var dataListSection = document.querySelector('.data-list')
  var dataList = document.createElement('ul')

  dataListSection.appendChild(dataList)

  data.records.forEach(function insertEntriesToDom(record) {
    // console.log(record);
    // Todo: Refactor DateFmt to Helper
    var markup = `
      <li class="">
        <p><b>${record.id}</b>:
        
        ${helpers.formatDate(record.begin)} - ${helpers.formatDate(record.end)}</p>
      </li>
    `
    dataList.insertAdjacentHTML('beforeEnd', markup)
  })
}
