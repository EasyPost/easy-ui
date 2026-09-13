import { chromium, firefox } from "playwright";
import { preview } from "vite";
import { auditMaps } from "./checks.mjs";
const name = process.env.MAP_BROWSER ?? "chrome";
const server = await preview({
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
let browser;
try {
  browser =
    name === "firefox"
      ? await firefox.launch({
          headless: false,
          firefoxUserPrefs: {
            "webgl.force-enabled": true,
            "webgl.disabled": false,
            "gfx.webrender.all": true,
            "gfx.x11-egl.force-enabled": true,
          },
        })
      : await chromium.launch({
          channel: "chrome",
          headless: true,
          args: [
            "--use-gl=angle",
            "--use-angle=swiftshader",
            "--enable-unsafe-swiftshader",
          ],
        });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await auditMaps(
    {
      open: (url) => page.goto(url, { waitUntil: "networkidle" }),
      resize: (width, height) => page.setViewportSize({ width, height }),
      evaluate: (fn, ...args) =>
        page.evaluate(fn, args.length === 1 ? args[0] : args),
      wait: (fn) => page.waitForFunction(fn, undefined, { timeout: 60000 }),
      script: (source) => page.addScriptTag({ content: source }),
      axe: () =>
        page.evaluate(() =>
          window.axe.run(document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
            },
          }),
        ),
      click: (selector) => page.locator(selector).click(),
      key: (selector, key) => page.locator(selector).press(key),
      select: (selector, value) => page.locator(selector).selectOption(value),
      screenshot: (path) => page.screenshot({ path, fullPage: true }),
    },
    { name, version: browser.version(), platform: process.platform },
    "http://127.0.0.1:4173",
    `screenshots/${name}`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
