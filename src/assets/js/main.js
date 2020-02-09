import storage from "./storage-functions.js";
import appSettings from "./app-settings.js";
import sampleData from "./../../data/sample-data.js";

if (!storage.getData()) {
  storage.setData(sampleData);
}

var data = storage.getData();

console.log(data.records);

// var firstRecordBeginDate = new Date(data.records[0].begin);
// console.log(firstRecordBeginDate.toLocaleString("de-DE"));

if (!data) {
} else {
  var dataListSection = document.querySelector(".data-list");
  var dataList = document.createElement("ul");

  dataListSection.appendChild(dataList);

  data.records.forEach(function insertEntriesToDom(record) {
    // console.log(record);
    // Todo: Refactor DateFmt to Helper
    var markup = `
      <li class="">
        <p><b>${record.id}</b>:
        
        ${new Date(record.begin).toLocaleDateString(
          undefined,
          appSettings.dateFormatOptions
        )}
        - ${new Date(record.end).toLocaleDateString(
          undefined,
          appSettings.dateFormatOptions
        )}</p>
      </li>
    `;
    dataList.insertAdjacentHTML("beforeEnd", markup);
  });
}
