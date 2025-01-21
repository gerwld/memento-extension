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

import { browser_cr, getIs12HourFormat } from "./functionality/tools";

const WELCOME_URL = "https://weblxapplications.com/sp/welcome";
const UDPDATE_URL = "https://weblxapplications.com/sp/update";
const DELETE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfy3DYPCFQniaGrZjtYnlSUxQyZeBNFicYk9aMJwu6FbS86lg/viewform?usp=header";

const initialState = {
  disabled: false,
  background_type: "unsplash",

  clock_size: 40,
  time__isvisible: true,
  time__show_seconds: true,
  time__is_12_hours: getIs12HourFormat(), 

  date__isvisible: false,

  background_blur: 5,
  background_brightness: 0.22,
  background_local: undefined, // specified image (index) in localStorage.getItem("savedImages")
  background_link: undefined, // link of the specified image

  font: "caprasimo",
  timestamp: Date.now(),
  searchbar__isvisible: true,
  searchbar__engine: "google",
};


function initStateIfNotExist() {
  browser_cr.storage?.local?.get("formState", (result) => {
    
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
        // chrome.tabs.create({ url: WELCOME_URL });
        chrome.storage.local.set({ 'welcomePageDisplayed': true });
      } else if (details.reason === 'update') {
        // chrome.tabs.create({ url: UDPDATE_URL });
      }
    });
  }
});


browser_cr.runtime.setUninstallURL(DELETE_URL);
