var users = [
  {
    id: 1,
    name: "Benedikt",
    settings: {}
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

function setAppData(data) {
  localStorage.setItem("appData", JSON.stringify(data));
}

function getAppData() {
  return JSON.parse(localStorage.getItem("appData"));
}

console.log(getAppData());

var firstRecordBeginDate = new Date(records[0].begin);

// console.log(firstRecordBeginDate.toLocaleString("de-DE"));

// Logging

function logEntries(data) {
  data.forEach(function log(entry) {
    console.log(entry);
  });
}
