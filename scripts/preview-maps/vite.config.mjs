import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
const local = (path) => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({
  base: process.env.EASY_UI_PREVIEW_BASE || "/",
  publicDir: local("../../.storybook/public"),
  esbuild: {
    tsconfigRaw: JSON.stringify({ compilerOptions: { jsx: "react-jsx" } }),
  },
  resolve: {
    alias: {
      "overlayscrollbars/overlayscrollbars.css": local(
        "./node_modules/overlayscrollbars/styles/overlayscrollbars.css",
      ),
      ...Object.fromEntries(
        ["react", "react-dom", "maplibre-gl", "@easypost/easy-ui-tokens"].map(
          (name) => [name, local(`./node_modules/${name}`)],
        ),
      ),
    },
  },
  css: {
    preprocessorOptions: { scss: { silenceDeprecations: ["legacy-js-api"] } },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        gallery: local("./index.html"),
        lightweight: local("./lightweight.html"),
      },
    },
  },
});
