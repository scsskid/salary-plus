import utils from './utils.js'
function View() {
  this.recordsSection = document.querySelector('[data-records]')
  this.recordsList = document.createElement('ul')
  this.recordsList.classList.add('records-list')
  this.recordsSection.append(this.recordsList)

  this.editSection = document.querySelector('.data-modify')
  this.editSectionForm = this.editSection.querySelector('form')

  this.form = document.querySelector('.data-insert form')

  this.inputDate = this.form.querySelector('#entry-date')
  this.inputBeginTime = this.form.querySelector('#entry-begin-time')
  this.inputEndTime = this.form.querySelector('#entry-end-time')

  this.inputDate2 = this.editSection.querySelector('#entry-date2')
  this.inputBeginTime2 = this.editSection.querySelector('#entry-begin-time2')
  this.inputEndTime2 = this.editSection.querySelector('#entry-end-time2')
}

View.prototype = {
  displayUserName: function(userData) {
    console.log(userData.name)
  },
  /**
   * Display Records To Screen
   */

  displayRecords: function(records = []) {
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
          <button class="record-edit">Edit</button>
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

  /**
   *
   * @param {function} addRecordHandler
   */
  bindAddRecord: function(addRecordHandler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()
      var record = {}
      record.date = this.inputDate.value
      record.timeBegin = this.inputBeginTime.value
      record.timeEnd = this.inputEndTime.value

      addRecordHandler(record)
    })
  },
  // ? Combine Listeners delete and open?
  bindDeleteRecord: function(deleteRecordHandler) {
    this.recordsList.addEventListener('click', function handleEvent(event) {
      if (event.target.className == 'record-delete') {
        deleteRecordHandler(event.target.parentElement.dataset.id)
      }
    })
  },

  bindSaveRecord: function(saveRecordHandler, closeEditDialogHandler) {
    this.editSectionForm.addEventListener('submit', event => {
      event.preventDefault()
      var record = {}
      record.id = this.editSectionForm.dataset.recordId
      record.date = this.inputDate2.value
      record.timeBegin = this.inputBeginTime2.value
      record.timeEnd = this.inputEndTime2.value

      saveRecordHandler(record)
      closeEditDialogHandler()
    })
  },

  openEditDialog: function(record) {
    this.editSection.style.opacity = 1
    this.editSection.style.pointerEvents = 'all'

    this.editSectionForm.dataset.recordId = record.id
    this.inputDate2.value = utils.getDateFromIsoString(new Date(record.begin))
    this.inputBeginTime2.value = utils.formatTime(new Date(record.begin))
    this.inputEndTime2.value = utils.formatTime(new Date(record.end))
  },
  closeEditDialog: function() {
    this.editSection.style.opacity = 0.2
    this.editSection.style.pointerEvents = 'none'
    this.editSectionForm.reset()
  },
  /**
   *
   * @param {*} records
   */

  bindOpenEditDialog: function(handler) {
    // add listener to edit click

    this.recordsList.addEventListener('click', function handleEvent(event) {
      if (event.target.className == 'record-edit') {
        handler(event.target.parentElement.dataset.id)
      }
    })
  }
}

export default View
