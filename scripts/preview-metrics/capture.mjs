import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { preview } from "vite";
import { chromium } from "playwright";

const server = await preview({
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
const browser = await chromium.launch();
const errors = [];
const outputDir = process.env.EASY_UI_PREVIEW_OUT_DIR ?? "dist";
const screenshotDir = process.env.EASY_UI_SCREENSHOT_DIR ?? "screenshots";
const modularCapture = process.env.EASY_UI_MODULAR_CAPTURE === "1";
function observe(page) {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning")
      errors.push(message.text());
  });
}
const results = [];
const manifest = JSON.parse(
  await readFile(`${outputDir}/.vite/manifest.json`, "utf8"),
);
const analyticalAssets = Object.values(manifest)
  .filter((asset) => asset.isDynamicEntry)
  .map((asset) => asset.file);
assert.ok(
  analyticalAssets.length >= 2,
  "Analytical examples and engine must be separate dynamic entries",
);

try {
  await mkdir(screenshotDir, { recursive: true });
  for (const [name, width] of [
    ["desktop", 1440],
    ["mobile", 390],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      deviceScaleFactor: 1,
    });
    observe(page);
    await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(
      () =>
        document.querySelectorAll('[data-chart-state="ready"] svg').length ===
        24,
    );
    const geographyEntry = Object.values(manifest).find((a) =>
      a.src?.endsWith("Chart.geography.tsx"),
    );
    assert.ok(geographyEntry, "Map recipe must remain a dynamic entry");
    assert.equal(
      await page.evaluate(
        (file) =>
          performance
            .getEntriesByType("resource")
            .some((r) => r.name.endsWith(file)),
        geographyEntry.file,
      ),
      false,
      "Map recipe loaded before request",
    );
    await page
      .getByRole("button", { name: "Show logistics maps", exact: true })
      .click();
    await page.waitForFunction(
      () =>
        document.querySelectorAll('[data-chart-state="ready"] svg').length ===
        26,
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
      path: `${screenshotDir}/analytics-${name}.png`,
      animations: "disabled",
    });
    const sankey = gallery.getByRole("region", {
      name: "Where parcels go",
      exact: true,
    });
    await sankey.screenshot({
      path: `${screenshotDir}/sankey-${name}.png`,
      animations: "disabled",
    });

    const trend = gallery.getByRole("region", {
      name: "On-time delivery",
      exact: true,
    });
    if (name === "mobile") {
      await trend.screenshot({
        path: `${screenshotDir}/time-series-mobile.png`,
        animations: "disabled",
      });
      await gallery
        .getByRole("region", {
          name: "Volume by origin and service",
          exact: true,
        })
        .screenshot({
          path: `${screenshotDir}/treemap-mobile.png`,
          animations: "disabled",
        });
    }
    if (modularCapture) {
      for (let i = 0; i < 26; i++) {
        await page
          .locator('[data-chart-state="ready"]')
          .nth(i)
          .screenshot({
            path: `${screenshotDir}/chart-${String(i + 1).padStart(2, "0")}-${name}.png`,
            animations: "disabled",
          });
      }
      // Adjacency emphasis was an important gap in the Recharts experiment.
      const beforeHover = await sankey.locator("svg").innerHTML();
      const blueMarks = sankey.locator('svg path[fill="#113abf"]');
      const nodeIndex = await blueMarks.evaluateAll((paths) =>
        paths.findIndex((path) => {
          const box = path.getBoundingClientRect();
          return box.width <= 16 && box.height > 20;
        }),
      );
      assert.ok(nodeIndex >= 0, "Sankey carrier node must be present");
      // Links share node colors and may have labels over their centers.
      await blueMarks.nth(nodeIndex).hover();
      await page.waitForFunction((before) => {
        return (
          document.querySelector('[aria-label="Where parcels go"] svg')
            ?.innerHTML !== before
        );
      }, beforeHover);
      // ECharts emphasis uses a 300 ms state transition independently of
      // Playwright's CSS-animation disabling. Capture its settled state.
      await page.waitForTimeout(350);
      await sankey.screenshot({
        path: `${screenshotDir}/sankey-emphasis-${name}.png`,
        animations: "disabled",
      });
      await page.mouse.move(0, 0);
    }
    const beforeZoom = await trend.locator("svg").innerHTML();
    await trend.getByRole("button", { name: "Zoom in", exact: true }).focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction((before) => {
      const chart = document.querySelector(
        '[aria-label="On-time delivery"] [data-chart-state="ready"] svg',
      );
      return chart?.innerHTML !== before;
    }, beforeZoom);
    await trend
      .getByRole("button", { name: "Reset zoom", exact: true })
      .click();

    const scatter = gallery.getByRole("region", {
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
    if (name === "desktop") {
      // The pointer can remain over the plot after its table scrolls into view.
      // Capture the keyboard-selected table with the prior tooltip dismissed.
      await page.mouse.move(0, 0);
      await scatter
        .getByText("2,400 parcels", { exact: true })
        .waitFor({ state: "hidden" });
      await scatter.screenshot({
        path: `${screenshotDir}/analytics-data-table.png`,
        animations: "disabled",
      });
    }
    await scatter.getByText("View data table", { exact: true }).click();

    const lightweight = page.getByRole("region", {
      name: "Lightweight chart examples",
      exact: true,
    });
    await lightweight.screenshot({
      path: `${screenshotDir}/lightweight-${name}.png`,
      animations: "disabled",
    });
    assert.equal(
      await lightweight
        .getByRole("list", { name: "June parcel volume by service" })
        .getByRole("listitem")
        .count(),
      3,
    );
    assert.equal(
      await lightweight
        .getByRole("region", { name: "Compact trend examples", exact: true })
        .getByRole("img")
        .count(),
      4,
    );
    const native = page.getByRole("region", {
      name: "Native chart extensions",
      exact: true,
    });
    const extensions = page.getByRole("region", {
      name: "Analytical chart extensions",
      exact: true,
    });
    assert.equal(await extensions.getByRole("img").count(), 9);
    for (const svg of await extensions.locator("svg").all()) {
      assert.ok((await svg.locator("path").count()) > 0);
      assert.doesNotMatch(await svg.innerHTML(), /(?:NaN|Infinity)/);
    }
    for (const [kind, region] of [
      ["native-extensions", native],
      ["analytical-extensions", extensions],
      [
        "logistics",
        page.getByRole("region", {
          name: "Logistics intelligence examples",
          exact: true,
        }),
      ],
      [
        "logistics-maps",
        page.getByRole("region", {
          name: "Logistics map examples",
          exact: true,
        }),
      ],
    ]) {
      await region.screenshot({
        path: `${screenshotDir}/${kind}-${name}.png`,
        animations: "disabled",
      });
    }
    const waterfall = extensions.getByRole("region", {
      name: "From receipts to contribution",
      exact: true,
    });
    await waterfall.locator('svg path[fill="#9b5900"]').first().hover();
    await waterfall.getByText("Delivery: $-9,000", { exact: true }).waitFor();
    await waterfall.getByText("Balance: $15,000", { exact: true }).waitFor();
    assert.doesNotMatch(
      await waterfall.locator("svg").textContent(),
      /<br\s*\/?\s*>/,
    );
    if (name === "desktop")
      await waterfall.screenshot({
        path: `${screenshotDir}/waterfall-tooltip.png`,
        animations: "disabled",
      });
    await page.mouse.move(0, 0);

    const parcelMap = page.getByRole("region", {
      name: "Parcel scan paths",
      exact: true,
    });
    await parcelMap.locator("summary").press("Enter");
    await parcelMap
      .getByRole("button", { name: "Select row: P-105", exact: true })
      .press("Enter");
    await parcelMap.getByText(/P-105: Stale scan/).waitFor();
    await page.getByLabel("Warehouse", { exact: true }).selectOption("Dallas");
    await parcelMap.getByText(/P-201: Delivered/).waitFor();
    assert.equal(await parcelMap.locator("tbody tr").count(), 2);
    if (name === "desktop")
      await page
        .getByRole("region", { name: "Logistics map examples", exact: true })
        .screenshot({
          path: `${screenshotDir}/parcel-warehouse-filter.png`,
          animations: "disabled",
        });
    await page
      .getByLabel("Warehouse", { exact: true })
      .selectOption("All warehouses");
    await page.getByLabel("Parcel", { exact: true }).selectOption("P-104");
    await parcelMap.locator("summary").press("Enter");
    const compact = native.getByRole("figure", {
      name: "Observed and plan",
      exact: true,
    });
    await compact.getByText("View data", { exact: true }).focus();
    await page.keyboard.press("Enter");
    assert.equal(await compact.getByRole("table").isVisible(), true);
    await compact.getByText("View data", { exact: true }).click();
    const overview = page.getByRole("region", {
      name: "Shipping overview example",
      exact: true,
    });
    assert.equal(await overview.getByRole("img").count(), 4);
    results.push({
      name,
      width,
      chartCount: 26,
      horizontalOverflow: overflow,
      keyboardZoom: true,
      pointerSelection: true,
      keyboardRowSelection: true,
      trendCount: 8,
      barListRows: 3,
      bulletCharts: 2,
      compactTimeSeries: 4,
      rangePlots: 2,
      compactKeyboardData: true,
      waterfallTooltip: true,
    });
    await page.close();
  }
  const reviewPage = await browser.newPage({
    viewport: { width: 960, height: 1000 },
  });
  observe(reviewPage);
  await reviewPage.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await reviewPage.evaluate(() => document.fonts.ready);
  await reviewPage.waitForFunction(
    () =>
      document.querySelectorAll('[data-chart-state="ready"] svg').length === 24,
  );
  await reviewPage
    .getByRole("button", { name: "Show logistics maps", exact: true })
    .click();
  await reviewPage.waitForFunction(
    () =>
      document.querySelectorAll('[data-chart-state="ready"] svg').length === 26,
  );
  await reviewPage
    .getByRole("region", { name: "Analytical chart examples", exact: true })
    .screenshot({
      path: `${screenshotDir}/analytics-review.png`,
      animations: "disabled",
    });
  await reviewPage
    .getByRole("region", { name: "Lightweight chart examples", exact: true })
    .screenshot({
      path: `${screenshotDir}/lightweight-review.png`,
      animations: "disabled",
    });
  for (const [name, label] of [
    ["native-extensions", "Native chart extensions"],
    ["analytical-extensions", "Analytical chart extensions"],
    ["logistics", "Logistics intelligence examples"],
    ["logistics-maps", "Logistics map examples"],
  ]) {
    await reviewPage
      .getByRole("region", { name: label, exact: true })
      .screenshot({
        path: `${screenshotDir}/${name}-review.png`,
        animations: "disabled",
      });
  }
  await reviewPage.close();
  const lightPage = await browser.newPage({
    viewport: { width: 960, height: 1000 },
  });
  const lightRequests = [];
  observe(lightPage);
  lightPage.on("request", (request) => lightRequests.push(request.url()));
  await lightPage.goto("http://127.0.0.1:4173?portfolio=lightweight", {
    waitUntil: "networkidle",
  });
  assert.equal(await lightPage.locator("[data-chart-state]").count(), 0);
  assert.equal(
    lightRequests.some((url) =>
      analyticalAssets.some((asset) =>
        new URL(url).pathname.endsWith(`/${asset}`),
      ),
    ),
    false,
    "Lightweight gallery must not request the analytical engine or fixtures",
  );
  results.push({ name: "lightweight-only", analyticalRequests: 0 });
  await lightPage.close();
  const canvasPage = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  observe(canvasPage);
  await canvasPage.goto("http://127.0.0.1:4173?renderer=canvas", {
    waitUntil: "networkidle",
  });
  await canvasPage.waitForFunction(
    () =>
      document.querySelectorAll('[data-chart-state="ready"]').length === 24 &&
      [...document.querySelectorAll('[data-chart-state="ready"]')].every(
        (plot) => plot.querySelector("canvas"),
      ),
  );
  await canvasPage
    .getByRole("button", { name: "Show logistics maps", exact: true })
    .click();
  await canvasPage.waitForFunction(
    () =>
      document.querySelectorAll('[data-chart-state="ready"]').length === 26 &&
      [...document.querySelectorAll('[data-chart-state="ready"]')].every((p) =>
        p.querySelector("canvas"),
      ),
  );
  if (modularCapture) {
    for (let i = 0; i < 26; i++) {
      await canvasPage
        .locator('[data-chart-state="ready"]')
        .nth(i)
        .screenshot({
          path: `${screenshotDir}/chart-${String(i + 1).padStart(2, "0")}-canvas.png`,
          animations: "disabled",
        });
    }
  }
  results.push({ name: "canvas", chartCount: 26 });
  await canvasPage.close();
  assert.deepEqual(errors, [], "The examples must not produce browser errors");
  await writeFile(
    `${screenshotDir}/validation.json`,
    JSON.stringify(
      { source: process.env.GITHUB_SHA ?? "local", results, errors },
      null,
      2,
    ) + "\n",
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
}
