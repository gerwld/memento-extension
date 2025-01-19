document.addEventListener("DOMContentLoaded", () => {
  const uploadInput = document.getElementById("upload_input");

  // При загрузке файла
  uploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();

          // Чтение файла как Data URL
          reader.onload = (e) => {

              const imageData = e.target.result;
              
              // Сохранение в локальное хранилище
              let state = [];
              const localStateBG = JSON.parse(localStorage.getItem("savedImages"));

              if(Array.isArray(localStateBG)) {
                state = [...localStateBG];
              }

              state.push(imageData);

              
              
              let uniqueStateArray = [...new Set(state)];              
              localStorage.setItem("savedImages", JSON.stringify(uniqueStateArray));

              console.log(JSON.parse(localStorage.getItem("savedImages")));
          };

          reader.readAsDataURL(file);
      }
  });

});
