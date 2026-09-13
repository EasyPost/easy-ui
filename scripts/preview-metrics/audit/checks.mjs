import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const axeSource = await readFile(
  new URL("../node_modules/axe-core/axe.min.js", import.meta.url),
  "utf8",
);
const scopes = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];
const trend =
  '[aria-label="Analytical chart examples"] [aria-label="On-time delivery"]';
const scatter = '[aria-label="Cost and speed tradeoffs"]';

// The shared assertions run through real browser input in Playwright and
// Safari WebDriver. Transport differences do not change the tested criteria.
export async function auditBrowser(driver, browser, site, outputDir) {
  await mkdir(outputDir, { recursive: true });
  const report = {
    source: process.env.GITHUB_SHA ?? "local",
    browser,
    site,
    scans: [],
    diagnostics: [],
    checks: [],
  };
  const scan = async (name) => {
    await driver.script(axeSource);
    const result = await driver.evaluate(async (tags) => {
      const { violations, incomplete, testEngine } = await window.axe.run(
        document,
        { runOnly: { type: "tag", values: tags } },
      );
      const summarize = (items) =>
        items.map(({ id, impact, description, helpUrl, nodes }) => ({
          id,
          impact,
          description,
          helpUrl,
          nodes: nodes.map(({ target, failureSummary, html }) => ({
            target,
            failureSummary,
            html,
          })),
        }));
      return {
        engine: testEngine,
        violations: summarize(violations),
        incomplete: summarize(incomplete),
      };
    }, scopes);
    report.scans.push({ name, ...result });
  };
  const diagnostics = async (name) => {
    const values = await driver.evaluate(() => window.__easyUiDiagnostics);
    assert.ok(values, "Preview diagnostics must be installed");
    report.diagnostics.push({ name, ...values });
  };
  try {
    await driver.open(`${site}/`);
    await driver.wait(
      () =>
        document.querySelectorAll('[data-chart-state="ready"] svg').length ===
        24,
    );
    await driver.evaluate(() => document.fonts.ready.then(() => true));
    assert.equal(
      await driver.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
      false,
    );
    await scan("gallery");
    const before = await driver.evaluate(
      (selector) => document.querySelector(`${selector} svg`).innerHTML,
      trend,
    );
    await driver.key(`${trend} button`, "Enter");
    await driver.wait(
      (selector, original) =>
        document.querySelector(`${selector} svg`).innerHTML !== original,
      trend,
      before,
    );
    await driver.click(`${trend} button:last-child`);
    await driver.key(`${scatter} details summary`, "Enter");
    await driver.key(`${scatter} tbody button`, "Enter");
    await driver.wait(
      (selector) =>
        document
          .querySelector(selector)
          .textContent.includes("Selected cohort: a-ground"),
      scatter,
    );
    await driver.key(
      '[aria-label="Observed and plan"] details summary',
      "Enter",
    );
    assert.equal(
      await driver.evaluate(
        () =>
          document.querySelector('[aria-label="Observed and plan"] details')
            .open,
      ),
      true,
    );
    // Expose every data table to axe after the keyboard interaction checks.
    await driver.evaluate(() => {
      document.querySelectorAll("details").forEach((details) => {
        details.open = true;
      });
    });
    await scan("expanded-tables");
    report.checks.push(
      "24 SVG charts",
      "keyboard zoom",
      "keyboard row selection",
      "compact table disclosure",
      "no desktop overflow",
    );
    await driver.screenshot(`${outputDir}/tables.png`);
    await diagnostics("gallery");

    await driver.open(`${site}/?renderer=canvas`);
    await driver.wait(
      () =>
        document.querySelectorAll('[data-chart-state="ready"]').length === 24 &&
        [...document.querySelectorAll('[data-chart-state="ready"]')].every(
          (plot) => plot.querySelector("canvas"),
        ),
    );
    await scan("canvas-gallery");
    report.checks.push("24 Canvas charts");
    await diagnostics("canvas-gallery");

    await driver.open(`${site}/audit.html`);
    await driver.wait(
      () =>
        document.querySelectorAll('[data-chart-state="ready"] svg').length ===
        1,
    );
    await scan("loading-empty-error-partial");
    await driver.key('[aria-label="Retryable observations"] button', "Enter");
    await driver.wait(
      () =>
        document.querySelectorAll('[data-chart-state="ready"] svg').length ===
        2,
    );
    await scan("retry-recovered");
    report.checks.push(
      "loading/empty/error/partial states",
      "keyboard retry recovery",
    );
    await driver.screenshot(`${outputDir}/states.png`);
    await diagnostics("states");

    assert.deepEqual(
      report.scans.flatMap((scan) => scan.violations),
      [],
      "Accessibility violations are recorded in audit.json",
    );
    assert.deepEqual(
      report.diagnostics.flatMap((item) => [...item.errors, ...item.warnings]),
      [],
      "Console errors/warnings are recorded in audit.json",
    );
  } catch (error) {
    report.failure = String(error.stack ?? error);
    throw error;
  } finally {
    await writeFile(
      `${outputDir}/audit.json`,
      JSON.stringify(report, null, 2) + "\n",
    );
  }
  console.log(
    `${browser.name} ${browser.version}: ${report.scans.length} scans passed; no violations, console warnings, or errors.`,
  );
}
