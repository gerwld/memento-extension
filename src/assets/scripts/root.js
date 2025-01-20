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


import { setBackground } from "./features/background/bg_set.js";
import { displayDayAndDate } from "./features/date/displayDate.js";
import { displayTime } from "./features/time/displayTime.js";
import { optimizeResources, setCSSConstant, setFont } from "./functionality/tools.js";
import "./features/rate.js";

optimizeResources();

(() => {
  "use strict";
  (() => {
    const browser_cr = chrome ? chrome : browser;
    const FONTS = ["roboto", "poppins", "caprasimo", "playfair", "merriweather", "noto_sans", "nunito", "montserrat", "pixelify", "gabarito", "roboto_condensed", "inter"];
    

    // ============== STATE APPLYING PART ================ //

    // Part to get current state
    function getCurrentState(oldState) {
      browser_cr.storage.local.get("formState", async (result) => {
        console.log("content.js getCurrentState call");
        

        // Checks if extension is disabled or not
        const state = result.formState.disabled ? { disabled: true } : result.formState;


        setFont(state.font, FONTS);
        setCSSConstant("--bg-blur", state.background_blur, true)
        setCSSConstant("--clock-size-multiplier", state.clock_size, false)
        setCSSConstant("--bg-brightness", state.background_brightness, false)


        // Chunks that change interface based on state
        displayDayAndDate({ showFullDayName: true, hideDate: state.date__hide_date })
        displayTime({ hideTime: state.time__hide_time, showSeconds: state.time__show_seconds, is12HourFormat: state.time__is_12_hours });
        setBackground(state.background_type, state.background_local)
      });
    }


    browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
      console.log("changed dispatch");
      
    });


    // Part to listen the state changes
    browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
      if (
        changes.formState &&
        changes.formState.newValue &&
        changes.formState.oldValue &&
        JSON.stringify({ ...changes.formState.newValue }) !== JSON.stringify({ ...changes.formState.oldValue })
      ) {
        getCurrentState({ ...changes.formState.oldValue });
      }
    });




    document.addEventListener("DOMContentLoaded", getCurrentState, false);
  })();
})(this);


