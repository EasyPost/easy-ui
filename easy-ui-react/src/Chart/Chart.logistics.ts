import type { ChartProps } from "./Chart";

// Synthetic, fixed fixtures. Tables and marks derive from the same records.
const blue = "#113abf",
  purple = "#772bb0",
  teal = "#007f86",
  orange = "#9b5900";
const grid = { left: 58, right: 28, top: 64, bottom: 58 };
const day = (n: number) => Date.UTC(2026, 7, n);
const date = (n: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(n);
const money = (n: number) => `$${n.toFixed(2)}`;

export const reliabilityCohorts = [
  {
    id: "a",
    carrier: "Carrier A",
    accepted: 1000,
    delivered: [0, 120, 700, 920, 970, 985, 990],
    color: blue,
  },
  {
    id: "b",
    carrier: "Carrier B",
    accepted: 800,
    delivered: [0, 80, 400, 680, 752, 776, 784],
    color: purple,
  },
  {
    id: "c",
    carrier: "Carrier C",
    accepted: 600,
    delivered: [0, 30, 240, 480, 552, 576, 582],
    color: teal,
  },
];
export const reliabilityExample: ChartProps = {
  title: "Delivery promise reliability",
  description:
    "Accepted Aug 1–7 · Calendar days · All 2,400 parcels remain in the denominator; unresolved parcels are included. Observed through Aug 21.",
  notice:
    "At 3 days: A 92%, B 85%, C 80%. Dashed references: 3-day promise and 90% service target. Fixed, fully aged cohort; no survivor-only filtering.",
  option: {
    grid,
    legend: { top: 0 },
    tooltip: { trigger: "axis", valueFormatter: (v) => `${v}% delivered` },
    xAxis: {
      type: "value",
      min: 0,
      max: 6,
      interval: 1,
      name: "Calendar days",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: { type: "value", min: 0, max: 100, name: "Delivered (%)" },
    series: reliabilityCohorts.map((c, i) => ({
      id: c.id,
      name: c.carrier,
      type: "line",
      step: "end",
      symbolSize: 5,
      data: c.delivered.map((n, d) => [d, (n / c.accepted) * 100]),
      itemStyle: { color: c.color },
      ...(i === 0
        ? {
            markLine: {
              silent: true,
              symbol: "none",
              label: { show: false },
              lineStyle: { type: "dashed", color: "#47547f" },
              data: [{ xAxis: 3 }, { yAxis: 90 }],
            },
          }
        : {}),
    })),
  },
  dataTable: {
    columns: [
      "Carrier",
      "Calendar day",
      "Delivered",
      "Accepted",
      "Delivered (%)",
      "Not yet delivered",
    ],
    rows: reliabilityCohorts.flatMap((c) =>
      c.delivered.map((n, d) => ({
        id: `${c.id}-${d}`,
        values: [
          c.carrier,
          d,
          n,
          c.accepted,
          Number(((n / c.accepted) * 100).toFixed(1)),
          c.accepted - n,
        ],
      })),
    ),
  },
};

const zones = ["Zone 2", "Zone 4", "Zone 6", "Zone 8"];
const weights = ["<1 lb", "1–3 lb", "3–5 lb", "5–10 lb"];
export const competitivenessCells = weights.flatMap((weight, y) =>
  zones.map((zone, x) => {
    const benchmark = [5, 6, 8, 11][x] + y * 1.5;
    const difference = [
      -18, -8, 5, 14, -12, -4, 7, 18, -6, 2, 11, 20, -2, 5, 15, 23,
    ][y * 4 + x];
    const n = x === 2 && y === 2 ? 18 : 140 + x * 35 + y * 50;
    const offered = Math.round(benchmark * (1 + difference / 100) * 100) / 100;
    return {
      id: `${x}-${y}`,
      x,
      y,
      zone,
      weight,
      benchmark,
      offered,
      n,
      volume: 1800 + y * 600 + x * 350,
      difference:
        n < 30 ? null : Number(((offered / benchmark - 1) * 100).toFixed(1)),
    };
  }),
);
export const competitivenessExample: ChartProps = {
  title: "Rate competitiveness by cohort",
  description:
    "USD/parcel · Matched zone, weight and service cohorts · Negative is cheaper than the benchmark. All-in illustrative rates, same observation window.",
  notice:
    "Color scale is centered on parity. Blank cell: fewer than 30 matched observations. Exact rates, matched sample counts, and opportunity volume are in the table.",
  option: {
    grid: { left: 56, right: 16, top: 22, bottom: 90 },
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        const item = Array.isArray(p) ? p[0] : p;
        const v = item.value as number[];
        const c = competitivenessCells.find(
          (c) => c.x === v[0] && c.y === v[1],
        )!;
        return `${c.zone}, ${c.weight}: ${c.difference! > 0 ? "+" : ""}${c.difference}% · ${money(c.offered)} vs ${money(c.benchmark)} · n=${c.n}`;
      },
    },
    xAxis: { type: "category", data: zones, axisLabel: { fontSize: 10 } },
    yAxis: {
      type: "category",
      data: weights,
      inverse: true,
      axisLabel: { fontSize: 10 },
    },
    visualMap: {
      min: -30,
      max: 30,
      dimension: 2,
      orient: "horizontal",
      left: "center",
      bottom: 4,
      itemHeight: 100,
      itemWidth: 10,
      text: ["+30%", "−30%"],
      calculable: false,
      inRange: { color: ["#7193ec", "#ffffff", "#ddb17b"] },
    },
    series: [
      {
        id: "competitiveness",
        type: "heatmap",
        data: competitivenessCells
          .filter((c) => c.difference !== null)
          .map((c) => ({
            value: [c.x, c.y, c.difference!],
            label: { color: "#000000" },
          })),
        label: {
          show: true,
          fontSize: 10,
          formatter: (p) => {
            const n = (p.value as number[])[2];
            return `${n > 0 ? "+" : ""}${n}%`;
          },
        },
        itemStyle: { borderWidth: 3, borderColor: "#ffffff" },
      },
    ],
  },
  dataTable: {
    columns: [
      "Zone",
      "Weight",
      "Offered USD",
      "Benchmark USD",
      "Difference (%)",
      "Matched n",
      "Opportunity parcels",
    ],
    rows: competitivenessCells.map((c) => ({
      id: c.id,
      values: [
        c.zone,
        c.weight,
        c.offered,
        c.benchmark,
        c.difference,
        c.n,
        c.volume,
      ],
    })),
  },
};

export const priceScenarios = [
  [5.25, 11600],
  [5.5, 10700],
  [5.75, 9400],
  [6, 7800],
  [6.25, 6100],
  [6.5, 5000],
].map(([price, volume]) => ({
  id: `price-${price}`,
  price,
  volume,
  low: Math.round(volume * 0.8),
  high: Math.round(volume * 1.2),
  contribution: Math.round((price - 4.6) * volume),
}));
export const priceResponseExample: ChartProps = {
  title: "Price, volume and contribution",
  description:
    "Illustrative next-week model · Price in USD/parcel · Shaded volume envelope shows supplied low/high scenarios, not a confidence interval.",
  notice:
    "Proposed price $6.00. Contribution assumes $4.60 variable cost per parcel, before fixed costs. Observed demand and causal lift are not represented by this fixture.",
  option: {
    grid: { left: 60, right: 64, top: 80, bottom: 54 },
    legend: { top: 0, data: ["Base volume", "Contribution"] },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: priceScenarios.map((s) => money(s.price)),
      name: "Price / parcel",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: [
      {
        type: "value",
        min: 0,
        max: 15000,
        name: "Parcels / week",
        axisLabel: { formatter: (v: number) => `${v / 1000}k` },
      },
      {
        type: "value",
        min: 0,
        max: 15000,
        name: "USD / week",
        axisLabel: { formatter: (v: number) => `$${v / 1000}k` },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        id: "low",
        type: "line",
        stack: "envelope",
        data: priceScenarios.map((s) => s.low),
        lineStyle: { opacity: 0 },
        areaStyle: { opacity: 0 },
        symbol: "none",
        silent: true,
        tooltip: { show: false },
      },
      {
        id: "spread",
        type: "line",
        stack: "envelope",
        data: priceScenarios.map((s) => s.high - s.low),
        lineStyle: { opacity: 0 },
        areaStyle: { color: "rgba(17,58,191,0.16)" },
        symbol: "none",
        silent: true,
        tooltip: { show: false },
      },
      {
        id: "volume",
        name: "Base volume",
        type: "line",
        data: priceScenarios.map((s) => s.volume),
        itemStyle: { color: blue },
        markLine: {
          symbol: "none",
          label: { show: false },
          lineStyle: { type: "dotted", color: "#47547f" },
          data: [{ xAxis: "$6.00" }],
        },
      },
      {
        id: "contribution",
        name: "Contribution",
        type: "line",
        yAxisIndex: 1,
        data: priceScenarios.map((s) => s.contribution),
        itemStyle: { color: teal },
        lineStyle: { type: "dashed" },
      },
    ],
  },
  dataTable: {
    columns: [
      "Price USD/parcel",
      "Low volume",
      "Base volume",
      "High volume",
      "Contribution USD/week",
    ],
    rows: priceScenarios.map((s) => ({
      id: s.id,
      values: [s.price, s.low, s.volume, s.high, s.contribution],
    })),
  },
};

export const dailyCapacity = [
  7800, 8400, 9200, 10300, 9700, 10500, 11400, 10900, 9500,
].map((volume, i) => ({
  time: day(i + 1),
  volume,
  capacity: 10000,
  kind: i < 5 ? "Observed" : "Forecast",
}));
export const capacityExample: ChartProps = {
  title: "Volume against operating capacity",
  description:
    "Oakland warehouse · Parcels/day · Observed through Aug 5, forecast Aug 6–9 · All dates UTC. Capacity is an application-supplied operating limit.",
  notice:
    "Dotted capacity: 10,000/day. Forecast peak: 11,400, or 14% over capacity. Bands: below 80%, 80–100%, and above capacity. Forecast is not an observation.",
  option: {
    grid,
    legend: { top: 0 },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "time",
      min: day(1),
      max: day(9),
      axisLabel: { formatter: date },
    },
    yAxis: { type: "value", min: 0, max: 13000, name: "Parcels / day" },
    series: [
      {
        id: "observed",
        name: "Observed",
        type: "line",
        data: dailyCapacity.map((d) => [
          d.time,
          d.kind === "Observed" ? d.volume : null,
        ]),
        itemStyle: { color: blue },
        markArea: {
          silent: true,
          label: { show: false },
          data: [
            [
              { yAxis: 0, itemStyle: { color: "rgba(0,127,134,0.05)" } },
              { yAxis: 8000 },
            ],
            [
              { yAxis: 8000, itemStyle: { color: "rgba(155,89,0,0.08)" } },
              { yAxis: 10000 },
            ],
            [
              { yAxis: 10000, itemStyle: { color: "rgba(188,69,67,0.10)" } },
              { yAxis: 13000 },
            ],
          ],
        },
        markLine: {
          symbol: "none",
          label: { show: false },
          lineStyle: { color: orange, type: "dotted" },
          data: [{ yAxis: 10000 }],
        },
      },
      {
        id: "forecast",
        name: "Forecast",
        type: "line",
        data: dailyCapacity.map((d, i) => [d.time, i >= 4 ? d.volume : null]),
        itemStyle: { color: purple },
        lineStyle: { type: "dashed" },
      },
    ],
  },
  dataTable: {
    columns: [
      "Date (UTC)",
      "Kind",
      "Parcels",
      "Capacity",
      "Utilization (%)",
      "Over capacity",
    ],
    rows: dailyCapacity.map((d) => ({
      id: String(d.time),
      values: [
        date(d.time),
        d.kind,
        d.volume,
        d.capacity,
        (d.volume / d.capacity) * 100,
        Math.max(0, d.volume - d.capacity),
      ],
    })),
  },
};

export const trackingStart = Date.UTC(2026, 7, 3, 8);
export const trackingCutoff = trackingStart + 43 * 3600000;
export const trackingIntervals = [
  {
    id: "origin",
    label: "Origin dwell",
    start: 0,
    end: 6,
    evidence: "Observed scans",
    color: blue,
  },
  {
    id: "linehaul",
    label: "Linehaul",
    start: 6,
    end: 28,
    evidence: "Observed scan endpoints",
    color: teal,
  },
  {
    id: "gap",
    label: "Scan gap",
    start: 28,
    end: 35,
    evidence: "No scans; movement unknown",
    color: "#47547f",
  },
  {
    id: "destination",
    label: "Destination dwell",
    start: 35,
    end: 40,
    evidence: "Observed scans",
    color: blue,
  },
  {
    id: "delivery",
    label: "Final leg",
    start: 40,
    end: 43,
    evidence: "Ongoing at observation cutoff",
    color: teal,
  },
  {
    id: "arrival",
    label: "Arrival window",
    start: 46,
    end: 52,
    evidence: "Predicted window; not delivered",
    color: purple,
  },
];
const utc = (hours: number) =>
  new Date(trackingStart + hours * 3600000)
    .toISOString()
    .replace(":00.000Z", "Z");
export const shipmentTimelineExample: ChartProps = {
  title: "Parcel P-104 tracking timeline",
  description:
    "Hours since Aug 3, 08:00 UTC · Last update Aug 5, 03:00 UTC · Dwell and movement intervals are bounded by scans; positions between scans are unknown.",
  notice:
    "Scan gap: hours 28–35. Final leg in transit is ongoing at hour 43. Predicted arrival: hours 46–52; dotted promise deadline: hour 50. No delivery event has been observed.",
  option: {
    grid: { left: 110, right: 30, top: 30, bottom: 48 },
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        const item = Array.isArray(p) ? p[0] : p;
        const s = trackingIntervals[item.dataIndex];
        return `${s.label}: ${utc(s.start)} → ${utc(s.end)} (${s.end - s.start}h) · ${s.evidence}`;
      },
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 56,
      name: "Hours since acceptance",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: trackingIntervals.map((s) => s.label),
      axisLabel: { fontSize: 10 },
    },
    series: [
      {
        id: "offset",
        type: "bar",
        stack: "interval",
        data: trackingIntervals.map((s) => s.start),
        itemStyle: { color: "transparent" },
        silent: true,
        tooltip: { show: false },
      },
      {
        id: "duration",
        type: "bar",
        stack: "interval",
        barMaxWidth: 22,
        data: trackingIntervals.map((s) => ({
          name: s.id,
          value: s.end - s.start,
          itemStyle: {
            color: s.color,
            opacity: s.id === "arrival" ? 0.45 : 1,
            borderColor: s.color,
            borderType:
              s.id === "gap" || s.id === "arrival" ? "dashed" : "solid",
            borderWidth: 2,
          },
        })),
        label: {
          show: true,
          position: "right",
          fontSize: 10,
          formatter: (p) => `${p.value}h`,
        },
        markLine: {
          symbol: "none",
          label: { show: false },
          lineStyle: { color: orange, type: "dotted" },
          data: [{ xAxis: 50 }],
        },
      },
    ],
  },
  dataTable: {
    columns: ["Stage", "Start UTC", "End / cutoff UTC", "Hours", "Evidence"],
    rows: trackingIntervals.map((s) => ({
      id: s.id,
      values: [s.label, utc(s.start), utc(s.end), s.end - s.start, s.evidence],
    })),
  },
};

export const warehouseProgress = [
  {
    id: "P-104",
    origin: "Oakland",
    accepted: 0,
    last: 40,
    delivered: false,
    low: 46,
    high: 52,
    state: "Final leg in transit",
    scanned: "Chicago",
    scanHour: 40,
  },
  {
    id: "P-105",
    origin: "Oakland",
    accepted: 5,
    last: 35,
    delivered: false,
    low: 48,
    high: 55,
    state: "Stale scan",
    scanned: "Salt Lake City",
    scanHour: 35,
  },
  {
    id: "P-201",
    origin: "Dallas",
    accepted: 8,
    last: 39,
    delivered: true,
    low: null,
    high: null,
    state: "Delivered",
    scanned: "Atlanta",
    scanHour: 39,
  },
  {
    id: "P-202",
    origin: "Dallas",
    accepted: 12,
    last: 41,
    delivered: false,
    low: 47,
    high: 53,
    state: "In transit",
    scanned: "Atlanta",
    scanHour: 41,
  },
  {
    id: "P-301",
    origin: "Newark",
    accepted: 20,
    last: 42,
    delivered: false,
    low: 50,
    high: 58,
    state: "In transit",
    scanned: "Chicago",
    scanHour: 42,
  },
];
export const warehouseProgressExample: ChartProps = {
  title: "Parcels from multiple warehouses",
  description:
    "Shared UTC timeline from Aug 3, 08:00 · Snapshot at hour 43 · Solid bars span acceptance to last observed event; pale intervals are predicted arrival windows.",
  notice:
    "P-105 has no scan since hour 35. Blank time after its last scan stays unknown. Elapsed time is not percent complete, and a forecast endpoint is not a delivery event.",
  option: {
    grid: { left: 112, right: 24, top: 48, bottom: 48 },
    legend: { top: 0, data: ["Observed span", "Arrival window"] },
    tooltip: { trigger: "item" },
    xAxis: {
      type: "value",
      min: 0,
      max: 60,
      name: "Hours since Aug 3, 08:00 UTC",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: warehouseProgress.map((p) => `${p.origin}\n${p.id}`),
      axisLabel: { fontSize: 10 },
    },
    series: [
      {
        id: "offset",
        type: "bar",
        stack: "progress",
        silent: true,
        itemStyle: { color: "transparent" },
        tooltip: { show: false },
        data: warehouseProgress.map((p) => p.accepted),
      },
      {
        id: "observed",
        name: "Observed span",
        type: "bar",
        stack: "progress",
        barMaxWidth: 18,
        itemStyle: { color: blue },
        data: warehouseProgress.map((p) => ({
          name: p.id,
          value: p.last - p.accepted,
          itemStyle: { color: p.delivered ? teal : blue },
        })),
      },
      {
        id: "unknown",
        type: "bar",
        stack: "progress",
        silent: true,
        itemStyle: { color: "transparent" },
        tooltip: { show: false },
        data: warehouseProgress.map((p) =>
          p.low === null ? null : p.low - p.last,
        ),
      },
      {
        id: "predicted",
        name: "Arrival window",
        type: "bar",
        stack: "progress",
        itemStyle: {
          color: "#c9b3e0",
          borderColor: purple,
          borderWidth: 1,
          borderType: "dashed",
        },
        data: warehouseProgress.map((p) =>
          p.high === null ? null : p.high - p.low!,
        ),
        markLine: {
          symbol: "none",
          label: { show: false },
          lineStyle: { color: "#47547f", type: "dotted" },
          data: [{ xAxis: 43 }],
        },
      },
    ],
  },
  dataTable: {
    columns: [
      "Parcel",
      "Warehouse",
      "State",
      "Accepted UTC",
      "Last event UTC",
      "Last scan location",
      "Arrival low UTC",
      "Arrival high UTC",
    ],
    rows: warehouseProgress.map((p) => ({
      id: p.id,
      values: [
        p.id,
        p.origin,
        p.state,
        utc(p.accepted),
        utc(p.last),
        p.scanned,
        p.low === null ? null : utc(p.low),
        p.high === null ? null : utc(p.high),
      ],
    })),
  },
};

export const logisticsExamples = [
  reliabilityExample,
  competitivenessExample,
  priceResponseExample,
  capacityExample,
  shipmentTimelineExample,
  warehouseProgressExample,
];
