let form = document.querySelector("#ext-form");
let selector = document.querySelector("#extActive");
let inp = document.querySelector("#monthlyNetWage");
let workingHours = document.querySelector('#weeklyWorkingHours')

chrome.storage.local.get(
  ["monthlyNetWage", "extensionActive", "workingHours"],
  async result => {
    inp.value = result.monthlyNetWage || "";
    selector.value = result.extensionActive || true;
    workingHours.value = result.workingHours || 40;
  }
);

form.addEventListener("submit", event => {
  chrome.storage.local.set(
    { monthlyNetWage: inp.value, extensionActive: selector.value, workingHours: workingHours.value || 40 },
    function() {}
  );
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
  });
  window.close();
});
