import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build, mergeConfig } from "vite";
import config from "./vite.config.mjs";

const results = [];
for (const components of [
  ["MetricCard", "Sparkline"],
  ["MetricCard", "Sparkline", "BarList", "BulletChart"],
]) {
  const result = await build(
    mergeConfig(config, {
      configFile: false,
      logLevel: "error",
      publicDir: false,
      plugins: [
        {
          name: "measurement-entry",
          resolveId(id) {
            if (id === "virtual:measurement") return "\0measurement";
          },
          load(id) {
            if (id === "\0measurement")
              return components
                .map(
                  (name) =>
                    `export { ${name} } from ${JSON.stringify(fileURLToPath(new URL(`../../easy-ui-react/src/${name}/index.ts`, import.meta.url)))};`,
                )
                .join("\n");
          },
        },
      ],
      build: {
        write: false,
        rollupOptions: {
          input: "virtual:measurement",
          preserveEntrySignatures: "strict",
          external: (id) =>
            /^react(?:\/|$)/.test(id) || /\/node_modules\/react\//.test(id),
        },
      },
    }),
  );
  const output = Array.isArray(result)
    ? result.flatMap((entry) => entry.output)
    : result.output;
  const chunks = output.filter((entry) => entry.type === "chunk");
  const modules = chunks.flatMap((chunk) => Object.keys(chunk.modules));
  assert.equal(
    modules.some((id) => /node_modules\/(echarts|zrender|react)\//.test(id)),
    false,
  );
  const css = output.filter(
    (entry) => entry.type === "asset" && entry.fileName.endsWith(".css"),
  );
  results.push({
    components,
    javascriptBytes: chunks.reduce(
      (sum, chunk) => sum + Buffer.byteLength(chunk.code),
      0,
    ),
    javascriptGzipBytes: chunks.reduce(
      (sum, chunk) => sum + gzipSync(chunk.code).length,
      0,
    ),
    cssBytes: css.reduce(
      (sum, asset) => sum + Buffer.byteLength(asset.source),
      0,
    ),
    cssGzipBytes: css.reduce(
      (sum, asset) => sum + gzipSync(asset.source).length,
      0,
    ),
    analyticalEngineIncluded: false,
  });
}
const report = {
  method:
    "Vite production source entry with exported components retained. Includes transitive Easy UI primitives. React external. Global styles, tokens, fonts, and application data excluded. Decimal bytes; gzip per emitted asset. Consumer bundlers may differ.",
  results,
};
await writeFile(
  "dist/bundle-sizes.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
