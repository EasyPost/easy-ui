import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build, mergeConfig } from "vite";
import { previewConfig } from "./vite.config.mjs";

const local = (path) => fileURLToPath(new URL(path, import.meta.url));
const results = [];
for (const preset of ["full", "portfolio"]) {
  const outDir = `dist/modular/${preset}`;
  const result = await build({
    ...previewConfig(preset, outDir),
    configFile: false,
    logLevel: "error",
  });
  const chunks = result.output.filter((asset) => asset.type === "chunk");
  const includedModules = chunks.flatMap((chunk) => Object.keys(chunk.modules));
  if (preset === "portfolio") {
    assert.ok(
      includedModules.some((id) => id.endsWith("/echarts/lib/core/echarts.js")),
    );
    assert.equal(
      includedModules.some((id) =>
        /\/echarts\/(index\.js|lib\/echarts\.js)$/.test(id),
      ),
      false,
      "Modular build must not include the full ECharts entry",
    );
    for (const name of [
      "gauge",
      "graph",
      "radar",
      "sunburst",
      "funnel",
      "parallel",
      "candlestick",
    ])
      assert.equal(
        includedModules.some((id) =>
          id.includes(`/echarts/lib/chart/${name}/`),
        ),
        false,
        `Unused ${name} series must be absent`,
      );
  }
  const manifest = JSON.parse(
    await readFile(`${outDir}/.vite/manifest.json`, "utf8"),
  );
  const visited = new Set(),
    files = new Set();
  function visit(key) {
    if (visited.has(key)) return;
    visited.add(key);
    const entry = manifest[key];
    files.add(entry.file);
    for (const css of entry.css ?? []) files.add(css);
    for (const imported of [
      ...(entry.imports ?? []),
      ...(entry.dynamicImports ?? []),
    ])
      visit(imported);
  }
  visit("index.html");
  const assets = await Promise.all(
    [...files].sort().map(async (file) => {
      const bytes = await readFile(`${outDir}/${file}`);
      return { file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length };
    }),
  );
  const sum = (extension) =>
    assets
      .filter((asset) => asset.file.endsWith(extension))
      .reduce((total, asset) => total + asset.gzipBytes, 0);
  results.push({
    preset,
    javascriptGzipBytes: sum(".js"),
    cssGzipBytes: sum(".css"),
    assets,
  });
}

const engines = [];
for (const preset of ["full", "portfolio", "trend"]) {
  const source =
    preset === "full" ? "echarts" : local(`./modular/${preset}.mjs`);
  const result = await build(
    mergeConfig(previewConfig(), {
      configFile: false,
      logLevel: "error",
      publicDir: false,
      plugins: [
        {
          name: "engine-size-entry",
          resolveId(id) {
            if (id === "virtual:engine-size") return "\0engine-size";
          },
          load(id) {
            if (id === "\0engine-size")
              return `export { init } from ${JSON.stringify(source)};`;
          },
        },
      ],
      build: {
        write: false,
        rollupOptions: {
          input: "virtual:engine-size",
          preserveEntrySignatures: "strict",
        },
      },
    }),
  );
  const chunks = result.output.filter((asset) => asset.type === "chunk");
  engines.push({
    preset,
    javascriptBytes: chunks.reduce(
      (total, chunk) => total + Buffer.byteLength(chunk.code),
      0,
    ),
    javascriptGzipBytes: chunks.reduce(
      (total, chunk) => total + gzipSync(chunk.code).length,
      0,
    ),
    fullPortfolio: preset !== "trend",
    renderers: preset === "trend" ? ["svg"] : ["svg", "canvas"],
  });
}

const report = {
  source: process.env.GITHUB_SHA ?? "local",
  version: "6.1.0",
  method:
    "Two independent Vite production builds of the unchanged gallery: all 18 analytical recipes and all six native components. Full dependency closure from index.html including lazy imports; React, Easy UI, tokens and fixtures included. Gzip per unique asset; CSS separate and fonts excluded. Each preset runs on a separate page so ECharts' global module registry cannot contaminate the result. Module inventory asserts unused chart implementations and the full entry are absent from the modular build.",
  engineMethod:
    "Separate production entries exporting only init with each preset's registration retained. Excludes React, Easy UI and fixtures. The trend preset is a size probe with reduced capabilities, not a full-portfolio substitute. Transfer measurements only; no runtime-speed claim.",
  results,
  engines,
};
await mkdir("dist/modular", { recursive: true });
await writeFile(
  "dist/modular/bundle-sizes.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    { results: results.map(({ assets, ...summary }) => summary), engines },
    null,
    2,
  ),
);
