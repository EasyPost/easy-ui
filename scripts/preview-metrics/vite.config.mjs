import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const local = (path) => fileURLToPath(new URL(path, import.meta.url));

export function previewConfig(engine = "full", outDir = "dist") {
  if (!["full", "portfolio"].includes(engine))
    throw new Error(`Unknown chart engine preset: ${engine}`);
  return defineConfig({
    // Substitute only the private preview's loader. Production Chart keeps its
    // full-engine default; native components still never import a chart engine.
    plugins:
      engine === "portfolio"
        ? [
            {
              name: "modular-chart-preview",
              enforce: "pre",
              load(id) {
                if (id === local("../../easy-ui-react/src/Chart/engine.ts"))
                  return `export function loadChartEngine() { return import(${JSON.stringify(local("./modular/portfolio.mjs"))}); }`;
              },
            },
          ]
        : [],
    publicDir: local("../../.storybook/public"),
    // Keep this review harness independent of the monorepo's install/build.
    esbuild: {
      tsconfigRaw: JSON.stringify({ compilerOptions: { jsx: "react-jsx" } }),
    },
    resolve: {
      alias: {
        "overlayscrollbars/overlayscrollbars.css": local(
          "./node_modules/overlayscrollbars/styles/overlayscrollbars.css",
        ),
        ...Object.fromEntries(
          [
            "react",
            "react-dom",
            "lodash",
            "@easypost/easy-ui-tokens",
            "echarts",
          ].map((name) => [name, local(`./node_modules/${name}`)]),
        ),
      },
    },
    css: {
      preprocessorOptions: { scss: { silenceDeprecations: ["legacy-js-api"] } },
    },
    build: { manifest: true, outDir, emptyOutDir: true },
  });
}

export default previewConfig(
  process.env.EASY_UI_CHART_ENGINE,
  process.env.EASY_UI_PREVIEW_OUT_DIR,
);
