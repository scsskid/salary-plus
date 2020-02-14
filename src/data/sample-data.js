var settingsDefault = {
  defaultRateID: 1,
  defaultjobID: 1
}

var users = [
  {
    id: 1,
    name: 'Benedikt',
    settings: {
      defaultRateId: 1,
      defaultjobId: 1
    }
  }
]

var appData = {
  user: {
    name: 'Laser Ears',
    settings: settingsDefault
  },
  records: [
    {
      id: 1,
      jobId: 1,
      begin: '2020-01-30 16:00 UTC',
      end: '2020-01-30 22:00 UTC'
    },
    {
      id: 2,
      jobId: 1,
      begin: '2020-01-31 16:00 UTC',
      end: '2020-02-01 01:00 UTC'
    },
    {
      id: 3,
      jobId: 2,
      begin: '2020-02-01 12:00 UTC',
      end: '2020-02-01 22:00 UTC'
    },
    {
      id: 4,
      jobId: 1,
      begin: '2020-02-02 11:00 UTC',
      end: '2020-02-02 15:00 UTC'
    }
  ],
  jobs: [
    {
      id: 1,
      name: 'Bundesnachrichtendienst',
      rate: 8.5,
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
