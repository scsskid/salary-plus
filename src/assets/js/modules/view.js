import utils from './../helpers.js'
function View() {
  this.recordsSection = document.querySelector('[data-records]')
  this.recordsList = document.createElement('ul')
  this.recordsList.classList.add('records-list')
  this.recordsSection.append(this.recordsList)
}

View.prototype = {
  displayRecords: function(records) {
    // Empty Records List
    while (this.recordsList.firstChild) {
      this.recordsList.removeChild(this.recordsList.firstChild)
    }
    // Delete Possible Empty Message
    if (this.recordsSection.querySelector('.info-message')) {
      this.recordsSection.removeChild(this.recordsSection.querySelector('.info-message'))
    }
    // Add Records to List in View
    if (records.length == 0) {
      var p = document.createElement('p')
      p.classList.add('info-message')
      p.innerHTML = `records are empty <button class="seed-records" data-seed-records>Seed Records</button>`
      this.recordsSection.append(p)
    } else {
      records.forEach(record => {
        var li = document.createElement('li')
        li.classList.add('records-list-item')
        li.dataset.id = record.id
        li.innerHTML = `
          <div class="record-date">${utils.formatDate.short(record.begin)}</div>
          <div class="record-time">${utils.formatTime(record.begin)} - ${utils.formatTime(record.end)}</div>
          <button class="record-delete">X</button>
        `
        this.recordsList.append(li)
      })
    }
  },
  bindSeedRecords: function(seedRecordsHandler) {
    document.querySelector('.container').addEventListener('click', function handleClick(e) {
      if (e.target.classList.contains('seed-records')) {
        seedRecordsHandler()
      }
    })
  },
  bindAddRecord: function(addRecordHandler) {
    this.form = document.querySelector('.data-insert form')
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      var inputBeginDate = this.form.querySelector('#entry-begin-date')
      var inputBeginTime = this.form.querySelector('#entry-begin-time')
      var inputEndDate = this.form.querySelector('#entry-end-date')
      var inputEndTime = this.form.querySelector('#entry-end-time')

      var record = {}
      record.begin = `${inputBeginDate.value} ${inputBeginTime.value}`
      record.end = `${inputEndDate.value} ${inputEndTime.value}`

      addRecordHandler(record)
    })
  },
  bindDeleteRecord: function(deleteRecordHandler) {
    this.recordsList.addEventListener('click', function handleEvent(event) {
      if (event.target.className == 'record-delete') {
        deleteRecordHandler(event.target.parentElement.dataset.id)
      }
    })
  }
}

export default View
