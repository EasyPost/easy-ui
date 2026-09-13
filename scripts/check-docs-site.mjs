import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const site = fileURLToPath(new URL("../docs-site/", import.meta.url));
const mount = new URL("https://example.test/easy-ui/");
let checked = 0;
async function checkLink(page, href) {
  const url = new URL(href, new URL(page, mount));
  if (url.origin !== mount.origin) return;
  assert.ok(
    url.pathname.startsWith(mount.pathname),
    `Escapes site: ${page}: ${href}`,
  );
  let path = resolve(
    site,
    decodeURIComponent(url.pathname.slice(mount.pathname.length)),
  );
  if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
  assert.ok((await stat(path)).isFile(), `Missing output: ${page}: ${href}`);
  checked++;
}

const pages = [
  "index.html",
  "storybook/index.html",
  "storybook/iframe.html",
  "api/index.html",
  "comparisons/index.html",
  "comparisons/modular/portfolio/index.html",
];
for (const page of pages) {
  const html = await readFile(resolve(site, page), "utf8");
  for (const [, tag] of html.matchAll(/<(script\b[^>]*|link\b[^>]*)>/g)) {
    const href = /(?:src|href)="([^"]+)"/.exec(tag)?.[1];
    if (href) await checkLink(page, href);
  }
  if (page === "index.html") {
    for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      await checkLink(page, href);
    }
  }
}
// Check navigation on every API page, including nested props/type pages.
for (const entry of await readdir(resolve(site, "api"), { recursive: true })) {
  if (!entry.endsWith(".html")) continue;
  const page = `api/${entry}`;
  const html = await readFile(resolve(site, page), "utf8");
  for (const [, href] of html.matchAll(
    /href="([^"]+)"[^>]*>(?:Storybook|Chart comparisons)<\/a>/g,
  )) {
    await checkLink(page, href);
  }
}
const props = await readFile(
  resolve(site, "api/types/Sparkline.SparklineProps.html"),
  "utf8",
);
assert.match(props, /id="markers"/);
assert.match(props, /endpoints/);
const fonts = await readFile(resolve(site, "storybook/poppins.css"), "utf8");
for (const [, href] of fonts.matchAll(/url\("([^"]+)"\)/g)) {
  await checkLink("storybook/poppins.css", href);
}
await checkLink("storybook/index.html", "./easypost-logo.svg");
await stat(resolve(site, ".nojekyll"));
console.log(
  `Documentation site passes: ${pages.length} entry pages, ${checked} asset/navigation links, and sparkline marker API documentation.`,
);
