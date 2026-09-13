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

beforeAll(() =>
  setPlatformAPI({ measureText: (text) => ({ width: text.length * 7 }) }),
);
it.each(logisticsExamples.map((example) => [example.title, example] as const))(
  "renders the %s recipe with real SVG geometry",
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
  },
);
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
it("keeps parcel observations before the cutoff and arrival forecasts after it", () => {
  const cutoff = (trackingCutoff - trackingStart) / 3600000;
  for (const p of warehouseProgress) {
    expect(p.last).toBeLessThanOrEqual(cutoff);
    if (!p.delivered) {
      expect(p.low).toBeGreaterThan(cutoff);
      expect(p.high).toBeGreaterThan(p.low!);
    } else {
      expect(p.low).toBeNull();
      expect(p.high).toBeNull();
    }
  }
  expect(trackingIntervals.find((s) => s.id === "gap")).toMatchObject({
    start: 28,
    end: 35,
    evidence: "No scans; movement unknown",
  });
});
