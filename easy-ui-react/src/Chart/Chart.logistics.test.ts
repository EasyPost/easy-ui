import { color, init, setPlatformAPI } from "echarts";
import {
  logisticsExamples,
  reliabilityCohorts,
  competitivenessCells,
  priceScenarios,
  dailyCapacity,
  trackingIntervals,
  warehouseProgress,
  trackingCutoff,
  trackingStart,
} from "./Chart.logistics";
import {
  laneMapExample,
  parcelMapExample,
  parcelPaths,
} from "./Chart.geography";

beforeAll(() =>
  setPlatformAPI({ measureText: (text) => ({ width: text.length * 7 }) }),
);
it.each(
  [
    ...logisticsExamples,
    laneMapExample,
    parcelMapExample("All warehouses", "P-104"),
  ].map((example) => [example.title, example] as const),
)("renders the %s recipe with real SVG geometry", (_title, example) => {
  const chart = init(null, undefined, {
    renderer: "svg",
    ssr: true,
    width: 720,
    height: 360,
  });
  try {
    chart.setOption({ ...example.option, animation: false });
    const svg = chart.renderToSVGString();
    expect(svg).toContain("<path");
    expect(svg).not.toMatch(/NaN|Infinity/);
    expect(new Set(example.dataTable.rows.map((r) => r.id)).size).toBe(
      example.dataTable.rows.length,
    );
    expect(
      example.dataTable.rows.every(
        (r) => r.values.length === example.dataTable.columns.length,
      ),
    ).toBe(true);
  } finally {
    chart.dispose();
  }
});
it("keeps unresolved parcels in the fixed reliability cohort and cumulative delivery monotonic", () => {
  for (const c of reliabilityCohorts) {
    expect(c.delivered[0]).toBe(0);
    expect(c.delivered[c.delivered.length - 1]).toBeLessThan(c.accepted);
    c.delivered.forEach((n, i) => {
      expect(n).toBeLessThanOrEqual(c.accepted);
      if (i) expect(n).toBeGreaterThanOrEqual(c.delivered[i - 1]);
    });
  }
});
it("suppresses small matched cohorts and preserves readable signed price differences", () => {
  const luminance = (css: string) =>
    color
      .parse(css)
      .slice(0, 3)
      .reduce((sum, c, i) => {
        const v = c / 255;
        return (
          sum +
          (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4) *
            [0.2126, 0.7152, 0.0722][i]
        );
      }, 0);
  for (const c of competitivenessCells) {
    if (c.n < 30) expect(c.difference).toBeNull();
    else {
      expect(c.difference).toBeCloseTo((c.offered / c.benchmark - 1) * 100, 1);
      const bg = color.lerp((c.difference! + 30) / 60, [
        "#7193ec",
        "#ffffff",
        "#ddb17b",
      ]);
      expect((luminance(bg) + 0.05) / 0.05).toBeGreaterThanOrEqual(4.5);
    }
  }
});
it("keeps scenario bounds and contribution consistent with the documented cost assumption", () => {
  for (const s of priceScenarios) {
    expect(s.low).toBeLessThan(s.volume);
    expect(s.high).toBeGreaterThan(s.volume);
    expect(s.contribution).toBe(Math.round((s.price - 4.6) * s.volume));
  }
  expect(
    Math.max(
      ...dailyCapacity
        .filter((d) => d.kind === "Forecast")
        .map((d) => d.volume / d.capacity),
    ),
  ).toBe(1.14);
});
it("keeps parcel locations, event timestamps and arrival windows consistent across map and progress views", () => {
  const cutoff = (trackingCutoff - trackingStart) / 3600000;
  for (const path of parcelPaths) {
    const p = warehouseProgress.find((p) => p.id === path.id)!;
    const last = path.scans[path.scans.length - 1];
    expect(p.scanned).toBe(last.place);
    expect(p.last).toBe(last.hour);
    expect(p.last).toBeLessThanOrEqual(cutoff);
    path.scans.forEach((s, i) => {
      if (i) expect(s.hour).toBeGreaterThan(path.scans[i - 1].hour);
    });
    if (!p.delivered) {
      expect(p.low).toBeGreaterThan(cutoff);
      expect(p.high).toBeGreaterThan(p.low!);
    } else {
      expect(last.event).toBe("Delivered");
      expect(p.low).toBeNull();
    }
  }
  expect(trackingIntervals.find((s) => s.id === "gap")).toMatchObject({
    start: 28,
    end: 35,
    evidence: "No scans; movement unknown",
  });
  expect(
    parcelMapExample("Dallas", "P-104").dataTable.rows.map((r) => r.id),
  ).toEqual(["P-201", "P-202"]);
});

it("keeps geographic proportions stable across desktop and mobile sizes", () => {
  const chart = init(null, undefined, {
    renderer: "svg",
    ssr: true,
    width: 720,
    height: 320,
  });
  try {
    chart.setOption({ ...laneMapExample.option, animation: false });
    for (const width of [720, 300]) {
      chart.resize({ width, height: 320 });
      const origin = chart.convertToPixel(
        { geoIndex: 0 },
        [-110, 35],
      ) as number[];
      const east = chart.convertToPixel(
        { geoIndex: 0 },
        [-100, 35],
      ) as number[];
      const north = chart.convertToPixel(
        { geoIndex: 0 },
        [-110, 45],
      ) as number[];
      // ECharts' default longitude/latitude aspect scale is 0.75.
      expect(
        Math.abs((east[0] - origin[0]) / (north[1] - origin[1])),
      ).toBeCloseTo(0.75);
    }
  } finally {
    chart.dispose();
  }
});
