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
    const browser_cr = chrome ? chrome : browser;
    let interval0, interval1, interval2, interval3, interval4, interval5, interval6;
    const fonts = ["roboto", "poppins", "caprasimo", "playfair", "merriweather", "noto_sans", "nunito", "montserrat", "pixelify", "gabarito", "roboto_condensed", "inter"];


    const displayTime = ({ hideTime, showSeconds, is12HourFormat }) => {
      clearInterval(interval0)
      const clockElement = document.querySelector("#time-element");
      const clockHours = clockElement.querySelector("span.hours");
      const clockMinutes = clockElement.querySelector("span.minutes");
      const clockSeconds = clockElement.querySelector("span.seconds");

      if (hideTime) {
        clockElement.classList.add("hiden");
        return null;
      } else {
        clockElement.classList.remove("hiden");
      }

      let lastDisplayedTime = ""; // To track the last displayed time
      let lastDisplayedHours = "";
      let lastDisplayedMinutes = "";
      let lastDisplayedSeconds = "";
      let lastDisplayedPeriod = "";

      const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        let period = "";

        if (is12HourFormat) { // converts to 12-hour format
          period = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
        }

        let formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");


        // For validation (to avoid extra DOM manipulations)
        const formattedTime = `${formattedHours}${formattedMinutes}${formattedSeconds}${is12HourFormat ? period : ""}`;

        // Update the clock only if the time value changes
        if (formattedTime !== lastDisplayedTime) {
          // Update Hours
          if (formattedHours !== lastDisplayedHours) {
            clockHours.textContent = formattedHours;
            lastDisplayedHours = formattedHours;
          }
          // Update Minutes
          if (formattedMinutes !== lastDisplayedMinutes) {
            clockMinutes.textContent = formattedMinutes;
            lastDisplayedMinutes = formattedMinutes;
          }
          // Update Seconds
          if (formattedSeconds !== lastDisplayedSeconds && showSeconds) {
            clockSeconds.classList.remove("hidden");
            clockSeconds.textContent = ":" + formattedSeconds;
            lastDisplayedSeconds = formattedSeconds;
          }
          else if (!showSeconds) {
            clockSeconds.classList.add("hidden");
            clockSeconds.textContent = "";
          }


          // Add / remove prefix (if 12h) 
          if (is12HourFormat && lastDisplayedPeriod !== period) {
            clockElement.querySelector("span.period").textContent = " " + period;
            lastDisplayedPeriod = period;
          }
          else if (!is12HourFormat) clockElement.querySelector("span.period").textContent = "";

          lastDisplayedTime = formattedTime;
        }
      };

      interval0 = setInterval(updateClock, 1000); // Update every second
      updateClock(); // initial call to set the time immediately
    };



    const displayDayAndDate = ({ showFullDayName, hideDate }) => {
      clearInterval(interval1);
      const dayShowElement = document.querySelector("#date-element>span");

      if (hideDate) {
        dayShowElement.classList.add("hiden");
        return null;
      } else {
        dayShowElement.classList.remove("hiden");
      }

      const daysOfWeekFull = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const monthsOfYear = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let lastDisplayedDate = ""; // To track the last displayed date

      const updateDayAndDate = () => {
        const now = new Date();
        const dayIndex = now.getDay();
        const date = now.getDate();
        const monthIndex = now.getMonth();

        const dayName = daysOfWeekFull[dayIndex];
        const monthName = monthsOfYear[monthIndex];

        const formattedDate = `${dayName}, ${date} ${monthName}`;

        if (formattedDate !== lastDisplayedDate) {
          dayShowElement.textContent = formattedDate;
          lastDisplayedDate = formattedDate;
        }
      };

      interval1 = setInterval(updateDayAndDate, 60000); // Check every minute for changes
      updateDayAndDate(); // Initial call to set the date immediately
    };


    function setCSSConstant(prefix, value, addPX) {
      if (!isNaN(value)) {
        if (addPX)
          value = value + "px"
        document.documentElement.style.setProperty(prefix, value);
      }
    }


    function setFont(selectedFont) {
      // Set font if exists, then delete others
      if (fonts.indexOf(selectedFont) !== -1) {
        setOrRemoveStylesOfItem(`/assets/styles/fonts/${selectedFont}.css`, true, selectedFont);
      }
      fonts.filter((e) => e !== selectedFont).forEach((font) => document.getElementById(font)?.remove());
    }

    function setOrRemoveStylesOfItem(assetPath, item, item_id) {
      // Fetch the CSS file and append it
      fetch(browser_cr.runtime.getURL(assetPath))
        .then((response) => response.text())
        .then((css) => {
          let current = document.getElementById(item_id);
          let style = document.createElement("style");
          style.textContent = css;
          style.setAttribute("id", item_id);
          if (item && !current) document.head.appendChild(style);
          else if (!item && current instanceof Node) document.head.removeChild(current);
        }).catch(_ => { });;
    }

    // ============== STATE APPLYING PART ================ //

    // Part to get current state
    function getCurrentState(oldState) {
      browser_cr.storage.local.get("formState", async (result) => {
        // Checks if extension is disabled or not
        const state = result.formState.disabled ? { disabled: true } : result.formState;


        setFont(state.font);
        setCSSConstant("--bg-blur", state.background_blur, true)
        setCSSConstant("--bg-brightness", state.background_brightness, false)


        // Chunks that change interface based on state
        displayDayAndDate({ showFullDayName: true, hideDate: state.date__hide_date })
        displayTime({ hideTime: state.time__hide_time, showSeconds: state.time__show_seconds, is12HourFormat: state.time__is_12_hours });

      });
    }




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
