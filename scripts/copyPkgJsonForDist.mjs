import fs from "fs";
import path from "path";

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
 * Copies a package.json file from a project's root to its dist folder for
 * distribution. Removes some fields that aren't relevant for dist.
 */
function run() {
  const inFilePath = path.join(process.cwd(), "./package.json");

  if (!fs.existsSync(inFilePath)) {
    throw new Error("Can't find package.json file");
  }

  const outFolder = path.join(process.cwd(), "./dist");
  const outFilePath = path.join(outFolder, "./package.json");

  const fileContent = fs.readFileSync(inFilePath, { encoding: "utf8" });
  const cleaned = cleanPkgJsonForDist(fileContent);

  if (!fs.existsSync(outFolder)) {
    fs.mkdirSync(outFolder);
  }
  fs.writeFileSync(outFilePath, cleaned, { encoding: "utf8" });
}

run();
