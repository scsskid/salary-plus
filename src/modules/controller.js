export default function Controller(model, view) {
  this.model = model
  this.view = view

  this.init()

  this.model.bindRecordsListChanged(this.onRecordsListChanged.bind(this))
  this.model.bindUserSettingsChanged(this.onUpdateUserSettings.bind(this))

  this.view.bindAddRecord(this.handleAddRecord.bind(this))
  this.view.bindDeleteRecord(this.handleDeleteRecord.bind(this))
  this.view.bindSeedRecords(this.handleSeedRecords.bind(this))

  this.view.bindOpenUserUpdateDialog(this.handleOpenUserUpdateDialog.bind(this))
  this.view.bindUpdateUserSettings(this.handleUpdateUserSettings.bind(this))

  this.view.bindOpenRecordUpdateDialog(this.handleOpenRecordUpdateDialog.bind(this))
  this.view.bindSaveRecord(this.handleSaveRecord.bind(this), this.handleCloseEditDialog.bind(this))
}

Controller.prototype = {
  init: function() {
    this.onRecordsListChanged(this.model.state)
    this.onUpdateUserSettings(this.model.state.user)
    this.view.populateForm()
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
  handleOpenRecordUpdateDialog: function(id) {
    this.view.openRecordUpdateDialog(this.getRecordById(id))
  },
  handleOpenUserUpdateDialog: function() {
    this.view.openUserUpdateDialog(this.model.state.user)
  },
  handleCloseEditDialog: function() {
    this.view.closeEditDialog()
  },
  handleSeedRecords: function() {
    this.model.seedRecords()
  },
  // Update User
  onUpdateUserSettings: function(userData) {
    this.view.displayUserName(userData)
    this.view.updateUserName(userData)
  },
  handleUpdateUserSettings: function(user) {
    this.model.updateUserSettings(user)
    this.view.updateUserName(user)
  }
}

Controller.prototype.logRecords = function() {
  this.model.records.forEach(function(record) {
    console.log(record)
  })
}

Controller.prototype.getRecordById = function(id) {
  return this.model.getRecordById(id)
}
