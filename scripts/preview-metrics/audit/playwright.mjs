import { chromium, firefox } from "playwright";
import { preview } from "vite";
import { auditBrowser } from "./checks.mjs";

const requested = process.env.EASY_UI_AUDIT_BROWSER ?? "chrome";
if (!["chrome", "firefox"].includes(requested))
  throw new Error(`Unsupported browser: ${requested}`);
const engine = process.env.EASY_UI_CHART_ENGINE ?? "full";
const server = await preview({
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
const browser = await (requested === "chrome"
  ? chromium.launch({ channel: "chrome" })
  : firefox.launch());
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
try {
  await auditBrowser(
    {
      open: (url) => page.goto(url, { waitUntil: "networkidle" }),
      evaluate: (fn, ...args) =>
        page.evaluate(
          ({ source, values }) => (0, eval)(`(${source})`)(...values),
          { source: fn.toString(), values: args },
        ),
      wait: (fn, ...args) =>
        page.waitForFunction(
          ({ source, values }) => (0, eval)(`(${source})`)(...values),
          { source: fn.toString(), values: args },
        ),
      script: (source) => page.addScriptTag({ content: source }),
      key: async (selector, key) => {
        await page.locator(selector).first().focus();
        await page.keyboard.press(key);
      },
      click: (selector) => page.locator(selector).first().click(),
      screenshot: (path) => page.screenshot({ path, fullPage: false }),
    },
    { name: requested, version: browser.version() },
    "http://127.0.0.1:4173",
    `screenshots/audit/${requested}-${engine}`,
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
