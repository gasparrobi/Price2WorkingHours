let form = document.querySelector("#ext-form");
let selector = document.querySelector("#extActive");
let inp = document.querySelector("#monthlyNetWage");

chrome.storage.local.get(
  ["monthlyNetWage", "extensionActive"],
  async result => {
    inp.value = result.monthlyNetWage || "";
    selector.value = result.extensionActive || true;
  }
);

form.addEventListener("submit", event => {
  chrome.storage.local.set(
    { monthlyNetWage: inp.value, extensionActive: selector.value },
    function() {}
  );
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
  });
  window.close();
});
