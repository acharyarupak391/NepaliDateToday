import { API_URL } from "./constants";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // console.log('tab updated/created')
  getDate();
});

chrome.tabs.onRemoved.addListener(async (tabId, changeInfo, tab) => {
  // console.log('tab removed')
  getDate();
});

chrome.windows.onCreated.addListener(async (win) => {
  // console.log('window created')
  getDate();
});

function sendMessage(win) {
  chrome.runtime.sendMessage({
    msg: "message from background.js to popup.js",
    data: win,
  });
}

async function fetch_data() {
  const url = `${API_URL}/api`;
  return fetch(url)
    .then((res) => res.json())
    .then(async (data) => {
      return await create_cookie(data);
    })
    .catch((err) => console.log("err: ", err));
}

async function create_cookie(data) {
  const date_arr = new Date().toString().split(" ");
  const expiryDateInt = new Date(
    date_arr[2] + " " + date_arr[1] + " " + date_arr[3] + " 23:59:59 GMT+0545"
  ).getTime();
  // expiryDateInt = new Date().getTime() + 20*1000

  let _data = await chrome.cookies.set({
    url: `${API_URL}`,
    name: "nepalidate",
    value: JSON.stringify(data),
    expirationDate: expiryDateInt,
  });

  return _data;
}

async function getDate() {
  let cookie = await chrome.cookies.get({
    url: `${API_URL}`,
    name: "nepalidate",
  });

  if (!cookie || cookie.expirationDate < new Date().getTime()) {
    const apiData = await fetch_data();
    return apiData;
  }

  return cookie;
}

chrome.runtime.onMessage.addListener(async (data, sender) => {
  if (data.msg == "getdate") {
    let d = await getDate();
    sendMessage(JSON.parse(d.value));
  }
});
