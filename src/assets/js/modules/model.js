import sampleData from './../../../data/sample-data.js'
import utils from '../utils.js'
function Model() {
  this.records = JSON.parse(localStorage.getItem('appData')) || []
}

Model.prototype = {
  _commitRecords: function(records) {
    this.onRecordsListChanged(records)
    localStorage.setItem('appData', JSON.stringify(records))
  },
  /**
   * if timeBegin is gt timeEnd assuming endDate to be next day
   * @param {Object} record
   */
  _sanitizeRecordEndDate: function todo(record) {
    if (record.timeBegin <= record.timeEnd) {
      record.dateEnd = record.date
    } else {
      var recordedDate = new Date(record.date)
      var recordedDay = recordedDate.getDate()
      recordedDate.setDate(recordedDay + 1)
      record.dateEnd = utils.getTimeZoneAwareIsoString(recordedDate)
    }
    return record
  },
  getRecordById: function(id) {
    var requestedRecord = this.records.filter(
      function recordIdMatches(record) {
        return record.id == id
      }.bind(this)
    )
    return requestedRecord
  },

  editRecord: function(submittedRecord) {
    submittedRecord = this._sanitizeRecordEndDate(submittedRecord)

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
    submittedRecord = this._sanitizeRecordEndDate(submittedRecord)

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
