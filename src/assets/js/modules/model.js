import sampleData from './../../../data/sample-data.js'

function Model() {
  var seed = sampleData.records
  // var seed = []
  this.records = JSON.parse(localStorage.getItem('appData')) || seed
}

Model.prototype = {
  _commitRecord: function(records) {
    this.onRecordsListChanged(records)
    localStorage.setItem('appData', JSON.stringify(records))
  },
  addRecord: function(obj) {
    this.records.push({
      // todo: get max id with reduce()?
      id: this.records.length > 0 ? this.records[this.records.length - 1].id + 1 : 1,
      rate_id: 1,
      begin: obj.begin,
      end: obj.end
    })

    this._commitRecord(this.records)
  },
  editRecord: function(id) {},
  deleteRecord: function(id) {
    this.records = this.records.filter(function deleteRecord(record) {
      return record.id != id
    })
    this._commitRecord(this.records)
  },
  bindRecordsListChanged: function(callback) {
    this.onRecordsListChanged = callback
  }
}

export default Model
