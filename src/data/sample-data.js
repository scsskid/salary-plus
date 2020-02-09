var users = [
  {
    id: 1,
    name: "Benedikt",
    settings: {
      defaultRate: 1,
      defaultEmployer: 1
    }
  }
];

var rates = [
  {
    id: 1,
    amount: 13.5,
    interval: "hourly"
  }
];

var employers = [
  {
    id: 1,
    name: "Bundesnachrichtendienst"
  },
  {
    id: 2,
    name: "Palsta"
  }
];

var records = [
  {
    id: 1,
    rate_id: 1,
    begin: "2020-01-30 16:00 UTC",
    end: "2020-01-30 22:00 UTC"
  },
  {
    id: 2,
    rate_id: 1,
    begin: "2020-01-31 12:00 UTC",
    end: "2020-01-31 22:00 UTC"
  },
  {
    id: 3,
    rate_id: 1,
    begin: "2020-02-01 12:00 UTC",
    end: "2020-02-01 22:00 UTC"
  }
];

var appData = {
  users,
  rates,
  employers,
  records
};

export default appData;
