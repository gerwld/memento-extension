


import "./toolbarDraggable.js";
let isInitialCall = true;

export function displayToolbar({ hideToolbar }) {
  const toolbar = document.getElementById("toolbar");

  if (hideToolbar) {
    document.documentElement.setAttribute("data-toolbar", "hidden")
    toolbar.style.display = "none";
    return;
  } else {
    document.documentElement.setAttribute("data-toolbar", "visible");
    toolbar.style.display = "block";
  }

  //* Set element visible or hidden on page, based on data-type *//
  function onToggleOption(e) {
    const eventtype = e.target.getAttribute("data-type");
    if (eventtype) {
      const htmlAttr = "data-" + eventtype;
      const current = document.documentElement.getAttribute(htmlAttr);



      //* get current state *//
      let state = {};
      let localState = JSON.parse(localStorage.getItem("draggableVisibility"));

      if (typeof localState === "object") {
        state = { ...localState };
      }
      //* change current value *//
      if (current !== "visible") {
        document.documentElement.setAttribute(htmlAttr, "visible");
        state[htmlAttr] = "visible";
      }
      else {
        document.documentElement.setAttribute(htmlAttr, "hidden");
        state[htmlAttr] = "hidden";
      }
      //* set new state *//
      localStorage.setItem("draggableVisibility", JSON.stringify(state));
    }
  }


  //* Set element visible or hidden on initial load (called only once) *//
  function initializeState() {
    let localState = JSON.parse(localStorage.getItem("draggableVisibility"));

    if (localState && typeof localState === "object") {
      const keys = Object.keys(localState);

      keys.forEach(key => {
        document.documentElement.setAttribute(key, localState[key]);
      })
    }
  }

  initializeState();
  if (isInitialCall) {
    toolbar?.addEventListener("click", onToggleOption);
    isInitialCall = false;
  }
}