import assert from "node:assert/strict";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
function closure(key, dynamic = false, seen = new Set()) {
  if (seen.has(key)) return seen;
  seen.add(key);
  for (const next of [
    ...(manifest[key].imports ?? []),
    ...(dynamic ? (manifest[key].dynamicImports ?? []) : []),
  ])
    closure(next, dynamic, seen);
  return seen;
}
const workerFiles = (await readdir("dist/assets"))
  .filter((name) => /^maplibre-gl-worker-.*\.js$/.test(name))
  .map((name) => `assets/${name}`);
assert.equal(
  workerFiles.length,
  1,
  "The standalone module worker must be emitted",
);
async function size(keys) {
  const files = [
    ...new Set(
      [...keys].flatMap((k) => [
        manifest[k].file,
        ...(manifest[k].css ?? []),
        ...(manifest[k].assets ?? []),
      ]),
    ),
  ].filter((f) => /\.(js|css)$/.test(f));
  const code = (
    await Promise.all(
      files
        .filter((f) => f.endsWith(".js"))
        .map((f) => readFile(`dist/${f}`, "utf8")),
    )
  ).join("\n");
  for (const worker of workerFiles)
    if (code.includes(worker.split("/").at(-1)) && !files.includes(worker))
      files.push(worker);
  const assets = await Promise.all(
    files.map(async (file) => {
      const b = await readFile(`dist/${file}`);
      return { file, rawBytes: b.length, gzipBytes: gzipSync(b).length };
    }),
  );
  return {
    javascriptGzipBytes: assets
      .filter((a) => a.file.endsWith(".js"))
      .reduce((n, a) => n + a.gzipBytes, 0),
    cssGzipBytes: assets
      .filter((a) => a.file.endsWith(".css"))
      .reduce((n, a) => n + a.gzipBytes, 0),
    assets,
  };
}
const lightweight = closure("lightweight.html", true);
assert(
  ![...lightweight].some((k) => /maplibre|NetworkMap/.test(k)),
  "Native SVG entry must exclude maps",
);
const engine = Object.keys(manifest).find((k) => /maplibre-gl/.test(k));
assert(engine, "MapLibre must be an independent lazy chunk");
assert(
  !closure("index.html").has(engine),
  "MapLibre must not be in the synchronous gallery closure",
);
const report = {
  sourceCommit: process.env.GITHUB_SHA ?? "local",
  maplibreVersion: "6.9.0",
  galleryIncludingMaps: await size(closure("index.html", true)),
  galleryInitial: await size(closure("index.html")),
  lightweight: await size(lightweight),
  mapEngine: await size(closure(engine)),
  workerAssets: (await size(closure("index.html", true))).assets.filter((a) =>
    /worker/.test(a.file),
  ),
  notes: [
    "Production Vite consumer, gzip per asset; includes React and demo application where applicable.",
    "MapLibre 6 uses a separate module worker. Vite bundles and emits that worker; its complete file size is included in gallery JavaScript and listed separately. Shared code can be duplicated between the main and worker bundles.",
    "Fonts and viewport-dependent basemap tiles are separate requests; tile request counts are recorded by browser audit. Cross-origin transfer sizes may be unavailable.",
    "Engine is optional and lazy. Lightweight SVG consumers do not import MapLibre or its CSS.",
  ],
};
assert.equal(
  report.workerAssets.length,
  1,
  "Map totals must include the worker",
);
assert(
  !report.lightweight.assets.some((a) => /worker|maplibre/.test(a.file)),
  "Native total excludes map and worker code",
);
await writeFile(
  "dist/bundle-report.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
