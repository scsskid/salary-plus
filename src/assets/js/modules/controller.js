export default function Controller(model, view) {
  this.model = model
  this.view = view

  this.init = function() {
    this.onRecordsListChanged(this.model.records)
  }

  this.handleAddRecord = record => {
    this.model.addRecord(record)
  }

  this.handleDeleteRecord = id => {
    this.model.deleteRecord(id)
  }

  this.onRecordsListChanged = records => {
    this.view.displayRecords(records)
  }

  this.model.bindRecordsListChanged(this.onRecordsListChanged)
  this.view.bindAddRecord(this.handleAddRecord)
  this.view.bindDeleteRecord(this.handleDeleteRecord)
}
