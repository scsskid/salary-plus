export default function Controller(model, view) {
  this.model = model
  this.view = view

  this.init()

  this.model.bindRecordsListChanged(this.onRecordsListChanged.bind(this))
  this.model.bindUserDataChanged(this.onUserDataChanged.bind(this))

  this.view.bindAddRecord(this.handleAddRecord.bind(this))
  this.view.bindDeleteRecord(this.handleDeleteRecord.bind(this))
  this.view.bindSeedRecords(this.handleSeedRecords.bind(this))

  this.view.bindOpenEditDialog(this.handleOpenEditDialog.bind(this))
  this.view.bindSaveRecord(this.handleSaveRecord.bind(this), this.handleCloseEditDialog.bind(this))
}

Controller.prototype = {
  init: function() {
    this.onRecordsListChanged(this.model.state)
    this.onUserDataChanged(this.model.state.user)
    this.view.populateForm()
  },

  onUserDataChanged: function(userData) {
    this.view.displayUserName(userData)
  },

  onRecordsListChanged: function(records) {
    this.view.displayRecords(records)
  },
  handleAddRecord: function(record) {
    this.model.addRecord(record)
  },
  handleSaveRecord: function(record) {
    this.model.editRecord(record)
  },
  handleDeleteRecord: function(id) {
    this.model.deleteRecord(id)
  },
  handleOpenEditDialog: function(id) {
    this.view.openEditDialog(this.getRecordById(id))
  },
  handleCloseEditDialog: function() {
    this.view.closeEditDialog()
  },
  handleSeedRecords: function() {
    this.model.seedRecords()
  },
  /*
   * CLI *
   */
  logRecords: function() {
    this.model.records.forEach(function(record) {
      console.log(record)
    })
  },
  getRecordById: function(id) {
    return this.model.getRecordById(id)
  }
}
