export function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function createEL(tag, className = "", attributes = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attributes).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

export function clearElement(element) {
  while (element.firstCHild) {
    element.removeChild(element.fistChild);
  }
}
