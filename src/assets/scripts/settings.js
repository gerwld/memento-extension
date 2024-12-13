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


(() => {
  "use strict";
  (() => {
    document.addEventListener("DOMContentLoaded", () => {
      const container = document.getElementById("l3_settings");
      const main_nav = document.getElementById("header_nav");
      const lang_set = document.getElementById("lang_set");


      // Listen for changes in chrome.storage.local
      let prevstate;
      chrome.storage.local.onChanged.addListener((changes, namespace) => {
        if (
          changes.formState &&
          changes.formState.newValue &&
          JSON.stringify({ ...changes.formState.newValue }) !== prevstate
        ) {
          prevstate = JSON.stringify({ ...changes.formState.newValue });
          initializeUpdate();
        }
      });

      // Defining a custom event object
      const formStateChangeEvent = new CustomEvent("formStateChange");


      // Function to dispatch the custom event
      function dispatchFormStateChangeEvent() {
        window.dispatchEvent(formStateChangeEvent);
      }

      function initializeUpdate() {
        console.log("rerender popup");
        // Retrieve state from extension storage or use the initial state
        chrome.storage.local.get("formState", (result) => {
          let state = result.formState ? result.formState : {};

          if (!result.formState) {
            chrome.storage.local.set({ formState: state }, () => {
              dispatchFormStateChangeEvent();
            });
          }

          // Function to update the state object and form inputs
          function updateState(event) {
            const input = event.target;
            const value = input.type === "checkbox" ? input.checked : input.value;
            state[input.name] = value;

            // Save the updated state to extension storage
            chrome.storage.local.set({ formState: state }, () => {
              dispatchFormStateChangeEvent();
            });
          }

          // Function to update form inputs based on the state object
          function updateFormInputs() {
            const inputs = document.querySelectorAll("input, select");
            for (let i = 0; i < inputs.length; i++) {
              const input = inputs[i];
              if (input.type === "checkbox") {
                input.checked = state[input.name] || false;
              } else {
                input.value = state[input.name] || "";
              }
            }
          }

          //Function to update lang state
          function updateLangState(e) {
            state["lang_set"] = e.target.value || "en";
            console.log(e.target.value);
            // Save the updated state to extension storage
            chrome.storage.local.set({ formState: state }, () => {
              console.log(state, e.target.value);
              
              dispatchFormStateChangeEvent();
            });
          }

          // Function to update menu classes based on the state object
          function updateMenu() {
            //dark mode
            if (state["dark_mode"]) document.documentElement.classList.add("dark_mode");
            else document.documentElement.classList.remove("dark_mode");
            //disable or enable plugin
            if (state["disabled"]) document.body.classList.add("disabled");
            else document.body.classList.remove("disabled");
          }

          //Function to update menu state
          function updateMenuState(e) {
            let action = e.target.getAttribute("data-action");
            if (action) {
              state[action] = !state[action];
            }
            // Save the updated state to extension storage
            chrome.storage.local.set({ formState: state }, () => {
              dispatchFormStateChangeEvent();
            });
          }

          // Add event listener to each input and update the state
          const inputs = container.querySelectorAll("input, select");
          inputs.forEach((input) => {
            if (input.type === "checkbox") {
              input.addEventListener("change", updateState);
            } else input.addEventListener("input", updateState);
          });

          //Add event listener to header nav & lang change
          main_nav.addEventListener("click", updateMenuState);
          lang_set.addEventListener("change", updateLangState);
          // Initialize the form inputs based on the state
          updateFormInputs();
          updateMenu();
        });
      }

      initializeUpdate();
    });
  })();
})();

// toggle settings menu part 
const btnSettings = document.getElementById("btnsettings");
const settingsBlock = document.getElementById("settingsdrawer");
const DELAY_DISPLAY_NONE = 400;

function toggleSettingsDrawer() {
  if(document.body.classList.contains("settings-opened")) 
    closeSettingsWithDelay();
  else {
    settingsBlock.classList.remove("displayNone");
    setTimeout(() => {
      document.body.classList.add("settings-opened");
    }, 50);
    // to prevent the issue where button was toggled multiple times & block do not appear
    setTimeout(() => {
      settingsBlock.classList.remove("displayNone");
    }, DELAY_DISPLAY_NONE + 50)
  }
}

function closeSettingsWithDelay(isClickOutside) {
  if(!isClickOutside) {
    settingsBlock.classList.remove("displayNone");
  }
  document.body.classList.remove("settings-opened");

  setTimeout(() => {
    settingsBlock.classList.add("displayNone");
  }, DELAY_DISPLAY_NONE);
}

btnSettings.addEventListener("click", toggleSettingsDrawer)

// on click outside
document.body.addEventListener('click', function(event) {
  if (settingsBlock && !settingsBlock.contains(event.target) && event.target !== settingsBlock && event.target !== btnSettings) {
    closeSettingsWithDelay(true);
  }
});