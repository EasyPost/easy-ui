// Preview-only diagnostics, installed before React mounts or an engine loads.
// Safari WebDriver has no portable browser-log endpoint, so keep the same
// console/error evidence available in every tested browser.
window.__easyUiDiagnostics = { warnings: [], errors: [] };
const describe = (value) => {
  if (value instanceof Error) return value.stack ?? value.message;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};
for (const [method, field] of [
  ["warn", "warnings"],
  ["error", "errors"],
]) {
  const original = console[method];
  console[method] = (...values) => {
    window.__easyUiDiagnostics[field].push(values.map(describe).join(" "));
    original.apply(console, values);
  };
}
window.addEventListener("error", (event) => {
  window.__easyUiDiagnostics.errors.push(event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  window.__easyUiDiagnostics.errors.push(describe(event.reason));
});
