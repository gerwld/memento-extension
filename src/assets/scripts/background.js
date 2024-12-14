//   - This file is part of Memento Extension
//  <https://github.com/gerwld/Memento-extension/blob/main/README.md>,
//   - Copyright (C) 2023-present Memento Extension
//   -
//   - Memento Extension is a software: you can redistribute it and modify it under the terms of the MIT License.
//   -
//   - Memento Extension is distributed in the hope that it will be useful,
//   - but WITHOUT ANY WARRANTY; without even the implied warranty of
//   - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   - MIT License for more details.
//   -
//   - You should have received a copy of the MIT License
//   - along with Memento Extension.  If not, see <https://opensource.org/licenses/MIT>.



const initialState = {
  disabled: false,
  dark_mode: true,
  focus_mode: true,
  font: "montserrat",
  timestamp: Date.now()
};

const browser_cr = chrome ? chrome : browser;

function initStateIfNotExist() {
  browser_cr.storage?.local?.get("formState", (result) => {
    if (!result.formState || Object.keys(result.formState).length === 0) browser_cr.storage.local.set({ formState: { ...initialState } });
  });
}

initStateIfNotExist();

if (!chrome)
  chrome = browser;

browser_cr.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.storage.local.get('welcomePageDisplayed', function (data) {
      if (!data.welcomePageDisplayed && details.reason === 'install') {
        // chrome.tabs.create({ url: "https://weblxapplications.com/sp/welcome" });
        chrome.storage.local.set({ 'welcomePageDisplayed': true });
      } else if (details.reason === 'update') {
        // chrome.tabs.create({ url: "https://weblxapplications.com/sp/update" });
      }
    });
  }
});


// browser_cr.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScGXGlaC1KUSji5XzrVtB7PpRdoBbmRhoEVig1BPPrUY2ShKg/viewform?usp=sf_link");
