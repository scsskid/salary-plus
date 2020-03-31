export default [
  // ? idea: possibly extend with modules for other areas than main;
  // ? e.g.:  modules: [ { container: this.header, file: 'special-header.js', state: { displaySth: true } }, { container: this.mainView, file: 'records-list.js' } ]
  {
    path: '/',
    moduleName: 'Home',
    title: 'Overview'
  },
  // ? combine /records and /records/:recordsId
  {
    path: '/records',
    moduleName: 'RecordsList',
    title: 'Records List'
  },
  {
    path: '/records/new',
    moduleName: 'RecordForm',
    title: 'New Record'
  },
  {
    path: '/records/:recordId',
    moduleName: 'RecordForm',
    title: 'Edit Record'
  },
  {
    path: '/settings',
    moduleName: 'Settings',
    title: 'Settings'
  },
  {
    path: '/debug',
    moduleName: 'Debug',
    title: 'Debug'
  }
]
