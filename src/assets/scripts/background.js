//   - This file is part of Memento Extension
//  <https://github.com/gerwld/Memento-extension/blob/main/README.md>,
//   - Copyright (C) 2023-present Memento Extension
//   -
//   - Memento Extension is a software: you can redistribute it, but you are not allowed to modify it under the terms of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
//   -
//   - Memento Extension is distributed in the hope that it will be useful,
//   - but WITHOUT ANY WARRANTY; without even the implied warranty of
//   - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License for more details.
//   -
//   - You should have received a copy of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License
//   - along with Memento Extension.  If not, see <https://creativecommons.org/licenses/by-nc-nd/4.0/>.



let is12HourFormat = false; // Default fallback
try {
    is12HourFormat = new Date().toLocaleString('en', { hour: '2-digit', hour12: true }).indexOf(':') !== -1;
} catch (error) {
    console.warn('Error determining time format:', error);
}

const initialState = {
  disabled: false,
  background_type: "unsplash",
  time__hide_time: false,
  time__show_seconds: true,
  time__is_12_hours: is12HourFormat, 
  date__hide_date: false,
  background_blur: 5,
  background_brightness: 0.22,
  font: "caprasimo",
  timestamp: Date.now(),
  background_local: undefined, // index of selected image in localStorage.getItem("savedImages")
  background_link: undefined // link of selected image
};

const browser_cr = chrome ? chrome : browser;

function initStateIfNotExist() {
  browser_cr.storage?.local?.get("formState", (result) => {
    console.log(result, result?.formState);
    
    if (!result?.formState || Object.keys(result.formState).length < 4) {
      if (typeof window !== "undefined" && window.location) {
        window.location.reload();
      }
      browser_cr.storage.local.set({ formState: { ...initialState } });
    }
    
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


browser_cr.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSfy3DYPCFQniaGrZjtYnlSUxQyZeBNFicYk9aMJwu6FbS86lg/viewform?usp=header");
