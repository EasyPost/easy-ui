import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Removes fields unnecessary for distribution from a package.json
 * file contents.
 *
 * Packages are published from their `dist` folder, so `exports` targets are
 * rewritten from `./dist/*` to `./*`. They have to be kept: Node's ESM
 * resolver (used by SSR and by test runners that don't bundle node_modules)
 * neither guesses file extensions nor resolves directory `index` files.
 *
 * @param {string} pkgFileContent package.json file contents
 */
export function cleanPkgJsonForDist(pkgFileContent) {
  // eslint-disable-next-line no-unused-vars
  const { scripts, devDependencies, exports, publishConfig, ...restPkg } =
    JSON.parse(pkgFileContent);
  const distPkg = exports
    ? { ...restPkg, exports: rebaseExportsToDist(exports) }
    : restPkg;
  return JSON.stringify(distPkg, null, 2);
}

/**
 * Rewrites every `./dist/` target in an `exports` field to be relative to the
 * `dist` folder itself.
 */
function rebaseExportsToDist(exports) {
  if (typeof exports === "string") {
    return exports.replace(/^\.\/dist\//, "./");
  }
  return Object.fromEntries(
    Object.entries(exports).map(([key, value]) => [
      key,
      rebaseExportsToDist(value),
    ]),
  );
}

/*
 * Copies a single specified file to a dist folder, optionally transforming it.
 */
function createDistFileCopier(outFolder) {
  return (inFile, { transform } = { transform: (c) => c }) => {
    const filename = path.basename(inFile);
    if (!fs.existsSync(inFile)) {
      throw new Error(`Can't find ${filename} file`);
    }
    const outFilePath = path.join(outFolder, filename);
    const fileContent = fs.readFileSync(inFile, { encoding: "utf8" });
    const transformed = transform(fileContent);
    if (!fs.existsSync(outFolder)) {
      fs.mkdirSync(outFolder);
    }
    fs.writeFileSync(outFilePath, transformed, { encoding: "utf8" });
  };
}

/*
 * Copies dist files (package.json, README.md) from a project's root to its dist
 * folder for distribution. Removes some fields that aren't relevant for dist.
 */
function run() {
  const copyFile = createDistFileCopier(path.join(process.cwd(), "./dist"));
  copyFile(path.join(process.cwd(), "./package.json"), {
    transform: cleanPkgJsonForDist,
  });
  copyFile(path.join(process.cwd(), "./README.md"));
  copyFile(path.join(process.cwd(), "./CHANGELOG.md"));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    run();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
