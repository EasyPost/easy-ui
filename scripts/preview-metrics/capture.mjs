import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { preview } from "vite";
import { chromium } from "playwright";

const server = await preview({
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
const browser = await chromium.launch();
const errors = [];
const results = [];

try {
  await mkdir("screenshots", { recursive: true });
  for (const [name, width] of [
    ["desktop", 1440],
    ["mobile", 390],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const overview = page.getByRole("region", {
      name: "Shipping overview example",
      exact: true,
    });
    await overview.getByText("24,810", { exact: true }).waitFor();
    assert.equal(await overview.getByRole("img").count(), 4);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    assert.equal(overflow, false, `${name} page overflows horizontally`);
    await page.screenshot({
      path: `screenshots/metric-card-${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
    results.push({ name, width, horizontalOverflow: overflow, trendCount: 4 });
    await page.close();
  }
  assert.deepEqual(errors, [], "The examples must not produce browser errors");
  await writeFile(
    "screenshots/validation.json",
    JSON.stringify({ results, errors }, null, 2),
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
}
