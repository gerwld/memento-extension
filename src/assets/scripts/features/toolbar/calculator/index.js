// import math from "./math.js";
const comp = document.getElementById("calc_container");
const display = comp.querySelector("#display");
const buttons = comp.querySelectorAll("button");

// Load the previous result from storage
chrome.storage.local.get("calculatorResult", (data) => {
  const savedResult = data.calculatorResult;  
  display.value = savedResult !== undefined ? savedResult : "0";
});

buttons.forEach((item) => {
  item.onclick = () => {
    if (item.getAttribute("data-action") === "clear") {
      display.value = "0";

      // Remove the value from local storage
      chrome.storage.local.remove("calculatorResult");
    }

    else if (item.getAttribute("data-action") === "backspace") {
      let string = display.value.toString();
      if (string.length === 1) {
        display.value = "0";
      } else display.value = string.slice(0, -1);
    }

    else if (display.value !== "" && item.getAttribute("data-action") === "result") {
      if (display.value.startsWith("0/")) {
        chrome.storage.local.remove("calculatorResult");
        display.value = "Error!";
      } else {
        display.value = evaluateExpression(display.value);
      }
    }

    else if (display.value === "0" && item.getAttribute("data-action") === "result") {
      display.value = "Empty!";
      setTimeout(() => (display.value = ""), 2000);
    }

    else if (display.value === "0" && ["/", "*", "+", "-"].indexOf(item.getAttribute("data-action")) !== -1) {
      let operator = item.getAttribute("data-action");
      if (display.value.slice(-1) !== operator) display.value += operator;
    }

    else if (display.value === "0") {
      display.value = item.getAttribute("data-action");
    }


    else if (["/", "*", "+", "-"].indexOf(item.getAttribute("data-action")) !== -1) {
      let operator = item.getAttribute("data-action");
      if (display.value.slice(-1) !== operator) display.value += operator;
    }


    else {
      display.value += item.getAttribute("data-action");
    }

    // Save the current display value to storage
    const currentValue = display.value;
    if (currentValue !== "Error!" && currentValue !== "Empty!") {
      chrome.storage.local.set({ calculatorResult: currentValue });
    }
  };
});

function evaluateExpression(expression) {
  try {
    const result = math.evaluate(expression);
    // Save the result to storage
    chrome.storage.local.set({ calculatorResult: result });
    return result;
  } catch (error) {
    console.error("Error evaluating expression:", error);
    // Remove the value from local storage
    chrome.storage.local.remove("calculatorResult");
    return "Error!";
  }
}

const themeToggleBtn = comp.querySelector(".theme-toggler");
const calculator = comp.querySelector(".calculator");
const toggleIcon = comp.querySelector(".toggler-icon");
let isDark = true;

// Load the previous theme from storage
chrome.storage.local.get("calculatorTheme", (data) => {
  const savedTheme = data.calculatorTheme;
  if (data.calculatorTheme === undefined) {
    chrome.storage.local.set({ calculatorTheme: "dark" });
  } else if (savedTheme === "dark") {
    calculator.classList.add("dark");
    themeToggleBtn.classList.add("active");
    isDark = true;
  } else {
    calculator.classList.remove("dark");
    themeToggleBtn.classList.remove("active");
    isDark = false;
  }
});

themeToggleBtn.onclick = () => {
  calculator.classList.toggle("dark");
  themeToggleBtn.classList.toggle("active");
  isDark = !isDark;
  // Save the current theme to storage
  const theme = isDark ? "dark" : "light";
  chrome.storage.local.set({ calculatorTheme: theme });
};
