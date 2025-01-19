
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

        // Updating DOM part
        callback();
        console.log(JSON.parse(localStorage.getItem("savedImages")));
      };

      reader.readAsDataURL(file);
    }
  });
}

export default uploadBackgroundInitialize;