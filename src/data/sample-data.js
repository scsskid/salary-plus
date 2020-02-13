var settingsDefault = {
  rate: 13.5,
  employer: 'Bundesnachrichtendienst & Söhne'
}

var user = {
  name: 'Anon',
  settings: settingsDefault
}

var records = [
  {
    id: 1,
    rate_id: 1,
    begin: '2020-01-30 16:00 UTC',
    end: '2020-01-30 22:00 UTC'
  },
  {
    id: 2,
    rate_id: 1,
    begin: '2020-01-31 16:00 UTC',
    end: '2020-02-01 01:00 UTC'
  },
  {
    id: 3,
    rate_id: 1,
    begin: '2020-02-01 12:00 UTC',
    end: '2020-02-01 22:00 UTC'
  },
  {
    id: 4,
    rate_id: 1,
    begin: '2020-02-02 11:00 UTC',
    end: '2020-02-02 15:00 UTC'
  }
]

var appData = {
  user,
  records
}

export default appData
