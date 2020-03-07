export default [
  // ? idea: possibly extend with modules for other areas than main;
  // ? e.g.:  modules: [ { container: this.header, file: 'special-header.js', state: { displaySth: true } }, { container: this.mainView, file: 'records-list.js' } ]
  {
    path: '/',
    moduleFile: 'home.js',
    data: { displayRecords: false }
  },
  // ? combine /records and /records/:recordsId
  {
    path: '/records',
    moduleFile: 'records-list.js'
  },
  {
    path: '/records/new',
    moduleFile: 'record-form.js'
  },
  {
    path: '/records/:recordId',
    moduleFile: 'record.js'
  },
  {
    path: '/records/:recordId/:mode',
    moduleFile: 'record-form.js'
  },
  {
    path: '/settings',
    moduleFile: 'settings.js'
  }
]
