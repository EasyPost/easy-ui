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
for (const [name, nativeProps] of [
  [
    "CompactTimeSeries",
    {
      label: "Native time series",
      description: "Two observations",
      domain: [0, 10],
      formatTime: String,
      series: [
        {
          id: "one",
          label: "Volume",
          points: [
            { time: 0, value: 0 },
            { time: 10, value: 5 },
          ],
        },
      ],
    },
  ],
  [
    "RangePlot",
    {
      label: "Native range",
      description: "One benchmark",
      domain: [-5, 5],
      points: [{ id: "one", label: "Current", value: 0 }],
    },
  ],
]) {
  for (const extension of ["js", "mjs"]) {
    const entry =
      extension === "js"
        ? require(`../easy-ui-react/dist/${name}/index.js`)
        : await import(`../easy-ui-react/dist/${name}/index.mjs`);
    const html = renderToString(React.createElement(entry[name], nativeProps));
    assert.match(html, /<figure/);
    assert.match(html, /Native/);
  }
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
