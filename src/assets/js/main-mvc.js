import sampleData from './../../data/sample-data.js'

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

  this.deleteRecord = {}
}

function View() {}

function Controller(model, view) {
  this.model = model
  this.view = view
}

var app = new Controller(new Model(), new View())

console.log(app.model.records)
