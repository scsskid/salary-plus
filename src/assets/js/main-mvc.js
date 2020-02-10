import sampleData from './../../data/sample-data.js'

function Model() {
  this.records = sampleData.records

  this.addRecord = function(obj) {
    this.records.push({
      // todo: get max id with reduce()?
      id: this.records.length > 0 ? this.records[this.records.length - 1].id + 1 : 1,
      rate_id: 1,
      begin: obj.begin,
      end: obj.end
    })
  }

  this.editRecord = {}

  this.deleteRecord = function(id) {
    this.records = this.records.filter(function deleteRecord(record) {
      return record.id !== id
    })
  }

  this.bindRecordsListChanged = function(callback) {}
}

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
      this.recordsSection.append(document.createElement('p').textContent('records are empty, add record?'))
    } else {
      records.forEach(record => {
        var li = document.createElement('li')
        li.id = 'record-' + record.id

        li.innerHTML = `
          Record #${record.id} - Begin: ${record.begin} <button class="record-delete">X</button>
        `
        this.recordsList.append(li)
      })
    }
  }

  this.bindAddRecord = function(handler) {
    this.form.addEventListener('submit', function handleEvent(event) {
      event.preventDefault()
      console.log('calling handler for form submit event: ', handler)
      // handler( {newRecordObj} )
    })
  }

  this.bindDeleteRecord = function(handler) {
    this.recordsList.addEventListener('click', function handleEvent(event) {
      if (event.target.className == 'record-delete') {
        console.log('calling handler for click on records list event if is button: ', handler)
      }

      // handler( {newRecordObj} )
    })
  }
}

function Controller(model, view) {
  this.model = model
  this.view = view

  this.init = function() {
    // this.onRecordsListChanged(this.model.records)
    this.view.displayRecords(this.model.records)
  }

  this.handleAddRecord = function(record) {
    this.model.addRecord(record)
  }

  this.handleDeleteRecord = function(id) {
    this.model.deleteRecord(id)
  }

  this.onRecordsListChanged = function(records) {
    this.view.displayRecords(records)
  }

  // Bind Evenet Listeners To Handlers
  this.view.bindAddRecord(this.handleAddRecord)
  this.view.bindDeleteRecord(this.handleDeleteRecord)
}

var app = new Controller(new Model(), new View())

app.init()

window.app = app
