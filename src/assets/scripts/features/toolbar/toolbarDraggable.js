// Select all elements with data-draggable="true"
const draggableElements = document.querySelectorAll('[data-draggable="true"]');

// Function to save the position of an element in localStorage
function savePosition(id, x, y) {
  const savedPositions = JSON.parse(localStorage.getItem('draggablePositions')) || {};
  savedPositions[id] = { x, y };
  localStorage.setItem('draggablePositions', JSON.stringify(savedPositions));
}

// Function to load the position of an element from localStorage
function loadPosition(id, element) {
  const savedPositions = JSON.parse(localStorage.getItem('draggablePositions'));
  if (savedPositions && savedPositions[id]) {
    const { x, y } = savedPositions[id];
    element.style.transform = `translate(${x}px, ${y}px)`;
    element.dataset.translateX = x;
    element.dataset.translateY = y;
  } else {
    let topOffset = window.innerHeight - 520;
    let leftOffset = 20;
    // Set the initial position if no data is found
    element.style.transform = `translate(${leftOffset}px, ${topOffset}px)`;

    element.dataset.translateX = leftOffset;
    element.dataset.translateY = topOffset;
  }
}

// Function to check and adjust the position within the viewport
function keepInViewport(x, y, element) {
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Restrict coordinates
  const correctedX = Math.min(
    Math.max(x, 0), // Minimum 0 (left)
    viewportWidth - rect.width // Maximum (viewport width - element width)
  );

  const correctedY = Math.min(
    Math.max(y, 0), // Minimum 0 (top)
    viewportHeight - rect.height // Maximum (viewport height - element height)
  );

  return { x: correctedX, y: correctedY };
}

// Add handlers for each element
draggableElements.forEach((element) => {
  const id = element.id;

  // Load position on initialization
  loadPosition(id, element);

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;

    const currentX = parseFloat(element.dataset.translateX) || 0;
    const currentY = parseFloat(element.dataset.translateY) || 0;

    offsetX = e.clientX - currentX;
    offsetY = e.clientY - currentY;

    element.style.cursor = 'grabbing';

    // Prevent text selection
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;

      // Restrict coordinates within the viewport
      const correctedPosition = keepInViewport(x, y, element);
      x = correctedPosition.x;
      y = correctedPosition.y;

      element.style.transform = `translate(${x}px, ${y}px)`;
      element.dataset.translateX = x;
      element.dataset.translateY = y;

      // Prevent text selection while moving
      e.preventDefault();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;

      const finalX = parseFloat(element.dataset.translateX) || 0;
      const finalY = parseFloat(element.dataset.translateY) || 0;

      // Save the corrected position
      savePosition(id, finalX, finalY);
      element.style.cursor = 'grab';
    }
  });
});
