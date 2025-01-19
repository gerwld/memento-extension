// Function to load a JSON file
const loadJSON = async (filePath) => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Error loading JSON: ${response.status}`);
  }
  return response.json();
};



// Function to download an image and check the status
const downloadImage = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error downloading image: ${response.status}`);
  }
  return response.blob();
};




// Function to save data to localStorage
const saveToLocalStorage = (key, value) => {
  const data = JSON.parse(localStorage.getItem(key)) || [];
  data.push(value);
  localStorage.setItem(key, JSON.stringify(data));
};




// Function to append an image & credits to the DOM
const appendImageToDOM = (imageBlob, selectedItem) => {
  const imageElement = document.createElement("img");
  imageElement.src = URL.createObjectURL(imageBlob);

  document.querySelectorAll("#background>img").forEach(e => {
    if (e.src !== imageElement.src) {
      e.remove();
    }
  })
  document.querySelector("#background").appendChild(imageElement);

  if (selectedItem.user.name) {
    document.querySelector("#bgcredit_overlay").classList.remove("hiden")
    if (selectedItem.links.self) {
      document.querySelector("#bgcredit_overlay>a:nth-child(1)").setAttribute("href", selectedItem.links.self.replace("api.", ""));
    }
    if (selectedItem.user.links.self) {
      document.querySelector("#bgcredit_overlay>a:nth-child(2)").setAttribute("href", selectedItem.user.links.self.replace("api.", "").replace("users/", "@"));
    }
    document.querySelector("#bgcredit_overlay>a:nth-child(2)").textContent = selectedItem.user.name;
  } else {
    document.querySelector("#bgcredit_overlay").classList.add("hidden")
  }

};

document.addEventListener("DOMContentLoaded", () => {
  const reloadBTN = document.querySelector(".bg_reloadbtn");
  reloadBTN.addEventListener("click", () => {
    console.log("fetch new");
    reloadBTN.classList.add('animation_load');
    setInterval(() => reloadBTN.classList.remove('animation_load'), 1000);
    fetchNew();
  });
});


function getTimeBasedPrefix() {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "_morning";
  if (currentHour >= 18) return "_night";
  return "_day";
}


// Main logic
const setUnsplashBackground = async (isDisable, isReload) => {
  if (isDisable) {
    document.querySelector("#bgcredit_overlay").classList.add("hidden");
    return;
  } 
  else document.querySelector("#bgcredit_overlay").classList.remove("hidden");
  

  if (!isReload && document.querySelector("#background>img")) return;
  else {

    const jsonFilePath = `../../services/unsplash_result${getTimeBasedPrefix()}.json`;

    try {
      const jsonData = await loadJSON(jsonFilePath);

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error("JSON does not contain an array of records or it is empty.");
      }

      const savedData = JSON.parse(localStorage.getItem("selectedImages")) || [];
      const lastEntry = savedData[savedData.length - 1];
      const fourHours = 4 * 60 * 60 * 1000;

      // Check if the last saved image is still valid
      if (lastEntry && (Date.now() - lastEntry.timestamp) < fourHours) {
        try {
          console.log("fetch new set_unsplash");
          // Use the saved image
          const imageBlob = await downloadImage(lastEntry.item.urls.regular);
          console.log(imageBlob);
          
          appendImageToDOM(imageBlob, lastEntry.item);
          console.log("Using saved image from localStorage.");
          return;
        } catch (error) {
          console.log("Failed to load saved image, will fetch a new one.", error);
        }
      }



      fetchNew();
    } catch (error) {
      console.log("Error processing JSON or images:", error);
    }

  }
};


// Fallback: Fetch a new image
async function fetchNew() {
  let success = false;
  let attempts = 0;
  const maxAttempts = 5;
  let selectedItem;
  let imageBlob;

  const jsonFilePath = `../../services/unsplash_result${getTimeBasedPrefix()}.json`;

  const jsonData = await loadJSON(jsonFilePath);

  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error("JSON does not contain an array of records or it is empty.");
  }

  while (!success && attempts < maxAttempts) {
    try {
      selectedItem = jsonData[Math.floor(Math.random() * jsonData.length)];
      if (!selectedItem.urls.regular) {
        throw new Error("The selected item does not contain 'urls.regular'.");
      }
      imageBlob = await downloadImage(selectedItem.urls.regular);
      success = true;
    } catch (error) {
      console.log(`Attempt ${attempts + 1} failed.`, error);
      attempts++;
    }
  }

  if (success && selectedItem) {
    // Save only the newly fetched image
    const timestamp = Date.now();
    localStorage.setItem("selectedImages", JSON.stringify([{ timestamp, item: selectedItem }]));
    appendImageToDOM(imageBlob, selectedItem);
    console.log("New image fetched and saved to localStorage.");
  } else {
    console.log("Failed to fetch a new image after multiple attempts.");
  }
}


export default setUnsplashBackground;

