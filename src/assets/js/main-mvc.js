import sampleData from './../../data/sample-data.js'

var app

function Model() {
  this.records = sampleData.records

  this.addRecord = function(obj) {
    this.records.push({
      // todo: get max id via reduce?
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
      records.forEach(function insertRecordToDom(record) {
        var li = document.createElement('li')
        li.id = 'record-' + record.id

        li.innerHTML = `Record #${record.id} - Begin: ${record.begin}`
        this.recordsList.append(li)
      })
    }
  }
}

function Controller(model, view) {
  this.model = model
  this.view = view

  this.handleAddRecord = function(record) {
    this.model.addRecord(record)
  }

  this.handleDeleteRecord = function(id) {
    this.model.deleteRecord(id)
  }
}

app = new Controller(new Model(), new View())

window.app = app

// console.log(app.model.records)
