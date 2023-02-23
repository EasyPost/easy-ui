/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import glob from "glob";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react({ jsxRuntime: "classic" })],
  css: {
    modules: {
      globalModulePaths: [/global\.s?css$/],
    },
  },
  build: {
    outDir: "dist/js",
    lib: {
      entry: glob.sync("src/components/**/index.ts"),
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: [
        {
          format: "cjs",
          entryFileNames: createEntryFileNames("cjs/[name].js"),
        },
        {
          format: "esm",
          entryFileNames: createEntryFileNames("esm/[name].mjs"),
        },
      ],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: "./src/test/setup.ts",
  },
});

function createEntryFileNames(template: string) {
  return ({ facadeModuleId }) => {
    if (!facadeModuleId) {
      return template;
    }
    const filenameParts = facadeModuleId?.split(path.sep);
    const componentName = filenameParts[filenameParts.length - 2];
    return template.replace("[name]", componentName);
  };
}
