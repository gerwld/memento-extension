// There are two possible solutions. The first is to manipulate API keys, 
// such as limiting requests to a batch of images, which would then be cached and reused. 
// The downside of this approach is that a some competitor might discover the key, 
// escalate the limit to its maximum, and some of my users will end up with a black screen.
// Another downside is the complexity of handling token validation, expiration, etc.

// The second option is to fetch the JSON locally (src/services/unsplash), 
// and work with it directly. The downside is that images might be broken 
// due to outdated data. 
// Solution: use recursion to retry fetching a random image on non-200 responses. 
// If the response is not 200 OK, retry up to 5 times. 
// The data will be kept locally for the duration of the session (until a reload).

// The advantage of this approach is that the fetched data can be cached 
// up to a limit of approximately 100 MB. 
// If a random image is requested, it will be taken from the cache, 
// otherwise, it will be fetched again.

(() => {
  "use strict";

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
    if (!document.querySelector("#background>img"))
      document.querySelector("#background").appendChild(imageElement);

    if (selectedItem.user.name) {
      if (selectedItem.links.self) {
        document.querySelector("#bgcredit_overlay>a:nth-child(1)").setAttribute("href", selectedItem.links.self.replace("api.", ""));
      }
      if (selectedItem.user.links.self) {
        document.querySelector("#bgcredit_overlay>a:nth-child(2)").setAttribute("href", selectedItem.user.links.self.replace("api.", "").replace("users/", "@"));
      }
      document.querySelector("#bgcredit_overlay>a:nth-child(2)").textContent = selectedItem.user.name;
    }

  };

  // Main logic
  (async () => {


    function getTimeBasedPrefix() {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return "_morning";
      if (currentHour >= 18) return "_night";
      return "_day";
    }

    let jsonFilePath = `../../services/unsplash_result${getTimeBasedPrefix()}.json`;

    try {
      const jsonData = await loadJSON(jsonFilePath);

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error("JSON does not contain an array of records or it is empty.");
      }

      const savedData = JSON.parse(localStorage.getItem("selectedImages")) || [];
      const lastEntry = savedData[savedData.length - 1];
      const oneDay = 24 * 60 * 60 * 1000;

      let success = false;
      let attempts = 0;
      const maxAttempts = 5;
      let selectedItem;
      let imageBlob;

      if (lastEntry && Date.now() - lastEntry.timestamp < oneDay) {
        try {
          imageBlob = await downloadImage(lastEntry.item);
          appendImageToDOM(imageBlob);
          success = true;
        } catch (error) {
          console.warn("Failed to load saved image, trying another one.", error);
        }
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
          console.error(error);
          attempts++;
        }
      }

      if (success) {
        const timestamp = Date.now();
        saveToLocalStorage("selectedImages", { timestamp, item: selectedItem });
        appendImageToDOM(imageBlob, selectedItem);
      } else {
        console.error("Failed to download the image after 5 attempts.");
      }
    } catch (error) {
      console.error("Error processing JSON or images:", error);
    }
  })();
})();
