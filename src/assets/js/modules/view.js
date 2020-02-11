import utils from './../helpers.js'
function View() {
  this.recordsSection = document.querySelector('[data-records]')
  this.recordsList = document.createElement('ul')
  this.recordsList.classList.add('records-list')
  this.recordsSection.append(this.recordsList)
  this.form = document.querySelector('.data-insert form')

  this.displayRecords = function(records) {
    // Empty Records List
    while (this.recordsList.firstChild) {
      this.recordsList.removeChild(this.recordsList.firstChild)
    }

    // Insert Records to Dom
    if (records.length == 0) {
      this.recordsSection.append((document.createElement('p').textContent = 'records are empty, add record?'))
    } else {
      records.forEach(record => {
        var li = document.createElement('li')
        li.id = 'record-' + record.id
        li.dataset.id = record.id
        li.innerHTML = `
          ${utils.formatDate.short(record.begin)} ( ${utils.formatTime(record.begin)} - ${utils.formatTime(record.end)} ) <button class="record-delete">X</button>
        `
        this.recordsList.append(li)
      })
    }
  }
}

View.prototype = {
  bindAddRecord: function(addRecordHandler) {
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
