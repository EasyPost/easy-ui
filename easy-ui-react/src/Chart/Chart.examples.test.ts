import { color, init, setPlatformAPI } from "echarts";
import type { HeatmapSeriesOption, VisualMapComponentOption } from "echarts";

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

import { extensionExamples, periodicHeatmapExample } from "./Chart.extensions";

// Axe cannot reliably resolve SVG text backgrounds. Use the renderer's color
// interpolation to check every labeled cell against its actual scale color.
it.each([heatmapExample, periodicHeatmapExample])(
  "keeps every $title cell label above 4.5:1 contrast",
  (example) => {
    const scale = example.option.visualMap as VisualMapComponentOption;
    const series = (example.option.series as HeatmapSeriesOption[])[0];
    const luminance = (css: string) => {
      const channels = color.parse(css)!;
      return channels.slice(0, 3).reduce((sum, channel, index) => {
        const value = channel / 255;
        const linear =
          value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        return sum + linear * [0.2126, 0.7152, 0.0722][index];
      }, 0);
    };
    for (const cell of series.data as {
      value: number[];
      label: { color: string };
    }[]) {
      const fraction =
        (cell.value[2] - Number(scale.min)) /
        (Number(scale.max) - Number(scale.min));
      const background = color.lerp(fraction, scale.inRange!.color!) as string;
      const values = [luminance(cell.label.color), luminance(background)].sort(
        (a, b) => a - b,
      );
      expect((values[1] + 0.05) / (values[0] + 0.05)).toBeGreaterThanOrEqual(
        4.5,
      );
    }
  },
);

it.each(
  [...allExamples, ...extensionExamples].map(
    (example) => [example.title, example] as const,
  ),
)("renders %s with the real ECharts SVG renderer", (_title, example) => {
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
});

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
