let hourly = 0;
let hrString = "hr";

const sites = {
  "arukereso.hu": manipulateArukereso,
  "alza.hu": manipulateAlza,
  "edigital.hu": manipulateEdigitalHu
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
  const prices = document.querySelectorAll("a.price, .item a.name span");
  const prices3 = document.querySelectorAll(
    'span[itemprop="price"], div.price, span.price, div[itemprop="offers"] a span'
  );

  prices.forEach(item => {
    let price = parseInt(
      item.innerText
        .split("Ft-tól")[0]
        .trim()
        .split(" ")
        .join("")
    );
    let hour = parseFloat(price / hourly).toFixed(1);
    item.innerText = `${hour} ${hrString}`;
  });

  prices3.forEach(item => {
    changeNormalPrice(item);
  });
}

function manipulateAlza() {
  // MAIN PAGE
  let priceCenter = document.querySelectorAll(".priceCenter");
  let prices = [];

  priceCenter.forEach(item => {
    prices.push(item.querySelector(".c1"));
  });

  prices.forEach(item => {
    changeNormalPrice(item);
  });

  // PRODUCT PAGE
  let prices2 = document.querySelectorAll(
    "span.price_withVat, span.price_withoutVat, span.price"
  );
  prices2.forEach(item => {
    changeNormalPrice(item);
  });

  // PRODUCT LIST
  let prices3 = document.querySelectorAll(".priceInner .c2, .b32");
  prices3.forEach(item => {
    changeNormalPrice(item);
  });
}

// istyle updated their design
// TODO

// function manipulateIstyleEu() {
//   // PRODUCT PAGE
//   const prices = document.querySelectorAll(
//     'span[itemprop="price"], span.price span'
//   );
//   const prices2 = document.querySelectorAll(".price-wrapper .updated");

//   prices.forEach(item => {
//     changeNormalPrice(item);
//   });

//   prices2.forEach(item => {
//     let price = parseInt(
//       item.innerText
//         .split("Ft")
//         .join("")
//         .split("Price from:")
//         .join("")
//         .trim()
//         .split(/\s+/)
//         .join("")
//     );
//     let hour = parseFloat(price / hourly).toFixed(1);
//     item.innerText = `${hour} ${hrString}`;
//   });
// }

function manipulateEdigitalHu() {
  // PRODUCT PAGE
  let mainPriceItems = document.querySelectorAll("strong.price");

  mainPriceItems.forEach(item => {
    let price = parseInt(item.getAttribute("content"));
    let hour = parseFloat(price / hourly).toFixed(1);
    item.innerText = `${hour} ${hrString}`;
  });

  // MAIN PAGE AND OTHER LISTINGS
  let prices = document.querySelectorAll("span.price");

  prices.forEach(item => {
    changeNormalPrice(item);
  });
}

// HELPER FUNCTIONS

// function for common price display usage, eg: '10000 Ft'
function changeNormalPrice(item) {
  let price = parseInt(
    item.innerText
      .split("Ft")
      .join("")
      .trim()
      .split(/\s+/)
      .join("")
  );
  let hour = parseFloat(price / hourly).toFixed(1);
  item.innerText = `${hour} ${hrString}`;
}

// just a setTimeout wrapper
function delayedRun(fn, delay) {
  setTimeout(() => {
    fn();
  }, delay);
}
