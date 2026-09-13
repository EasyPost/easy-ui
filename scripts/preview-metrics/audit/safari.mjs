import { writeFile } from "node:fs/promises";
import { Builder, By, Key } from "selenium-webdriver";
import { preview } from "vite";
import { auditBrowser } from "./checks.mjs";

// Run on macOS against the installed Safari browser and Apple safaridriver.
// Playwright WebKit is intentionally not used as a substitute for Safari.
const server = await preview({
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
let driver;
try {
  driver = await new Builder().forBrowser("safari").build();
  await driver
    .manage()
    .setTimeouts({ implicit: 0, pageLoad: 60000, script: 60000 });
  await driver.manage().window().setRect({ width: 1440, height: 1000 });
  const capabilities = await driver.getCapabilities();
  await auditBrowser(
    {
      open: (url) => driver.get(url),
      evaluate: (fn, ...args) => driver.executeScript(fn, ...args),
      wait: (fn, ...args) =>
        driver.wait(() => driver.executeScript(fn, ...args), 30000),
      script: (source) => driver.executeScript(source),
      key: async (selector, key) => {
        const element = await driver.findElement(By.css(selector));
        await driver.executeScript("arguments[0].focus()", element);
        await element.sendKeys(key === "Enter" ? Key.ENTER : key);
      },
      click: async (selector) =>
        (await driver.findElement(By.css(selector))).click(),
      screenshot: async (path) =>
        writeFile(path, Buffer.from(await driver.takeScreenshot(), "base64")),
    },
    {
      name: capabilities.get("browserName"),
      version: capabilities.get("browserVersion"),
      platform: capabilities.get("platformName"),
    },
    "http://127.0.0.1:4173",
    `screenshots/audit/safari-${process.env.EASY_UI_CHART_ENGINE ?? "full"}`,
  );
} finally {
  await driver?.quit();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
