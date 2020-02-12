import utils from '../utils.js'
function View() {
  this.recordsSection = document.querySelector('[data-records]')
  this.recordsList = document.createElement('ul')
  this.recordsList.classList.add('records-list')
  this.recordsSection.append(this.recordsList)

  this.form = document.querySelector('.data-insert form')

  this.inputDate = this.form.querySelector('#entry-date')
  this.inputBeginTime = this.form.querySelector('#entry-begin-time')
  this.inputEndTime = this.form.querySelector('#entry-end-time')
}

View.prototype = {
  /**
   * Display Records To Screen
   */

  displayRecords: function(records) {
    var recordsListCount = document.querySelector('[data-records-list-count]')
    recordsListCount.innerHTML = records.length
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
          <div class="record-time-elapsed">${utils.getTimeElapsed(new Date(record.end) - new Date(record.begin))}</div>
          <button class="record-delete">Delete</button>
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
  /**
   * Populate Add Form With Helpful Defaults
   */

  populateForm: function() {
    document.addEventListener(
      'DOMContentLoaded',
      function() {
        this.inputDate.value = utils.getTimeZoneAwareIsoString(new Date())
        this.inputBeginTime.value = utils.formatTime(new Date())
        this.inputEndTime.value = utils.formatTime(new Date())
      }.bind(this)
    )
  },
  bindAddRecord: function(addRecordHandler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      // Auto Populate

      var record = {}
      record.date = this.inputDate.value
      record.timeBegin = this.inputBeginTime.value
      record.timeEnd = this.inputEndTime.value

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
