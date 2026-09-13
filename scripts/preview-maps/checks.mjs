import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const zoom = () =>
  Number(document.querySelector("[data-map-zoom]")?.dataset.mapZoom);
const ready = () =>
  document.querySelector('[data-map-state="ready"]') &&
  document.querySelector('[data-map-idle="true"]');
export async function auditMaps(browser, identity, base, output) {
  await mkdir(output, { recursive: true });
  const checks = [],
    scans = [],
    screenshots = [],
    resources = [];
  const check = (name, value) => {
    assert(value, name);
    checks.push(name);
  };
  async function settle() {
    await browser.wait(ready);
    await browser.wait(() => document.fonts.status === "loaded");
    await browser.wait(
      () => !document.querySelector('[data-map-state="loading"]'),
    );
  }
  async function capture(name) {
    console.log(`Capture ${identity.name}: ${name}`);
    await settle();
    await browser.evaluate(() => window.scrollTo(0, 0));
    await browser.screenshot(`${output}/${name}.png`);
    screenshots.push(name);
  }
  async function scan(name) {
    await browser.script(
      await readFile(
        new URL("./node_modules/axe-core/axe.min.js", import.meta.url),
        "utf8",
      ),
    );
    const results = await browser.axe();
    scans.push({ name, violations: results.violations });
    await writeFile(
      `${output}/axe-${name}.json`,
      JSON.stringify(results, null, 2),
    );
    check(
      `${name}: no accessibility violations`,
      results.violations.length === 0,
    );
  }
  async function clean(name) {
    const messages = await browser.evaluate(() => window.__mapMessages);
    await writeFile(
      `${output}/console-${name}.json`,
      JSON.stringify(messages, null, 2),
    );
    check(`${name}: no console warnings or errors`, messages.length === 0);
    check(
      `${name}: basemap loaded without error notice`,
      await browser.evaluate(
        () =>
          !document.body.innerText.includes("Some basemap data could not load"),
      ),
    );
    resources.push({
      name,
      tiles: await browser.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .filter((r) => r.name.includes("tiles.openfreemap.org"))
          .map((r) => ({
            url: r.name,
            encodedBytes: r.encodedBodySize || null,
            transferBytes: r.transferSize || null,
          })),
      ),
    });
  }
  try {
    console.log(`Starting ${identity.name} audit`);
    await browser.resize(1440, 1100);
    await browser.open(`${base}/?audience=parcel`);
    await settle();
    await capture("parcel-regional-desktop");
    await scan("parcel");
    check(
      "parcel starts at regional zoom",
      (await browser.evaluate(zoom)) > 8 && (await browser.evaluate(zoom)) < 10,
    );
    await browser.click('[aria-label$="camera and layers"] button:first-child');
    await settle();
    check(
      "Entire journey fits national hops",
      (await browser.evaluate(zoom)) < 5,
    );
    await capture("parcel-national-desktop");
    await browser.click(
      '[aria-label$="camera and layers"] button:nth-child(3)',
    );
    await settle();
    check(
      "Latest events zooms to distribution streets",
      (await browser.evaluate(zoom)) >= 11.9,
    );
    await capture("parcel-local-desktop");
    await browser.key('[aria-label="Focus Accepted at origin"]', "Enter");
    await settle();
    check(
      "keyboard event selection links to map",
      await browser.evaluate(
        () =>
          document
            .querySelector('.maplibregl-marker[data-selected="true"]')
            ?.getAttribute("title") === "Oakland warehouse",
      ),
    );
    await browser.click(
      '[aria-label$="camera and layers"] button:nth-child(2)',
    );
    await settle();
    check(
      "Selected leg fits regional handoff",
      (await browser.evaluate(zoom)) > 9,
    );
    await browser.click(".maplibregl-ctrl-zoom-in");
    await settle();
    const before = await browser.evaluate(zoom);
    await browser.click(
      '[aria-label$="camera and layers"] label:first-child input',
    );
    check(
      "risk toggle preserves manual camera",
      Math.abs((await browser.evaluate(zoom)) - before) < 0.01,
    );
    await browser.click(
      '[aria-label$="camera and layers"] label:first-child input',
    );
    await browser.click("summary");
    await scan("parcel-data");
    await clean("parcel");
    await browser.open(`${base}/?audience=shipper`);
    await settle();
    await capture("shipper-network-desktop");
    await scan("shipper");
    check(
      "shipper sample includes all five parcels",
      await browser.evaluate(
        () =>
          document.querySelectorAll('[aria-label^="Inspect parcel"]').length ===
          5,
      ),
    );
    const networkZoom = await browser.evaluate(zoom);
    await browser.select('[aria-label="Origin warehouse"]', "dal");
    await browser.wait(
      () =>
        document.querySelectorAll('[aria-label^="Inspect parcel"]').length ===
        2,
    );
    check(
      "warehouse filter preserves camera",
      Math.abs((await browser.evaluate(zoom)) - networkZoom) < 0.01,
    );
    check(
      "filtered origin markers remove Oakland and Newark",
      await browser.evaluate(
        () =>
          !document.querySelector('[title="Oakland warehouse"]') &&
          !document.querySelector('[title="Newark warehouse"]'),
      ),
    );
    await capture("shipper-warehouse-filter");
    await browser.key('[aria-label="Inspect parcel EP-202"]', "Enter");
    await settle();
    check(
      "parcel sample selection locates Livonia",
      await browser.evaluate(
        () =>
          document
            .querySelector('.maplibregl-marker[data-selected="true"]')
            ?.getAttribute("title") === "Livonia distribution",
      ),
    );
    await clean("shipper");
    await browser.open(`${base}/?audience=carrier`);
    await settle();
    await capture("carrier-risk-desktop");
    await scan("carrier");
    await browser.click(
      '[aria-label$="camera and layers"] label:first-child input',
    );
    check(
      "risk layer can be disabled",
      await browser.evaluate(
        () => !document.querySelector('[data-risk="elevated"]'),
      ),
    );
    await browser.click(
      '[aria-label$="camera and layers"] label:first-child input',
    );
    const weatherZoom = await browser.evaluate(zoom);
    await browser.click(
      '[aria-label$="camera and layers"] label:last-child input',
    );
    check(
      "weather layer preserves camera",
      Math.abs((await browser.evaluate(zoom)) - weatherZoom) < 0.01,
    );
    check(
      "weather has source, interval and forecast semantics",
      await browser.evaluate(
        () =>
          document.body.innerText.includes("forecast") &&
          document.body.innerText.includes(
            "Exposure does not establish a cause",
          ),
      ),
    );
    await capture("carrier-weather-desktop");
    await scan("carrier-weather");
    await browser.key(
      '[aria-label="Inspect facility Warren distribution"]',
      "Enter",
    );
    await settle();
    check(
      "unknown facility risk stays unavailable",
      await browser.evaluate(
        () =>
          document
            .querySelector(
              '.maplibregl-marker[data-selected="true"][data-risk="unknown"]',
            )
            ?.getAttribute("title") === "Warren distribution",
      ),
    );
    await browser.click("summary");
    await scan("carrier-data");
    await clean("carrier");
    await browser.resize(390, 1000);
    for (const audience of ["parcel", "shipper", "carrier"]) {
      await browser.open(`${base}/?audience=${audience}`);
      await settle();
      check(
        `${audience}: no page overflow at 390px`,
        await browser.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await capture(`${audience}-mobile`);
      await scan(`${audience}-mobile`);
    }
    await browser.open(`${base}/lightweight.html`);
    await browser.wait(() => document.querySelector('svg[role="img"]'));
    const requests = await browser.evaluate(() =>
      performance.getEntriesByType("resource").map((r) => r.name),
    );
    check(
      "native SVG page loads no MapLibre, map CSS or tiles",
      !requests.some((r) => /maplibre|NetworkMap|tiles\.openfreemap/.test(r)),
    );
    await scan("lightweight");
  } catch (error) {
    await browser.screenshot(`${output}/failure.png`).catch(() => {});
    const diagnostic = await browser
      .evaluate(() => ({
        messages: window.__mapMessages,
        mapState: document.querySelector("[data-map-state]")?.dataset,
        idle: document.querySelector("[data-map-idle]")?.dataset.mapIdle,
        resources: performance.getEntriesByType("resource").map((r) => r.name),
      }))
      .catch((error) => String(error));
    await writeFile(
      `${output}/diagnostic.json`,
      JSON.stringify(diagnostic, null, 2),
    );
    await writeFile(`${output}/failure.txt`, String(error.stack ?? error));
    throw error;
  } finally {
    await writeFile(
      `${output}/report.json`,
      JSON.stringify(
        {
          sourceCommit: process.env.GITHUB_SHA,
          identity,
          checks,
          scans,
          screenshots,
          resources,
        },
        null,
        2,
      ) + "\n",
    );
  }
}
