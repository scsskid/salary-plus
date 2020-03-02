var settingsDefault = {
  defaultRateID: 1,
  defaultjobID: 1
}

// var users = [
//   {
//     id: 1,
//     name: 'Benedikt',
//     settings: {
//       defaultRateId: 1,
//       defaultjobId: 1
//     }
//   }
// ]

var appData = {
  app: {
    version: '0.0.1'
  },
  user: {
    name: 'Anonymous',
    settings: settingsDefault
  },
  records: [
    {
      id: 1,
      jobId: 1,
      begin: '2019-12-21T13:30:00.000Z',
      end: '2019-12-22T01:00:00.000Z'
    },
    {
      id: 2,
      jobId: 1,
      begin: '2020-02-10T13:30:00.000Z',
      end: '2020-02-10T22:00:00.000Z'
    },
    {
      id: 3,
      jobId: 2,
      begin: '2020-02-14T15:30:00.000Z',
      end: '2020-02-15T00:00:00.000Z'
    },
    {
      id: 4,
      jobId: 1,
      begin: '2020-02-10T14:30:00.000Z',
      end: '2020-02-10T22:22:00.000Z'
    }
  ],
  jobs: [
    {
      id: 1,
      name: 'Bundesnachrichtendienst',
      rate: 88.5,
      interval: 'hourly'
    },
    {
      id: 2,
      name: 'Palsta',
      rate: 13.5,
      interval: 'hourly'
    }
  ]
}

export default appData
