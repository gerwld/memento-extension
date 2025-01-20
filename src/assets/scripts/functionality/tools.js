export const browser_cr = chrome ? chrome : browser;

// * Get user hour format (default: 12h) * //
export function getIs12HourFormat() {
  let is12HourFormat = true; 
  try {
      is12HourFormat = new Date().toLocaleString('en', { hour: '2-digit', hour12: true }).indexOf(':') !== -1;
  } catch (error) {
      console.warn('Error determining time format:', error);
  }
  return is12HourFormat;
}

// * Set specific CSS constant * //
export function setCSSConstant(prefix, value, addPX) {
  if (!isNaN(value)) {
    if (addPX)
      value = value + "px"
    document.documentElement.style.setProperty(prefix, value);
  }
}

// * Set font if exists, then delete others * //
export function setFont(selectedFont, fonts) {
  if (fonts.indexOf(selectedFont) !== -1) {
    setOrRemoveStylesOfItem(`/assets/styles/fonts/${selectedFont}.css`, true, selectedFont);
  }
  fonts.filter((e) => e !== selectedFont).forEach((font) => document.getElementById(font)?.remove());
}

// * Fetch the CSS file and append it * //
export function setOrRemoveStylesOfItem(assetPath, item, item_id) {
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

// * Remove all background images * //
export function removeAllImagesBackground () {
  const backgroundBlock = document.getElementById("background");
  const imagesBG = backgroundBlock?.querySelectorAll("img");
  imagesBG.forEach(i => i.remove());
}


// * Disables blur, background, filter when current page is not visible. * //
let isOptimize;
export function optimizeResources() {
  document.addEventListener("DOMContentLoaded", () => {
    const background = document.getElementById("background_overlay");
    if (!isOptimize) {
      document.addEventListener('visibilitychange', function () {
        isOptimize = true;
        if (document.hidden) {
          background.classList.add("no_tab_activity");
        } else {
          background.classList.remove("no_tab_activity");
        }
      });
    }
  });
} 