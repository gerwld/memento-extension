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

    const displayTime = ({showTime, showSeconds, is12HourFormat}) => {
      const clockElement = document.querySelector("#time-element");
      const clockHours = clockElement.querySelector("span.hours");
      const clockMinutes = clockElement.querySelector("span.minutes");
      const clockSeconds = clockElement.querySelector("span.seconds");

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
          if(formattedHours !== lastDisplayedHours) {
            clockHours.textContent = formattedHours;
            lastDisplayedHours = formattedHours;
          }
          // Update Minutes
           if(formattedMinutes !== lastDisplayedMinutes) {
            clockMinutes.textContent = formattedMinutes;
            lastDisplayedMinutes = formattedMinutes;
          }
          // Update Seconds
           if(formattedSeconds !== lastDisplayedSeconds && showSeconds) {
            clockSeconds.textContent = ":" + formattedSeconds;
            lastDisplayedSeconds = formattedSeconds;
          }

          // Add prefix (if 12h) 
          if (is12HourFormat && lastDisplayedPeriod !== period) { 
            clockElement.querySelector("span.period").textContent = " " + period;
            lastDisplayedPeriod = period;
          }

          lastDisplayedTime = formattedTime;
        }
      };

      setInterval(updateClock, 1000); // Update every second
      updateClock(); // initial call to set the time immediately
    };



    const displayDayAndDate = ({ showFullDayName }) => {
      const dayShowElement = document.querySelector("#date-element>span");
    
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
    
      setInterval(updateDayAndDate, 60000); // Check every minute for changes
      updateDayAndDate(); // Initial call to set the date immediately
    };    




    displayDayAndDate({showFullDayName: true})
    displayTime({showTime: true, showSeconds: true, is12HourFormat: true});
  })();
})(this);
