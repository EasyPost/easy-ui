import fs from "fs";
import path from "path";
import glob from "glob";
import prettier from "prettier";
import { transform as transformSvg } from "@svgr/core";
import { defineConfig, transformWithEsbuild } from "vite";
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
    rollupOptions: {
      external: ["react"],
      output: [
        { format: "cjs", entryFileNames: `${JS_PREFIX}[name].js` },
        { format: "esm", entryFileNames: `${JS_PREFIX}[name].mjs` },
      ],
    },
  },
});

function buildSvg() {
  return {
    name: "ezui-vite-plugin-build-svg",
    async transform(_code, id) {
      const { name: svgName, ext } = path.parse(id);
      const svgFilename =
        ext === ".json" ? await getSvgFilenameFromJson(id) : id;
      const svgFileContent = await fs.promises.readFile(svgFilename, "utf8");
      const componentCode = await transformSvg(
        svgFileContent,
        { plugins: ["@svgr/plugin-jsx"], dimensions: false, titleProp: true },
        { componentName: svgName },
      );
      const res = await transformWithEsbuild(componentCode, id, {
        loader: "jsx",
      });
      this.emitFile({
        type: "asset",
        fileName: `${JS_PREFIX}${svgName}.d.ts`,
        source: Buffer.from(svgTypeFileTemplate(svgName)),
      });
      this.emitFile({
        type: "asset",
        fileName: `${SVG_PREFIX}${svgName}.svg`,
        source: Buffer.from(svgFileContent),
      });
      return res;
    },
  };
}

async function getSvgFilenameFromJson(filename: string) {
  const jsonFileContents = await fs.promises.readFile(filename, "utf8");
  const { name, style, source } = JSON.parse(jsonFileContents);
  return path.join(
    __dirname,
    "..",
    "node_modules",
    source,
    style,
    `${name}.svg`,
  );
}

// it's much faster and easier to generate these typings by hand than run them
// through typescript's compiler
function svgTypeFileTemplate(svgName: string) {
  return prettier.format(
    `
    interface SVGRProps {
      title?: string;
      titleId?: string;
    }
    declare const ${svgName}: ({
      title,
      titleId,
      ...props
    }: React.SVGProps<SVGSVGElement> & SVGRProps) => JSX.Element;
    export default ${svgName};
    `,
    { parser: "typescript" },
  );
}
