import sampleData from './../../data/sample-data.js'

function Model() {
  this.records = []
  //  SEED
  this.records = sampleData.records

  this.addRecord = function(obj) {
    this.records.push({
      // todo: get max id with reduce()?
      id: this.records.length > 0 ? this.records[this.records.length - 1].id + 1 : 1,
      rate_id: 1,
      begin: obj.begin,
      end: obj.end
    })

    this.onRecordsListChanged(this.records)
  }

  this.editRecord = {}

  this.deleteRecord = function(id) {
    console.log('executing app.model.deleteRecord', id)

    this.records = this.records.filter(function deleteRecord(record) {
      console.log(typeof record.id)
      return record.id != id
    })
    console.log(this.records)
    this.onRecordsListChanged(this.records)
  }

  this.bindRecordsListChanged = function(callback) {
    this.onRecordsListChanged = callback
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
      this.recordsSection.append((document.createElement('p').textContent = 'records are empty, add record?'))
    } else {
      records.forEach(record => {
        var li = document.createElement('li')
        li.id = 'record-' + record.id
        li.dataset.id = record.id

        li.innerHTML = `
          Record #${record.id} - Begin: ${record.begin} <button class="record-delete">X</button>
        `
        this.recordsList.append(li)
      })
    }
  }

  this.bindAddRecord = function(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      var inputBeginDate = this.form.querySelector('#entry-begin-date')
      var inputBeginTime = this.form.querySelector('#entry-begin-time')
      var inputEndDate = this.form.querySelector('#entry-end-date')
      var inputEndTime = this.form.querySelector('#entry-end-time')

      var record = {}
      record.begin = `${inputBeginDate.value} ${inputBeginTime.value}`
      record.end = `${inputEndDate.value} ${inputEndTime.value}`

      // Todo pass form data to handler fn
      handler(record)
    })
  }

  this.bindDeleteRecord = function(handler) {
    this.recordsList.addEventListener('click', function handleEvent(event) {
      if (event.target.className == 'record-delete') {
        console.log('calling handler for click on records list event if is button: ', handler)
      }

      handler(event.target.parentElement.dataset.id)
    })
  }
}

function Controller(model, view) {
  this.model = model
  this.view = view

  this.init = function() {
    this.onRecordsListChanged(this.model.records)
    // this.view.displayRecords(this.model.records)
  }

  this.handleAddRecord = record => {
    console.log('executing app.handleAddRecord')

    this.model.addRecord(record)
  }

  this.handleDeleteRecord = id => {
    console.log('executing app.deleteRecord')

    this.model.deleteRecord(id)
  }

  this.onRecordsListChanged = records => {
    console.log('executing app.onRecordslistChanged')

    this.view.displayRecords(records)
  }

  this.model.bindRecordsListChanged(this.onRecordsListChanged)

  // Bind Evenet Listeners To Handlers
  this.view.bindAddRecord(this.handleAddRecord)
  this.view.bindDeleteRecord(this.handleDeleteRecord)
}

var app = new Controller(new Model(), new View())

app.init()

window.app = app
