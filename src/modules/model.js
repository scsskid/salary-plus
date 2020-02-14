import sampleData from './../../../data/sample-data.js'
import utils from './utils.js'
function Model() {
  this._init()
}

Model.prototype = {
  /**
   * Set state to store, seed data if store is emtpy
   */
  _init: function() {
    this.state = JSON.parse(localStorage.getItem('store')) || undefined

    if (!this.state) {
      this.state = sampleData

      localStorage.setItem('store', JSON.stringify(this.state))
    }
  },
  _commitState: function(state) {
    // ? pass indicator of whats changed, and only update necessary components?
    this.onRecordsListChanged(state)
    localStorage.setItem('store', JSON.stringify(this.state))
    console.log('saved data to store.', this.state)
  },

  updateUserSettings: function(user) {
    this.state.user = user
    this._commitState(this.state)
    console.log('model.setusersettings')
  },

  bindUserSettingsChanged: function(callback) {
    this.onUserDataChanged = callback
  },

  getRecordById: function(id) {
    var requestedRecord = this.state.records.filter(function recordIdMatches(record) {
      return record.id == id
    })[0]

    return requestedRecord
  },

  editRecord: function(submittedRecord) {
    submittedRecord = utils.sanitizeRecordEndDate(submittedRecord)

    this.state.records.filter(function(record) {
      if (record.id == submittedRecord.id) {
        record.begin = `${submittedRecord.date} ${submittedRecord.timeBegin}`
        record.end = `${submittedRecord.dateEnd} ${submittedRecord.timeEnd}`
      }
      return record
    })
    this._commitState(this.state)
  },

  addRecord: function(submittedRecord) {
    submittedRecord = utils.sanitizeRecordEndDate(submittedRecord)

    var newRecord = {
      // todo: get max id with reduce()?
      id: this.state.records.length > 0 ? this.state.records[this.state.records.length - 1].id + 1 : 1,
      jobId: 1,
      begin: `${submittedRecord.date} ${submittedRecord.timeBegin}`,
      end: `${submittedRecord.dateEnd} ${submittedRecord.timeEnd}`
    }
    this.state.records.push(newRecord)
    this._commitState(this.state)
  },

  deleteRecord: function(id) {
    var remainingRecords = this.state.records.filter(function deleteRecord(record) {
      return record.id != id
    })

    this.state.records = remainingRecords
    this._commitState(this.state)
  },
  bindRecordsListChanged: function(callback) {
    this.onRecordsListChanged = callback
  },

  seedRecords: function() {
    this.state.records = sampleData.records
    this._commitState(this.state)
  }
}

export default Model
