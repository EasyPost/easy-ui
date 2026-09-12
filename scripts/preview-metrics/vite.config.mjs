import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const local = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  publicDir: local("../../.storybook/public"),
  // Keep this review harness independent of the monorepo's install/build.
  esbuild: { tsconfigRaw: { compilerOptions: { jsx: "react-jsx" } } },
  resolve: {
    alias: {
      "overlayscrollbars/overlayscrollbars.css": local(
        "./node_modules/overlayscrollbars/styles/overlayscrollbars.css",
      ),
      ...Object.fromEntries(
        ["react", "react-dom", "lodash", "@easypost/easy-ui-tokens"].map(
          (name) => [name, local(`./node_modules/${name}`)],
        ),
      ),
    },
  },
  css: {
    preprocessorOptions: { scss: { silenceDeprecations: ["legacy-js-api"] } },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
