import storage from './storage-functions.js'
import appSettings from './app-settings.js'
import sampleData from './../../data/sample-data.js'
import helpers from './helpers.js'

if (!storage.getData()) {
  storage.setData(sampleData)
}

var data = storage.getData()

// console.log(data.records)

if (!data) {
} else {
  var dataListSection = document.querySelector('.data-list')
  var dataList = document.createElement('ul')

  dataListSection.appendChild(dataList)

  data.records.forEach(function insertEntriesToDom(record) {
    // console.log(record);

    var markup = `
      <li class="">
        <p><b>ID: ${record.id}</b>:<br>
        ${helpers.formatDate(record.begin)}<br>        
        ${helpers.formatTime(record.begin)} - ${helpers.formatTime(record.end)}</p>
      </li>
    `
    dataList.insertAdjacentHTML('beforeEnd', markup)
  })
}
