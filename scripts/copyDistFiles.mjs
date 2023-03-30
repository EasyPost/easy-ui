import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Removes fields unnecessary for distribution from a package.json
 * file contents.
 *
 * @param {string} pkgFileContent package.json file contents
 */
export function cleanPkgJsonForDist(pkgFileContent) {
  // eslint-disable-next-line no-unused-vars
  const { scripts, devDependencies, exports, publishConfig, ...restPkg } =
    JSON.parse(pkgFileContent);
  return JSON.stringify(restPkg, null, 2);
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
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
}
