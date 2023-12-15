import { WEBSITE_URL } from "../constants";

document.addEventListener("DOMContentLoaded", function () {
  // const WEBSITE_URL = "https://rupakacharya.com.np";
  sendMessage("getdate");

  chrome.runtime.onMessage.addListener((data, sender) => {
    // console.log("message & data from backround js: ", data);

    if (!data.data) {
      return errorUI();
    }

    changeUI(data.data);
  });

  var div = document.querySelector(".main-div");
  var ghp;
  ghp = document.querySelector(".svg-div svg");
  ghp.addEventListener("click", (event) => {
    createTab(WEBSITE_URL);
  });

  function createTab(url) {
    chrome.tabs.create({ url });
  }

  function createElement(
    tagName,
    className,
    text,
    childElements,
    cssProperties
  ) {
    var e = document.createElement(tagName);
    if (className !== "") e.classList.add(className);
    if (text !== "") e.appendChild(document.createTextNode(text));
    if (childElements.length > 0) {
      childElements.forEach((child) => {
        e.appendChild(child);
      });
    }
    Object.keys(cssProperties).forEach((key) => {
      e.style[key] = cssProperties[key];
    });
    return e;
  }

  function errorUI() {
    while (div.firstChild) {
      div.removeChild(div.lastChild);
    }
    var errorMsg =
      "Sorry, some error occured! Make sure you are connected to the Internet!";
    var iElement = createElement("i", "", errorMsg, [], { color: "white" });
    var pElement = createElement("p", "", "", [iElement], {});
    div.appendChild(pElement);
  }

  function changeUI(data) {
    while (div.firstChild) {
      div.removeChild(div.lastChild);
    }

    var spanElement1 = createElement("span", "year", data.year, [], {});
    var spanElement2 = createElement("span", "month", data.month, [], {});
    var pElement = createElement(
      "p",
      "year-month",
      "",
      [spanElement1, spanElement2],
      {}
    );
    div.appendChild(pElement);

    pElement = createElement("p", "date", data.date, [], {});
    div.appendChild(pElement);

    pElement = createElement("p", "day", data.day, [], {});
    div.appendChild(pElement);

    pElement = createElement("p", "tithi", data.tithi, [], {});
    div.appendChild(pElement);

    pElement = createElement("p", "event", data.event || "--", [], {});
    div.appendChild(pElement);
  }
});

function sendMessage(data) {
  chrome.runtime.sendMessage({
    msg: data,
  });
}
