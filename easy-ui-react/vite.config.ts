/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import glob from "glob";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "classic" }),
    viteStaticCopy({
      targets: [
        { src: "package.json", dest: ".", transform: transformPkgJson },
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

// Maps entry filenames to entries with proper aliases:
//
// src/Placeholder/index.ts -> Placeholder/index
// src/utilities/css.ts -> utilities/css
function buildEntryObject(entries: string[]) {
  return entries.reduce((o, entry) => {
    const alias = entry.replace(/^src\//, "").replace(/.ts$/, "");
    return { ...o, [alias]: entry };
  }, {});
}

// Cleans up package.json file for including in distribution
function transformPkgJson(code) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { scripts, devDependencies, exports, ...restPkg } = JSON.parse(code);
  return JSON.stringify(restPkg, null, 2);
}
