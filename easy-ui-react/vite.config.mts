/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { glob } from "glob";
import { createRequire } from "node:module";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import { viteStaticCopy } from "vite-plugin-static-copy";
import VitePluginReactRemoveAttributes from "vite-plugin-react-remove-attributes";
import { cleanPkgJsonForDist } from "../scripts/copyDistFiles.mjs";

const { default: removeReactAttributes } =
  VitePluginReactRemoveAttributes as unknown as {
    default: typeof VitePluginReactRemoveAttributes;
  };

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

// Every package easy-ui declares stays an import in the published build, so
// consumers resolve it from their own node_modules. That keeps one shared copy
// of each (a `CalendarDate` from a date component is `instanceof` the
// consumer's), and lets a consumer's bundler pick each package's build for its
// environment, e.g. a server build during SSR (EZUI-38). Anything easy-ui
// imports must therefore be declared in package.json.
//
// The testing packages are imported only by `utilities/test`, which consumers
// load from their own test setup.
//
// See https://simplerpostage.atlassian.net/browse/EZUI-13
const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  "vitest",
  "@testing-library/react",
  "@testing-library/user-event",
];

function isExternal(id: string) {
  return externalPackages.some((p) => id === p || id.startsWith(`${p}/`));
}

export default defineConfig({
  plugins: [
    removeReactAttributes({
      attributes: ["data-testid"],
    }),
    react({ jsxRuntime: "automatic" }),
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
      // Vite defaults to ES + CommonJS for multi-entry libraries. easy-ui
      // ships ES modules only.
      formats: ["es"],
      cssFileName: "style",
    },
    rolldownOptions: {
      external: isExternal,
      output: {
        format: "esm",
        entryFileNames: "[name].js",
        chunkFileNames: "__chunks__/[name]-[hash].js",
      },
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
