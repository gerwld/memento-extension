// ----- INDEXDB ------- //

// Helper function to initialize IndexedDB
export function initializeIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ImageDatabase", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Function to retrieve all images from IndexedDB
export async function getAllImagesFromIndexedDB() {
  const db = await initializeIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => resolve(getAllRequest.result);
    getAllRequest.onerror = () => reject(getAllRequest.error);
  });
}

export async function deleteImageFromIndexedDB(id) {
  const db = await initializeIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");
    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => resolve();
    deleteRequest.onerror = () => reject(deleteRequest.error);
  });
}


// Function to save an image in IndexedDB
export async function saveImageToIndexedDB(imageData) {
  const db = await initializeIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");
    const addRequest = store.add({ data: imageData });

    addRequest.onsuccess = () => resolve(addRequest.result); // Return the ID of the saved image
    addRequest.onerror = () => reject(addRequest.error);
  });
}