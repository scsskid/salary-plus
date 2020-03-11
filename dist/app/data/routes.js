export default [
  // ? idea: possibly extend with modules for other areas than main;
  // ? e.g.:  modules: [ { container: this.header, file: 'special-header.js', state: { displaySth: true } }, { container: this.mainView, file: 'records-list.js' } ]
  {
    path: '/',
    module: 'Home',
    params: { displayRecords: false }
  },
  // ? combine /records and /records/:recordsId
  {
    path: '/records',
    module: 'RecordsList'
  },
  {
    path: '/records/new',
    module: 'RecordForm'
  },
  {
    path: '/records/:recordId',
    module: 'RecordSingle'
  },
  {
    path: '/records/:recordId/:mode',
    module: 'RecordForm'
  },
  {
    path: '/settings',
    module: 'Settings'
  },
  {
    path: '/debug',
    module: 'Debug'
  }
]
