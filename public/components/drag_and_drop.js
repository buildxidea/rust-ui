// Use event delegation on document so handlers survive Leptos WASM hydration,
// which replaces SSR DOM nodes and strips directly-attached listeners.

document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("draggable")) {
    e.target.classList.add("dragging");
  }
});

document.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("draggable")) {
    e.target.classList.remove("dragging");
  }
});

document.addEventListener("dragover", (e) => {
  const container = e.target.closest(".dragabble__container");
  if (!container) return;
  e.preventDefault();
  const afterElement = getDragAfterElement(container, e.clientY);
  const draggable = document.querySelector(".dragging");
  if (!draggable) return;
  if (afterElement == null) {
    container.appendChild(draggable);
  } else {
    container.insertBefore(draggable, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}
