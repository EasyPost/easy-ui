window.__mapMessages = [];
for (const level of ["warn", "error"]) {
  const original = console[level].bind(console);
  console[level] = (...args) => {
    window.__mapMessages.push({ level, text: args.map(String).join(" ") });
    original(...args);
  };
}
window.addEventListener("error", (event) =>
  window.__mapMessages.push({ level: "error", text: event.message }),
);
window.addEventListener("unhandledrejection", (event) =>
  window.__mapMessages.push({ level: "error", text: String(event.reason) }),
);
