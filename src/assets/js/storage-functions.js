var helpers = {};

helpers.setData = function(data) {
  localStorage.setItem("appData", JSON.stringify(data));
};

helpers.getData = function() {
  return JSON.parse(localStorage.getItem("appData"));
};

export default helpers;
