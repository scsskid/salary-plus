export default function Controller(model, view) {
  console.log('here')
  this.initLog = function() {
    console.log('init Log func')
  }

  this.model = model
  this.view = view

  this.init()

  this.model.bindRecordsListChanged(this.onRecordsListChanged.bind(this))
  this.view.bindAddRecord(this.handleAddRecord.bind(this))
  this.view.bindDeleteRecord(this.handleDeleteRecord.bind(this))
}

Controller.prototype = {
  init: function() {
    this.onRecordsListChanged(this.model.records)
    this.initLog()
  },
  onRecordsListChanged: function(records) {
    this.view.displayRecords(records)
  },
  handleAddRecord: function(record) {
    this.model.addRecord(record)
  },
  handleDeleteRecord: function(id) {
    this.model.deleteRecord(id)
  }
}
