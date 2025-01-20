let interval0;

export const displayTime = ({ hideTime, showSeconds, is12HourFormat }) => {
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
      // period = hours >= 12 ? "PM" : "AM";
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