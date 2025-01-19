
function uploadBackgroundInitialize(callback) {
  const uploadInput = document.getElementById("upload_input");

  // On uploadInput change listener
  uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Reading the file as Data URL (onload event)
      reader.onload = (e) => {

        const imageData = e.target.result;

        // Local state saving with Set
        let state = [];
        const localStateBG = JSON.parse(localStorage.getItem("savedImages"));

        if (Array.isArray(localStateBG)) {
          state = [...localStateBG];
        }
        state.push(imageData);

        let uniqueStateArray = [...new Set(state)];
        localStorage.setItem("savedImages", JSON.stringify(uniqueStateArray));

          // updating index with currentIndex
          let currentIndex = uniqueStateArray.indexOf(imageData);
          chrome.storage.local.get("formState", (result) => {
            let state = result.formState ? result.formState : {};
            chrome.storage.local.set({ formState: {...state, "background_local": currentIndex || 0, "force_update": Math.random() + Math.random()} }, () => {
              const formStateChangeEvent = new CustomEvent("formStateChange");
              window.dispatchEvent(formStateChangeEvent);
              
            });
          });

        // Updating DOM part
        callback();
        console.log(JSON.parse(localStorage.getItem("savedImages")));
      };

      reader.readAsDataURL(file);
    }
  });
}

export default uploadBackgroundInitialize;