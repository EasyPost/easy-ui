import { execFileSync } from "node:child_process";
import { cp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const site = resolve(root, "docs-site");
function run(args, env = {}) {
  execFileSync("npm", args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

run(["run", "build:tokens"]);
run(["run", "build:icons"]);
run(["run", "build:storybook", "--", "--output-dir", "docs-site/storybook"]);
run(["run", "build:typedoc"]);

// TypeDoc emits navigationLinks verbatim, even on nested component pages.
// Resolve those links from the API root so the site works at any mount path.
const { navigationLinks } = JSON.parse(
  await readFile(resolve(root, "typedoc.json"), "utf8"),
);
const api = resolve(site, "api");
for (const entry of await readdir(api, { recursive: true })) {
  if (!entry.endsWith(".html")) continue;
  const file = resolve(api, entry);
  let html = await readFile(file, "utf8");
  for (const url of Object.values(navigationLinks)) {
    const href = relative(dirname(file), resolve(api, url)).replaceAll(
      "\\",
      "/",
    );
    html = html.replaceAll(`href="${url}"`, `href="${href}/"`);
  }
  await writeFile(file, html);
}

// Each gallery gets relative assets and an independent engine registration.
run(["run", "--prefix", "scripts/preview-metrics", "build"], {
  EASY_UI_PREVIEW_BASE: "./",
  EASY_UI_CHART_ENGINE: "full",
  EASY_UI_PREVIEW_OUT_DIR: "dist",
});
run(["run", "--prefix", "scripts/preview-metrics", "build"], {
  EASY_UI_PREVIEW_BASE: "./",
  EASY_UI_CHART_ENGINE: "portfolio",
  EASY_UI_PREVIEW_OUT_DIR: "dist/modular/portfolio",
});
await rm(resolve(site, "comparisons"), { recursive: true, force: true });
await cp(
  resolve(root, "scripts/preview-metrics/dist"),
  resolve(site, "comparisons"),
  {
    recursive: true,
  },
);
await writeFile(resolve(site, ".nojekyll"), "");
