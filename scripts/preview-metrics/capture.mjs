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
    await page.waitForFunction(
      () =>
        document.querySelectorAll('[data-chart-state="ready"] svg').length ===
        9,
    );
    const gallery = page.getByRole("region", {
      name: "Analytical chart examples",
      exact: true,
    });
    assert.equal(await gallery.getByRole("img").count(), 9);
    for (const svg of await gallery.locator("svg").all()) {
      assert.ok(
        (await svg.locator("path").count()) > 0,
        "Each chart must draw marks",
      );
      assert.doesNotMatch(await svg.innerHTML(), /(?:NaN|Infinity)/);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    assert.equal(overflow, false, `${name} page overflows horizontally`);
    await gallery.screenshot({
      path: `screenshots/analytics-${name}.png`,
      animations: "disabled",
    });
    const sankey = page.getByRole("region", {
      name: "Where parcels go",
      exact: true,
    });
    await sankey.screenshot({
      path: `screenshots/sankey-${name}.png`,
      animations: "disabled",
    });

    const trend = page.getByRole("region", {
      name: "On-time delivery",
      exact: true,
    });
    const beforeZoom = await trend.locator("svg").innerHTML();
    await trend.getByRole("button", { name: "Zoom in", exact: true }).focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction((before) => {
      const chart = document.querySelector(
        '[aria-label="On-time delivery"] svg',
      );
      return chart?.innerHTML !== before;
    }, beforeZoom);
    await trend
      .getByRole("button", { name: "Reset zoom", exact: true })
      .click();

    const scatter = page.getByRole("region", {
      name: "Cost and speed tradeoffs",
      exact: true,
    });
    const marks = scatter.locator('svg path[fill="#113abf"]');
    const largest = await marks.evaluateAll(
      (paths) =>
        paths
          .map((path, index) => ({
            index,
            area:
              path.getBoundingClientRect().width *
              path.getBoundingClientRect().height,
          }))
          .sort((a, b) => b.area - a.area)[0]?.index,
    );
    assert.notEqual(largest, undefined, "Scatter bubbles must be present");
    await marks.nth(largest).click();
    await scatter
      .getByText("Selected cohort: A · Ground", { exact: true })
      .waitFor();
    await scatter.getByText("View data table", { exact: true }).click();
    await scatter
      .getByRole("button", { name: "Select row: A · Ground", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await scatter
      .getByText("Selected cohort: a-ground", { exact: true })
      .waitFor();
    if (name === "desktop")
      await scatter.screenshot({
        path: "screenshots/analytics-data-table.png",
        animations: "disabled",
      });
    await scatter.getByText("View data table", { exact: true }).click();

    const overview = page.getByRole("region", {
      name: "Shipping overview example",
      exact: true,
    });
    assert.equal(await overview.getByRole("img").count(), 4);
    results.push({
      name,
      width,
      chartCount: 9,
      horizontalOverflow: overflow,
      keyboardZoom: true,
      pointerSelection: true,
      keyboardRowSelection: true,
      trendCount: 4,
    });
    await page.close();
  }
  const canvasPage = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  canvasPage.on("pageerror", (error) => errors.push(error.message));
  await canvasPage.goto("http://127.0.0.1:4173?renderer=canvas", {
    waitUntil: "networkidle",
  });
  await canvasPage.waitForFunction(
    () =>
      document.querySelectorAll('[data-chart-state="ready"] canvas').length ===
      9,
  );
  results.push({ name: "canvas", chartCount: 9 });
  await canvasPage.close();
  assert.deepEqual(errors, [], "The examples must not produce browser errors");
  await writeFile(
    "screenshots/validation.json",
    JSON.stringify({ results, errors }, null, 2) + "\n",
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
}
