import { removeAllImagesBackground } from "../../functionality/tools.js";
import setUnsplashBackground from "../bg_unsplash.js";

export function setBackground(selectedType, selectedIndexLocalStorage) {
  // TODO: Better background set

  // SELECTED: UNSPLASH
  if (selectedType === "unsplash") {
    document.getElementById('bg_reload').classList.remove("hidden");
    setUnsplashBackground();
  } else {
    document.getElementById('bg_reload').classList.add("hidden");
    setUnsplashBackground(true);
  }

  // SELECTED: DISABLED
  if (selectedType === "disabled") {
    document.getElementById('hide_no-bg').classList.add("hidden")
    document.getElementById('background_overlay').classList.add("hidden")
  } else {
    document.getElementById('hide_no-bg').classList.remove("hidden")
    document.getElementById('background_overlay').classList.remove("hidden")
  }

  // SELECTED: LINK
  if (selectedType === "link") {
    // removeAllImagesBackground();
    document.querySelector('.background_group_link').classList.remove("hidden");
  } else {
    document.querySelector('.background_group_link').classList.add("hidden");
  }

  // SELECTED: LOCAL
  if (selectedType === "local") {
    document.querySelector('.background_group_local').classList.remove("hidden");
    function setSavedImage() {
      console.log("setSavedImage call");
      
      const savedImages = JSON.parse(localStorage.getItem("savedImages"));
      const backgroundBlock = document.getElementById("background");
      
      if (Array.isArray(savedImages)) {
        
        if (backgroundBlock) {
          const currentImage = savedImages[selectedIndexLocalStorage * 1];
          
          const imagesBG = backgroundBlock?.querySelectorAll("img");
          imagesBG.forEach(i => i.remove());

          console.log("setting background (savedImages)");

          if(typeof currentImage === "string") {
            const img = document.createElement('img');
            img.src = currentImage;
            backgroundBlock.appendChild(img);
          }
        }
      } 
      if (!savedImages.length) {
        removeAllImagesBackground()
      }
    }
    setSavedImage();
  }
  else {
    document.querySelector('.background_group_local').classList.add("hidden");
  }
}