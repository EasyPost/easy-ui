import { init, setPlatformAPI } from "echarts";

// Deterministic text metrics for SVG topology checks; browser captures verify typography.
beforeAll(() => {
  setPlatformAPI({ measureText: (text) => ({ width: text.length * 7 }) });
});
import {
  allExamples,
  sankeyExample,
  heatmapExample,
  timeSeriesExample,
} from "./Chart.examples";

it.each(allExamples.map((example) => [example.title, example] as const))(
  "renders %s with the real ECharts SVG renderer",
  (_title, example) => {
    const chart = init(null, undefined, {
      renderer: "svg",
      ssr: true,
      width: 720,
      height: 360,
    });
    try {
      chart.setOption({ ...example.option, animation: false });
      const svg = chart.renderToSVGString();
      expect(svg).toContain("<svg");
      expect(svg).toContain("<path");
      expect(svg).not.toMatch(/(?:NaN|Infinity)/);
    } finally {
      chart.dispose();
    }
  },
);

it("balances Sankey inflows and outflows at each carrier", () => {
  for (const name of ["Carrier A", "Carrier B", "Carrier C"]) {
    const incoming = sankeyExample.dataTable.rows
      .filter(({ values }) => values[1] === name)
      .reduce((sum, { values }) => sum + Number(values[2]), 0);
    const outgoing = sankeyExample.dataTable.rows
      .filter(({ values }) => values[0] === name)
      .reduce((sum, { values }) => sum + Number(values[2]), 0);
    expect(incoming).toBe(outgoing);
    expect(incoming).toBeGreaterThan(0);
  }
});

it("keeps missing observations explicit in both temporal and matrix tables", () => {
  expect(
    timeSeriesExample.dataTable.rows.some(({ values }) =>
      values.includes(null),
    ),
  ).toBe(true);
  expect(heatmapExample.dataTable.rows).toHaveLength(16);
  expect(
    heatmapExample.dataTable.rows.filter(({ values }) => values[2] === null),
  ).toHaveLength(1);
});
