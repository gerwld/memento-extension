let interval1;

export const displayDayAndDate = ({ showFullDayName, hideDate }) => {
  clearInterval(interval1);
  const dayShowElement = document.querySelector("#date-element>span");

  if (hideDate) {
    dayShowElement.classList.add("hidden");
    return null;
  } else {
    dayShowElement.classList.remove("hidden");
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
