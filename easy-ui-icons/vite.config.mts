import fs from "fs";
import path from "path";
import { glob } from "glob";
import prettier from "prettier";
import { transform as transformSvg } from "@svgr/core";
import { defineConfig, transformWithOxc, type Plugin } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { cleanPkgJsonForDist } from "../scripts/copyDistFiles.mjs";

const JS_PREFIX = "";
const SVG_PREFIX = "svg/";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    buildSvg(),
    viteStaticCopy({
      targets: [
        { src: "package.json", dest: ".", transform: cleanPkgJsonForDist },
        { src: "README.md", dest: "." },
        { src: "CHANGELOG.md", dest: "." },
      ],
    }),
  ],
  build: {
    target: "es2015",
    minify: false,
    lib: {
      entry: glob.sync("src/*.{svg,json}"),
    },
    rolldownOptions: {
      external: ["react"],
      output: [
        // Rolldown hoists shared helpers (e.g. object spread) into chunks, so
        // give each format its own extension or Node would load the ESM chunk
        // as CommonJS.
        {
          format: "cjs",
          entryFileNames: `${JS_PREFIX}[name].js`,
          chunkFileNames: "__chunks__/[name]-[hash].js",
        },
        {
          format: "esm",
          entryFileNames: `${JS_PREFIX}[name].mjs`,
          chunkFileNames: "__chunks__/[name]-[hash].mjs",
        },
      ],
    },
  },
});

function buildSvg(): Plugin {
  return {
    name: "ezui-vite-plugin-build-svg",
    transform: {
      // Only handle our own SVG/JSON icon entries. Rolldown (Vite 8+) also
      // routes virtual modules such as `\0rolldown/runtime.js` and oxc
      // helpers through `transform`, and those aren't files on disk.
      filter: { id: { include: /\.(svg|json)$/, exclude: /^\0/ } },
      async handler(_code, id) {
        const { name: svgName, ext } = path.parse(id);
        const svgFilename =
          ext === ".json" ? await getSvgFilenameFromJson(id) : id;
        const svgFileContent = await fs.promises.readFile(svgFilename, "utf8");
        const componentCode = await transformSvg(
          svgFileContent,
          { plugins: ["@svgr/plugin-jsx"], dimensions: false, titleProp: true },
          { componentName: svgName },
        );
        const res = await transformWithOxc(componentCode, id, {
          lang: "jsx",
          jsx: { runtime: "classic" },
        });
        const svgTypeFile = await generateSvgTypeFile(svgName);
        this.emitFile({
          type: "asset",
          fileName: `${JS_PREFIX}${svgName}.d.ts`,
          source: Buffer.from(svgTypeFile),
        });
        this.emitFile({
          type: "asset",
          fileName: `${SVG_PREFIX}${svgName}.svg`,
          source: Buffer.from(svgFileContent),
        });
        return res;
      },
    },
  };
}

async function getSvgFilenameFromJson(filename: string) {
  const jsonFileContents = await fs.promises.readFile(filename, "utf8");
  const { name, style, source } = JSON.parse(jsonFileContents);
  const rootPath = path.join(
    import.meta.dirname,
    "..",
    "node_modules",
    source,
    style,
    `${name}.svg`,
  );
  const rootPathExists = await fileExists(rootPath);
  if (rootPathExists) {
    return rootPath;
  }
  const localPath = path.join(
    import.meta.dirname,
    "./node_modules",
    source,
    style,
    `${name}.svg`,
  );
  if (!(await fileExists(localPath))) {
    throw new Error(`Could not find SVG file at: ${rootPath} or ${localPath}`);
  }
  return localPath;
}

// it's much faster and easier to generate these typings by hand than run them
// through typescript's compiler
async function generateSvgTypeFile(svgName: string) {
  return await prettier.format(
    `
    declare const ${svgName}: ({
      title,
      titleId,
      ...props
    }: {
      title?: string;
      titleId?: string;
    } & React.SVGProps<SVGSVGElement>) => JSX.Element;
    export default ${svgName};
    `,
    { parser: "typescript" },
  );
}

async function fileExists(path: string) {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
