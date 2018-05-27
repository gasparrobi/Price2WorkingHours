let hourly = 0;
let hrString = "hr";

const sites = {
  "arukereso.hu": manipulateArukereso,
  "alza.hu": manipulateAlza,
  "edigital.hu": manipulateEdigitalHu,
  "220volt.hu": manipulate220volt
};

// get user data,
// calculate hourly rate
// check if current site is supported
chrome.storage.local.get(
  ["monthlyNetWage", "extensionActive", "workingHours"],
  async result => {
    if (result.monthlyNetWage > 0 && result.extensionActive === "true") {
      hourly = await parseInt(
        result.monthlyNetWage / (result.workingHours * 4)
      );
      window.onload = function() {
        let url = window.location.href;

        Object.keys(sites).forEach(key => {
          if (url.indexOf(key) > -1) {
            delayedRun(sites[key], 2000);
          }
        });
      };
    }
  }
);

function manipulateArukereso() {
  let selectors =
    'span[itemprop="price"], div.price, span.price, div[itemprop="offers"] a span';

  changeNormalPrice(selectors);

  const prices = document.querySelectorAll("a.price, .item a.name span");
  prices.forEach(item => {
    let price = parseInt(
      item.innerText
        .split("Ft-tól")[0]
        .trim()
        .split(" ")
        .join("")
    );
    let hour = parseFloat(price / hourly).toFixed(1);
    displayPrice(item, hour);
  });
}

function manipulateAlza() {
  // PRODUCT PAGE
  let selectors =
    "span.price_withVat, span.price_withoutVat, span.price, .priceInner .c2, .b32";
  changeNormalPrice(selectors);

  // MAIN PAGE
  let priceCenter = document.querySelectorAll(".priceCenter");
  let prices = [];

  priceCenter.forEach(item => {
    prices.push(item.querySelector(".c1"));
  });

  prices.forEach(item => {
    let price = parseInt(
      origText
        .split("Ft")
        .join("")
        .trim()
        .split(/\s+/)
        .join("")
    );
    let hour = parseFloat(price / hourly).toFixed(1);
    displayPrice(item, hour);
  });
}

function manipulateEdigitalHu() {
  // PRODUCT PAGE
  let mainPriceItems = document.querySelectorAll("strong.price");

  mainPriceItems.forEach(item => {
    let price = parseInt(item.getAttribute("content"));
    let hour = parseFloat(price / hourly).toFixed(1);
    displayPrice(item, hour);
  });

  // MAIN PAGE AND OTHER LISTINGS
  let selectors = "span.price";
  changeNormalPrice(selectors);
}

function manipulate220volt() {
  let selectors = "span.price_small, div.price, span.price";
  changeNormalPrice(selectors);
}

// HELPER FUNCTIONS

/**
 * function for common price display usage, eg: '10000 Ft'
 *
 * @param {string} selectors list of selectors divided by comma
 */
function changeNormalPrice(selectors) {
  let items = document.querySelectorAll(selectors);

  items.forEach(item => {
    let price = parseInt(
      item.innerText
        .split("Ft")
        .join("")
        .trim()
        .split(/\s+/)
        .join("")
    );
    let hour = parseFloat(price / hourly).toFixed(1);
    displayPrice(item, hour);
  });
}

/**
 * wrapper for delaying function execution,
 *
 * @param {function} fn function to be executed
 * @param {number} delay delay in milliseconds
 */
function delayedRun(fn, delay) {
  setTimeout(() => {
    fn();
  }, delay);
}

/**
 * displaying price in working hours while preserving original price
 *
 * @param {DOM Element} item
 * @param {number} hour
 */
function displayPrice(item, hour) {
  item.innerHTML = `${hour} ${hrString} <small style="font-size: 12px">(${
    item.innerText
  })</small>`;
}
