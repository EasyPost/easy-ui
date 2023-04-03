/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import glob from "glob";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { cleanPkgJsonForDist } from "../scripts/copyDistFiles.mjs";

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "classic" }),
    viteStaticCopy({
      targets: [
        { src: "package.json", dest: ".", transform: cleanPkgJsonForDist },
        { src: "README.md", dest: "." },
        { src: "CHANGELOG.md", dest: "." },
      ],
    }),
  ],
  css: {
    modules: {
      globalModulePaths: [/global\.s?css$/],
    },
  },
  build: {
    emptyOutDir: false,
    target: "es2015",
    minify: false,
    lib: {
      entry: buildEntryObject([
        ...glob.sync("src/**/index.ts"),
        ...glob.sync("src/utilities/*.ts", { ignore: ["**/*.test.ts"] }),
      ]),
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: [
        {
          format: "cjs",
          entryFileNames: "[name].js",
          chunkFileNames: "__chunks__/[name]-[hash].js",
        },
        {
          format: "esm",
          entryFileNames: "[name].mjs",
          chunkFileNames: "__chunks__/[name]-[hash].mjs",
        },
      ],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: "./vitest.setup.ts",
  },
});

// Maps entry filenames to entries with proper aliases:
//
// src/Icon/index.ts -> Icon/index
// src/utilities/css.ts -> utilities/css
function buildEntryObject(entries: string[]) {
  return entries.reduce((o, entry) => {
    const alias = entry.replace(/^src\//, "").replace(/.ts$/, "");
    return { ...o, [alias]: entry };
  }, {});
}
