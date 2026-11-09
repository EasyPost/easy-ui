/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { glob } from "glob";
import { createRequire } from "node:module";
import { defineConfig, esmExternalRequirePlugin } from "vite";
import { configDefaults } from "vitest/config";
import { viteStaticCopy } from "vite-plugin-static-copy";
import VitePluginReactRemoveAttributes from "vite-plugin-react-remove-attributes";
import { cleanPkgJsonForDist } from "../scripts/copyDistFiles.mjs";

const { default: removeReactAttributes } =
  VitePluginReactRemoveAttributes as unknown as {
    default: typeof VitePluginReactRemoveAttributes;
  };

const require = createRequire(import.meta.url);

export default defineConfig({
  resolve: {
    alias: {
      // The package's browser entry makes a DOM element at import, which
      // throws wherever CodeSnippet renders on a server. Its default entry is
      // a lookup table that works in both
      "decode-named-character-reference":
        require.resolve("decode-named-character-reference"),
    },
  },
  plugins: [
    removeReactAttributes({
      attributes: ["data-testid"],
    }),
    react({ jsxRuntime: "automatic" }),
    // Bundled CommonJS deps (e.g. `use-sync-external-store/shim`) call
    // `require("react")`. In ESM output Rolldown otherwise leaves a `require`
    // shim that throws at import time, so rewrite those calls into imports.
    esmExternalRequirePlugin({ external: [/^react(-dom)?(\/.*)?$/] }),
    viteStaticCopy({
      targets: [
        { src: "package.json", dest: ".", transform: cleanPkgJsonForDist },
        { src: "README.md", dest: "." },
        { src: "CHANGELOG.md", dest: "." },
        { src: "src/styles", dest: ".", rename: { stripBase: 1 } },
      ],
    }),
  ],
  css: {
    modules: {
      globalModulePaths: [/global\.s?css$/],
    },
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  build: {
    emptyOutDir: false,
    target: "es2015",
    minify: false,
    lib: {
      entry: buildEntryObject([
        ...glob.sync("src/**/index.ts"),
        ...glob.sync("src/utilities/*.ts", {
          ignore: ["**/*.test.ts"],
        }),
      ]),
      cssFileName: "style",
    },
    rolldownOptions: {
      // `react` and `react-dom` are externalized by `esmExternalRequirePlugin`
      // above; listing them here too would bypass its `require` rewrite.
      external: (id) =>
        [
          "vitest",
          "@testing-library/react",
          "@testing-library/user-event",
        ].some((pkg) => id === pkg || id.startsWith(`${pkg}/`)),
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
    exclude: [...configDefaults.exclude, "src/utilities/test.ts"],
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
