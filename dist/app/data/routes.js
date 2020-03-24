export default [
  // ? idea: possibly extend with modules for other areas than main;
  // ? e.g.:  modules: [ { container: this.header, file: 'special-header.js', state: { displaySth: true } }, { container: this.mainView, file: 'records-list.js' } ]
  {
    path: '/',
    moduleName: 'Home'
  },
  // ? combine /records and /records/:recordsId
  {
    path: '/records',
    moduleName: 'RecordsList'
  },
  {
    path: '/records/new',
    moduleName: 'RecordForm'
  },
  {
    path: '/records/:recordId',
    moduleName: 'RecordForm'
  },
  {
    path: '/settings',
    moduleName: 'Settings'
  },
  {
    path: '/debug',
    moduleName: 'Debug'
  }
]
