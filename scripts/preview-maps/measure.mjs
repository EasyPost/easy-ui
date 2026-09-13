import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
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
async function size(keys) {
  const files = [
    ...new Set(
      [...keys].flatMap((k) => [manifest[k].file, ...(manifest[k].css ?? [])]),
    ),
  ].filter((f) => /\.(js|css)$/.test(f));
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
  notes: [
    "Production Vite consumer, gzip per asset; includes React and demo application where applicable.",
    "MapLibre's worker implementation is embedded in its JS bundle and started using a Blob URL; counted with engine JS.",
    "Fonts and viewport-dependent raster tiles are separate requests; tile request counts are recorded by browser audit. Cross-origin transfer sizes may be unavailable.",
    "Engine is optional and lazy. Lightweight SVG consumers do not import MapLibre or its CSS.",
  ],
};
await writeFile(
  "dist/bundle-report.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
