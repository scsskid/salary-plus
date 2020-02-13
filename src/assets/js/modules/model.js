import sampleData from './../../../data/sample-data.js'
import utils from '../utils.js'
function Model() {
  this.records = JSON.parse(localStorage.getItem('appData')) || []
}

Model.prototype = {
  /**
   *
   * @param {Object} records
   */

  _commitRecords: function(records) {
    this.onRecordsListChanged(records)
    localStorage.setItem('appData', JSON.stringify(records))
  },

  /**
   *
   * @param {int} id
   */
  getRecordById: function(id) {
    var requestedRecord = this.records.filter(function recordIdMatches(record) {
      return record.id == id
    })[0]

    return requestedRecord
  },

  editRecord: function(submittedRecord) {
    console.log('model editR', submittedRecord)

    submittedRecord = utils.sanitizeRecordEndDate(submittedRecord)

    this.records.filter(function(record) {
      if (record.id == submittedRecord.id) {
        record.begin = `${submittedRecord.date} ${submittedRecord.timeBegin}`
        record.end = `${submittedRecord.dateEnd} ${submittedRecord.timeEnd}`
      }
      return record
    })
    this._commitRecords(this.records)
  },

  addRecord: function(submittedRecord) {
    submittedRecord = utils.sanitizeRecordEndDate(submittedRecord)

    var newRecord = {
      // todo: get max id with reduce()?
      id: this.records.length > 0 ? this.records[this.records.length - 1].id + 1 : 1,
      rate_id: 1,
      begin: `${submittedRecord.date} ${submittedRecord.timeBegin}`,
      end: `${submittedRecord.dateEnd} ${submittedRecord.timeEnd}`
    }
    this.records.push(newRecord)
    this._commitRecords(this.records)
  },

  deleteRecord: function(id) {
    this.records = this.records.filter(function deleteRecord(record) {
      return record.id != id
    })
    this._commitRecords(this.records)
  },
  bindRecordsListChanged: function(callback) {
    this.onRecordsListChanged = callback
  },
  seedRecords: function() {
    this.records = sampleData.records
    this._commitRecords(sampleData.records)
  }
}

export default Model
