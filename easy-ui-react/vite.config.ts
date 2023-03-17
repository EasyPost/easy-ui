/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import glob from "glob";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { cleanPkgJsonForDist } from "../scripts/copyPkgJsonForDist.mjs";

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "classic" }),
    viteStaticCopy({
      targets: [
        { src: "package.json", dest: ".", transform: cleanPkgJsonForDist },
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
    lib: {
      entry: buildEntryObject([
        ...glob.sync("src/**/index.ts"),
        ...glob.sync("src/utilities/*.ts", { ignore: ["**/*.test.ts"] }),
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
