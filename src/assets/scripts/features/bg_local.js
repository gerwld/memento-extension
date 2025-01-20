
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

        // Get savedImages from localState, if > 0 spread to state[]
        let state = [];
        const localStateBG = JSON.parse(localStorage.getItem("savedImages"));
        if (Array.isArray(localStateBG) && localStateBG.length) {
          state = [...localStateBG];
        }
        state.push(imageData);

        let uniqueStateArray = [...new Set(state)];
        localStorage.setItem("savedImages", JSON.stringify(uniqueStateArray));

        if (!chrome)
          chrome = browser;
        
          // Get currentIndex of current file (may vary, if was updated before)
          let currentIndex = uniqueStateArray.indexOf(imageData);
          chrome.storage.local.get("formState", (result) => {
            let state = result.formState ? result.formState : {};
            // Set to chrome.storage.local, force_update to prevent swallow copy check (null == 0)
            chrome.storage.local.set({ formState: {...state, "background_local": currentIndex || 0, "__force_update": Math.random() + Math.random()} }, () => {
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