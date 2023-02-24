/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import glob from "glob";
import { defineConfig } from "vite";

// Maps entries to output locations:
// src/Placeholder/index.ts -> Placeholder/index
// src/utilities/css.ts -> utilities/css
const buildEntryObject = (entries: string[]) =>
  entries.reduce((o, entry) => {
    const alias = entry.replace(/^src\//, "").replace(/.ts$/, "");
    return { ...o, [alias]: entry };
  }, {});

export default defineConfig({
  plugins: [react({ jsxRuntime: "classic" })],
  css: {
    modules: {
      globalModulePaths: [/global\.s?css$/],
    },
  },
  build: {
    outDir: "dist",
    lib: {
      entry: buildEntryObject([
        ...glob.sync("src/**/index.ts"),
        ...glob.sync("src/utilities/*.ts"),
      ]),
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: "./vitest.setup.ts",
  },
});
