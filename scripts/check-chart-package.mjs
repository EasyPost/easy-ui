import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToString } from "react-dom/server";

const require = createRequire(import.meta.url);
const props = {
  title: "Server-rendered chart",
  description: "One observed shipment",
  option: { series: [{ type: "bar", data: [1] }] },
  dataTable: { columns: ["Parcels"], rows: [{ id: "one", values: [1] }] },
};
const commonjs = require("../easy-ui-react/dist/Chart/index.js");
const commonjsTheme = require("../easy-ui-react/dist/Theme/index.js");
const esm = await import("../easy-ui-react/dist/Chart/index.mjs");
const esmTheme = await import("../easy-ui-react/dist/Theme/index.mjs");
for (const [chart, theme] of [
  [commonjs, commonjsTheme],
  [esm, esmTheme],
]) {
  const html = renderToString(
    React.createElement(
      theme.ThemeProvider,
      null,
      React.createElement(chart.Chart, props),
    ),
  );
  assert.match(html, /Loading chart/);
  assert.match(html, /<table/);
  assert.match(html, /<td>1<\/td>/);
}
assert.equal(
  Object.keys(require.cache).some((path) =>
    /node_modules\/(echarts|zrender)\//.test(path),
  ),
  false,
  "Importing/SSR rendering Chart must not eagerly load ECharts",
);
console.log(
  "Chart package: CommonJS and ESM imports/SSR passed; engine stays lazy.",
);
