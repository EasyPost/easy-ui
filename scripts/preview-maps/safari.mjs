import { writeFile } from "node:fs/promises";
import { Builder, By, Key } from "selenium-webdriver";
import { preview } from "vite";
import { auditMaps } from "./checks.mjs";
const server = await preview({
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
let driver;
try {
  driver = await new Builder().forBrowser("safari").build();
  await driver
    .manage()
    .setTimeouts({ implicit: 0, pageLoad: 60000, script: 60000 });
  const caps = await driver.getCapabilities();
  await auditMaps(
    {
      open: (url) => driver.get(url),
      resize: (width, height) =>
        driver.manage().window().setRect({ width, height }),
      evaluate: (fn, ...args) => driver.executeScript(fn, ...args),
      wait: (fn) => driver.wait(() => driver.executeScript(fn), 60000),
      script: (source) => driver.executeScript(source),
      axe: () =>
        driver.executeAsyncScript(
          "const done=arguments[arguments.length-1]; window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}}).then(done).catch(e=>done({violations:[{error:String(e)}]}));",
        ),
      click: async (selector) =>
        (await driver.findElement(By.css(selector))).click(),
      key: async (selector, key) => {
        const el = await driver.findElement(By.css(selector));
        await driver.executeScript("arguments[0].focus()", el);
        await el.sendKeys(key === "Enter" ? Key.ENTER : key);
      },
      select: (selector, value) =>
        driver.executeScript(
          "const el=document.querySelector(arguments[0]); el.value=arguments[1]; el.dispatchEvent(new Event('change',{bubbles:true}));",
          selector,
          value,
        ),
      screenshot: async (path) =>
        writeFile(path, Buffer.from(await driver.takeScreenshot(), "base64")),
    },
    {
      name: caps.get("browserName"),
      version: caps.get("browserVersion"),
      platform: caps.get("platformName"),
    },
    "http://127.0.0.1:4173",
    "screenshots/safari",
  );
} finally {
  await driver?.quit().catch(() => {});
  await new Promise((resolve) => server.httpServer.close(resolve));
}
