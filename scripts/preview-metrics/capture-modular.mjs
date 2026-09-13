import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";

// Fresh processes/pages prevent the full engine's global registration from
// making an incomplete modular preset appear to work.
for (const preset of ["full", "portfolio"]) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["capture.mjs"], {
      stdio: "inherit",
      env: {
        ...process.env,
        EASY_UI_CHART_ENGINE: preset,
        EASY_UI_PREVIEW_OUT_DIR: `dist/modular/${preset}`,
        EASY_UI_SCREENSHOT_DIR: `screenshots/modular/${preset}`,
        EASY_UI_MODULAR_CAPTURE: "1",
      },
    });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${preset} capture exited ${code}`)),
    );
  });
}

const files = (await readdir("screenshots/modular/full"))
  .filter((name) => name.endsWith(".png"))
  .sort();
const expected = (await readdir("screenshots/modular/portfolio"))
  .filter((name) => name.endsWith(".png"))
  .sort();
assert.deepEqual(files, expected);
assert.equal(
  files.filter((name) => /^chart-\d+-desktop\.png$/.test(name)).length,
  26,
);
assert.equal(
  files.filter((name) => /^chart-\d+-mobile\.png$/.test(name)).length,
  26,
);
assert.equal(
  files.filter((name) => /^chart-\d+-canvas\.png$/.test(name)).length,
  26,
);
const comparisons = await Promise.all(
  files.map(async (file) => {
    const [full, modular] = await Promise.all([
      readFile(`screenshots/modular/full/${file}`),
      readFile(`screenshots/modular/portfolio/${file}`),
    ]);
    return { file, identical: full.equals(modular) };
  }),
);
const report = {
  source: process.env.GITHUB_SHA ?? "local",
  method:
    "Byte-identical PNG captures on the same CI runner, separate builds and fresh browsers. Includes all 26 plots at desktop/mobile SVG and desktop Canvas, full galleries, exact-table selection, target/threshold labels, signed tooltips and Sankey adjacency emphasis. Each build also passes the existing pointer, keyboard, overflow and lightweight-isolation assertions. No claim about dense-data runtime speed or unregistered ECharts features.",
  comparisons,
};
await writeFile(
  "screenshots/modular/validation.json",
  JSON.stringify(report, null, 2) + "\n",
);
assert.ok(
  comparisons.every((result) => result.identical),
  `Rendered differences: ${comparisons
    .filter((result) => !result.identical)
    .map((result) => result.file)
    .join(", ")}`,
);
console.log(
  `Modular ECharts: ${comparisons.length} identical screenshots; both galleries passed.`,
);
