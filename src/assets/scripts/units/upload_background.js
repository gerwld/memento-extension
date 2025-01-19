import { saveImageToIndexedDB, getAllImagesFromIndexedDB } from "../tools/IndexDB.js";

// Main upload initialization function
function uploadBackgroundInitialize(callback) {
  const uploadInput = document.getElementById("upload_input");

  uploadInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const imageData = e.target.result;

        // Save image to IndexedDB
        const imageId = await saveImageToIndexedDB(imageData);

        // Retrieve all images from IndexedDB to update the state
        const allImages = await getAllImagesFromIndexedDB();

        // Find the index of the current image
        const currentIndex = allImages.findIndex((image) => image.id === imageId);

        // Update form state in chrome.storage.local
        chrome.storage.local.get("formState", (result) => {
          const state = result.formState || {};
          chrome.storage.local.set(
            {
              formState: {
                ...state,
                background_local: currentIndex,
                force_update: Math.random() + Math.random(),
              },
            },
            () => {
              const formStateChangeEvent = new CustomEvent("formStateChange");
              window.dispatchEvent(formStateChangeEvent);
            }
          );
        });

        // Update the DOM or perform other actions
        callback();
        console.log("All Images:", allImages);
      };

      reader.readAsDataURL(file);
    }
  });
}

export default uploadBackgroundInitialize;
