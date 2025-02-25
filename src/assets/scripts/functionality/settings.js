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

import uploadBackgroundInitialize from "../features/bg_local.js";
import { setCSSConstant } from "./tools.js";

// Change state, initialize state, onChange update DOM part
(() => {
  "use strict";
  (() => {
    document.addEventListener("DOMContentLoaded", () => {
      const container = document.getElementById("l3_settings");
      const main_nav = document.getElementById("header_nav");
      const lang_set = document.getElementById("lang_set");
      const images_conatiner = document.getElementById("local_images_container");

      if (!chrome)
        chrome = browser;

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

      function initializeUpdate(isInitialCall) {
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
              if(input.getAttribute("name") === "background_type") {
                const backgroundBlock = document.getElementById("background");
                const imagesBG = backgroundBlock?.querySelectorAll("img");
                imagesBG.forEach(i => i.remove());
              }
            });
          }

          // Function to update the state object and form inputs
          function updateRealtimeLocal(event) {
            const input = event.target;
            const value = input.value;
            const name = input.name;

            if(isNaN(value)) return;
            else if(name === "clock_size") {
              setCSSConstant("--clock-size-multiplier", value, false);
            }
            else if(name === "background_blur") {
              setCSSConstant("--bg-blur", value, true)
            }
            else if(name === "background_brightness") {
              setCSSConstant("--bg-brightness", value, false)
            }
          }

          

          // Function to update form inputs based on the state object
          function updateFormInputs() {
            const inputs = document.querySelectorAll("input, select");
            const toolbar = document.getElementById("toolbar");
            for (let i = 0; i < inputs.length; i++) {
              const input = inputs[i];
              // to prevent toolbar update (it's segmented)
              if (!toolbar.contains(input)) {

                if (input.type === "checkbox") {
                  input.checked = state[input.name] || false;
                }
                if (input.type === "range" && !isInitialCall) return;
                else if (input.type === "file") continue;
                else {
                  input.value = state[input.name] || "";
                }
              }

            }
          }

          function updateSelectedImages() {
            console.log("updateSelectedImages call");


            const images_conatiner = document.getElementById("local_images_container");

            (function initSelectedImages() {
              const images = JSON.parse(localStorage.getItem("savedImages"));
              if (Array.isArray(images)) {
                let newInnerHTML = images.map((img, i) => {
                  return `
                <div data-value="${i}" data-action="select" data-selected="${state["background_local"] == i}">
                  <button data-value="${i}" data-action="delete">X</button>
                  <img src="${img}" alt="Image"/>
                </div>`
                })

                let str = newInnerHTML.join(" ");
                if (images_conatiner.innerHTML != str) {
                  images_conatiner.innerHTML = str;
                }

              }
              else {
                images_conatiner.innerHTML = '';
                state["background_local"] = null;
              }
            })();

          }

          function setSelectedImages(e) {


            const value = e.target?.getAttribute('data-value');
            const action = e.target?.getAttribute('data-action');

            console.log("call", value);

            if (action === "select") onSelect();
            if (action === "delete") onDelete();

            function onSelect() {
              if (!isNaN(value)
                && value >= 0
                && value !== null) {
                state["background_local"] = value;
                console.log("Set image, index from LS: " + value);

                // Save the updated state to extension storage
                chrome.storage.local.set({ formState: state }, () => {
                  dispatchFormStateChangeEvent();
                });
                // updateSelectedImages();
              }
            }

            function onDelete() {

              if (!isNaN(value)
                && value >= 0
                && value !== null) {
                let stateBG = [];
                const localStateBG = JSON.parse(localStorage.getItem("savedImages"));

                if (Array.isArray(localStateBG)) {
                  stateBG = [...localStateBG];
                }

                stateBG.splice(value, 1);
                localStorage.setItem("savedImages", JSON.stringify(stateBG));


                // Save the updated state if deleted current
                if (value == state["background_local"]) {
                  chrome.storage.local.set({ formState: { ...state, "background_local": 0, "__force_update": Math.random() + Math.random() } }, () => {
                    dispatchFormStateChangeEvent();
                  });
                }
                updateSelectedImages();



                console.log("Deleted image: " + value);
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
            } 

            if (input.type === "range") {
              input.addEventListener("change", updateState);
            } 

            if (input.type === "range") {
              input.addEventListener("input", updateRealtimeLocal);
            }     
            
            else if (input.type !== "file") input.addEventListener("input", updateState);
          });


          if (isInitialCall) {
            //Add event listener to header nav & lang change
            main_nav.removeEventListener("click", updateMenuState);
            main_nav.addEventListener("click", updateMenuState);

            lang_set.removeEventListener("change", updateLangState);
            lang_set.addEventListener("change", updateLangState);

            //Add event listener for images select
            images_conatiner.removeEventListener("click", setSelectedImages);
            images_conatiner.addEventListener("click", setSelectedImages);

            uploadBackgroundInitialize(updateSelectedImages);
          }


          // Initialize the form inputs based on the state
          updateSelectedImages();

          updateFormInputs();
          updateMenu();
        });
      }

      initializeUpdate(true);
    });
  })();
})();


// Toggle aside settings menu part 
(() => {
  const btnSettings = document.getElementById("btnsettings");
  const settingsBlock = document.getElementById("settingsdrawer");
  const DELAY_DISPLAY_NONE = 400;

  function toggleSettingsDrawer() {
    if (document.body.classList.contains("settings-opened"))
      closeSettingsWithDelay();
    else {
      // settingsBlock.classList.remove("displayNone");
      setTimeout(() => {
        document.body.classList.add("settings-opened");
      }, 50);
      // to prevent the issue where button was toggled multiple times & block do not appear
      setTimeout(() => {
        // settingsBlock.classList.remove("displayNone");
      }, DELAY_DISPLAY_NONE + 50)
    }
  }

  function closeSettingsWithDelay(isClickOutside) {
    if (!isClickOutside) {
      // settingsBlock.classList.remove("displayNone");
    }
    document.body.classList.remove("settings-opened");

    setTimeout(() => {
      // settingsBlock.classList.add("displayNone");
    }, DELAY_DISPLAY_NONE);
  }

  btnSettings.addEventListener("click", toggleSettingsDrawer)

  // on click outside
  document.body.addEventListener('click', function (event) {

    if (
      event.target !== settingsBlock
      && !settingsBlock.contains(event.target)
      && event.target.type !== "file"
      && !event.target?.getAttribute('data-value')
      && event.target !== settingsBlock
      && event.target !== btnSettings) {
      closeSettingsWithDelay(true);
    }
  });
})();



function old() {
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



  // Change state, initialize state, onChange update DOM part
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

        function initializeUpdate(isInitialCall) {
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
                if (input.type === "range" && !isInitialCall) return;

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

        initializeUpdate(true);
      });
    })();
  })();


  // Toggle aside settings menu part 
  (() => {
    const btnSettings = document.getElementById("btnsettings");
    const settingsBlock = document.getElementById("settingsdrawer");
    const DELAY_DISPLAY_NONE = 400;

    function toggleSettingsDrawer() {
      if (document.body.classList.contains("settings-opened"))
        closeSettingsWithDelay();
      else {
        // settingsBlock.classList.remove("displayNone");
        setTimeout(() => {
          document.body.classList.add("settings-opened");
        }, 50);
        // to prevent the issue where button was toggled multiple times & block do not appear
        setTimeout(() => {
          // settingsBlock.classList.remove("displayNone");
        }, DELAY_DISPLAY_NONE + 50)
      }
    }

    function closeSettingsWithDelay(isClickOutside) {
      if (!isClickOutside) {
        // settingsBlock.classList.remove("displayNone");
      }
      document.body.classList.remove("settings-opened");

      setTimeout(() => {
        // settingsBlock.classList.add("displayNone");
      }, DELAY_DISPLAY_NONE);
    }

    btnSettings.addEventListener("click", toggleSettingsDrawer)

    // on click outside
    document.body.addEventListener('click', function (event) {
      if (settingsBlock && !settingsBlock.contains(event.target) && event.target !== settingsBlock && event.target !== btnSettings) {
        closeSettingsWithDelay(true);
      }
    });
  })();
}