import type { ChartProps } from "./Chart";

// Public, synthetic fixtures. The plots and exact-value tables share these records.
const blue = "#113abf";
const purple = "#772bb0";
const teal = "#007f86";
const orange = "#bd6900";
const colors = [blue, purple, teal];
const carriers = ["Carrier A", "Carrier B", "Carrier C"];
const grid = { left: 52, right: 20, top: 72, bottom: 48, containLabel: false };
const shortDate = (value: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
const dates = [1, 2, 3, 4, 5, 8, 9, 10, 11, 14].map((day) =>
  Date.UTC(2026, 7, day),
);
const performance = [
  [96.1, 96.5, 96.2, 97, 97.4, 97.1, null, 98, 98.2, 98.4],
  [94.8, 95.2, 95.6, 95.3, 96, 96.5, 96.3, 96.8, 97.1, 97.3],
  [93.8, 94.4, 94.1, 95, 94.7, 95.4, 95.8, 96.1, 96.5, 96.4],
];

export const timeSeriesExample: ChartProps = {
  title: "On-time delivery",
  description:
    "Aug 1–14 · UTC · Delivered parcels with an estimate. Dashed line: 97% target; unavailable observations remain gaps.",
  option: {
    useUTC: true,
    grid: { ...grid, bottom: 70 },
    legend: { top: 10, itemWidth: 16, itemGap: 12 },
    tooltip: { trigger: "axis", valueFormatter: (value) => `${value}%` },
    xAxis: {
      type: "time",
      axisLabel: { formatter: shortDate, hideOverlap: true },
    },
    yAxis: {
      type: "value",
      name: "On time (%)",
      min: 90,
      max: 100,
      interval: 2,
    },
    dataZoom: [
      {
        type: "slider",
        bottom: 8,
        height: 18,
        showDetail: false,
        brushSelect: false,
      },
    ],
    series: carriers.map((name, index) => ({
      id: name,
      name,
      type: "line",
      symbolSize: 6,
      connectNulls: false,
      itemStyle: { color: colors[index] },
      data: dates.map((date, i) => [date, performance[index][i]]),
      ...(index === 0
        ? {
            markLine: {
              silent: true,
              symbol: "none",
              label: { show: false },
              lineStyle: { type: "dashed", color: "#627891" },
              data: [{ yAxis: 97, name: "97% target" }],
            },
          }
        : {}),
    })),
  },
  dataTable: {
    columns: ["Date (UTC)", ...carriers.map((name) => `${name} (%)`)],
    rows: dates.map((date, i) => ({
      id: String(date),
      values: [shortDate(date), ...performance.map((values) => values[i])],
    })),
  },
};

const volume = [
  [480, 540, 520, 640, 600, 690, 660, 730, 760, 820],
  [320, 360, 340, 380, 410, 430, 390, 460, 480, 510],
  [180, 210, 190, 240, 230, 280, 260, 310, 330, 350],
];
export const areaExample: ChartProps = {
  title: "Daily parcel volume",
  description:
    "Aug 1–14 · UTC · Stacked shipment counts by carrier; the vertical scale starts at zero.",
  option: {
    useUTC: true,
    grid,
    legend: { top: 10, itemWidth: 16, itemGap: 12 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "time", axisLabel: { formatter: shortDate } },
    yAxis: { type: "value", name: "Parcels", min: 0 },
    series: carriers.map((name, index) => ({
      id: name,
      name,
      type: "line",
      stack: "total",
      symbol: "none",
      areaStyle: { opacity: 0.2 },
      itemStyle: { color: colors[index] },
      data: dates.map((date, i) => [date, volume[index][i]]),
    })),
  },
  dataTable: {
    columns: ["Date (UTC)", ...carriers],
    rows: dates.map((date, i) => ({
      id: String(date),
      values: [shortDate(date), ...volume.map((values) => values[i])],
    })),
  },
};

const services = ["Ground", "Two-day", "Next-day"];
const spend = [5.2, 8.4, 12.6];
const benchmark = [5.6, 8, 13.8];
export const barExample: ChartProps = {
  title: "Rated cost vs benchmark",
  description:
    "USD per label · Matched service cohorts · Benchmarks are illustrative comparisons, not observed savings.",
  option: {
    grid,
    legend: { top: 10 },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    xAxis: { type: "category", data: services },
    yAxis: { type: "value", name: "USD / label", min: 0 },
    series: [
      {
        id: "actual",
        name: "Rated cost",
        type: "bar",
        data: spend,
        itemStyle: { color: blue },
        barMaxWidth: 34,
      },
      {
        id: "benchmark",
        name: "Benchmark",
        type: "bar",
        data: benchmark,
        itemStyle: { color: "#98aacd" },
        barMaxWidth: 34,
      },
    ],
  },
  dataTable: {
    columns: ["Service", "Rated cost (USD)", "Benchmark (USD)"],
    rows: services.map((service, i) => ({
      id: service,
      values: [service, spend[i], benchmark[i]],
    })),
  },
};

const mix = [
  [62, 28, 10],
  [45, 40, 15],
  [70, 20, 10],
];
export const stackedBarExample: ChartProps = {
  title: "Transit-time distribution",
  description:
    "Delivered parcels · Normalized to 100% within each carrier · Calendar-day bins are explicit.",
  option: {
    grid: { ...grid, left: 80 },
    legend: { top: 10 },
    tooltip: { trigger: "axis", valueFormatter: (value) => `${value}%` },
    xAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: { formatter: "{value}%" },
    },
    yAxis: { type: "category", data: carriers },
    series: ["1–2 days", "3 days", "4+ days"].map((name, index) => ({
      id: name,
      name,
      type: "bar",
      stack: "total",
      data: mix.map((values) => values[index]),
      itemStyle: { color: colors[index] },
      barMaxWidth: 32,
    })),
  },
  dataTable: {
    columns: ["Carrier", "1–2 days (%)", "3 days (%)", "4+ days (%)"],
    rows: carriers.map((carrier, i) => ({
      id: carrier,
      values: [carrier, ...mix[i]],
    })),
  },
};

const points = [
  {
    id: "a-ground",
    carrier: 0,
    name: "A · Ground",
    days: 3.2,
    cost: 5.2,
    count: 2400,
  },
  {
    id: "a-two",
    carrier: 0,
    name: "A · Two-day",
    days: 2.1,
    cost: 8.4,
    count: 1100,
  },
  {
    id: "a-next",
    carrier: 0,
    name: "A · Next-day",
    days: 1.2,
    cost: 12.6,
    count: 400,
  },
  {
    id: "b-ground",
    carrier: 1,
    name: "B · Ground",
    days: 3.6,
    cost: 4.8,
    count: 1800,
  },
  {
    id: "b-two",
    carrier: 1,
    name: "B · Two-day",
    days: 2.3,
    cost: 7.9,
    count: 800,
  },
  {
    id: "b-next",
    carrier: 1,
    name: "B · Next-day",
    days: 1.4,
    cost: 11.8,
    count: 300,
  },
  {
    id: "c-ground",
    carrier: 2,
    name: "C · Ground",
    days: 2.9,
    cost: 5.6,
    count: 1200,
  },
  {
    id: "c-two",
    carrier: 2,
    name: "C · Two-day",
    days: 1.9,
    cost: 8.9,
    count: 600,
  },
  {
    id: "c-next",
    carrier: 2,
    name: "C · Next-day",
    days: 1.1,
    cost: 13.2,
    count: 220,
  },
];
export const scatterExample: ChartProps = {
  title: "Cost and speed tradeoffs",
  description:
    "Matched service cohorts · Bubble area represents parcel count · Lower and farther left means cheaper and faster.",
  option: {
    grid: { ...grid, bottom: 60 },
    legend: { top: 10, itemWidth: 16, itemGap: 12 },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params;
        const [days, cost, count] = p.value as number[];
        return `${p.name}\n${days} calendar days · $${cost.toFixed(2)}\n${count.toLocaleString("en-US")} parcels`;
      },
    },
    xAxis: {
      type: "value",
      name: "Transit (calendar days)",
      nameLocation: "middle",
      nameGap: 28,
      min: 0,
      max: 5,
    },
    yAxis: { type: "value", name: "USD / label", min: 0, max: 15, interval: 3 },
    series: carriers.map((name, index) => ({
      id: name,
      name,
      type: "scatter",
      itemStyle: { color: colors[index], opacity: 0.8 },
      symbolSize: (value: number[]) => Math.sqrt(value[2]) * 0.72,
      data: points
        .filter((point) => point.carrier === index)
        .map((point) => ({
          name: point.name,
          value: [point.days, point.cost, point.count],
        })),
    })),
  },
  dataTable: {
    columns: ["Service", "Calendar days", "USD / label", "Parcels"],
    rows: points.map((point) => ({
      id: point.id,
      values: [point.name, point.days, point.cost, point.count],
    })),
  },
};

const flows: [string, string, number][] = [
  ["West", "Carrier A", 2400],
  ["West", "Carrier B", 1000],
  ["West", "Carrier C", 600],
  ["Central", "Carrier A", 1000],
  ["Central", "Carrier B", 1800],
  ["Central", "Carrier C", 700],
  ["East", "Carrier A", 2000],
  ["East", "Carrier B", 1200],
  ["East", "Carrier C", 1300],
  ["Carrier A", "Delivered", 5000],
  ["Carrier A", "In transit", 320],
  ["Carrier A", "Exception", 80],
  ["Carrier B", "Delivered", 3560],
  ["Carrier B", "In transit", 320],
  ["Carrier B", "Exception", 120],
  ["Carrier C", "Delivered", 2300],
  ["Carrier C", "In transit", 240],
  ["Carrier C", "Exception", 60],
];
const nodes = [
  "West",
  "Central",
  "East",
  ...carriers,
  "Delivered",
  "In transit",
  "Exception",
];
export const sankeyExample: ChartProps = {
  title: "Where parcels go",
  description:
    "12,000 parcels · Origin → carrier → current outcome · Link width encodes parcel count; flows balance at each carrier.",
  height: 360,
  option: {
    tooltip: {
      trigger: "item",
      valueFormatter: (value) =>
        `${Number(value).toLocaleString("en-US")} parcels`,
    },
    series: [
      {
        id: "parcel-flow",
        type: "sankey",
        left: 12,
        right: 82,
        top: 32,
        bottom: 24,
        nodeWidth: 14,
        nodeGap: 22,
        draggable: false,
        nodeAlign: "justify",
        emphasis: { focus: "adjacency" },
        lineStyle: { color: "source", opacity: 0.22, curveness: 0.5 },
        label: { fontSize: 11 },
        data: nodes.map((name, index) => ({
          name,
          itemStyle: {
            color:
              index < 3
                ? "#627891"
                : index < 6
                  ? colors[index - 3]
                  : [teal, blue, orange][index - 6],
          },
        })),
        links: flows.map(([source, target, value]) => ({
          source,
          target,
          value,
        })),
      },
    ],
    media: [
      {
        query: { maxWidth: 450 },
        option: {
          series: [
            {
              id: "parcel-flow",
              type: "sankey",
              orient: "horizontal",
              left: 4,
              right: 66,
              top: 28,
              bottom: 30,
              nodeWidth: 12,
              nodeGap: 16,
              label: { position: "right", fontSize: 10 },
            },
          ],
        },
      },
    ],
  },
  dataTable: {
    columns: ["Source", "Destination", "Parcels"],
    rows: flows.map(([source, target, value]) => ({
      id: `${source}:${target}`,
      values: [source, target, value],
    })),
  },
};

const zones = ["Zone 2", "Zone 4", "Zone 6", "Zone 8"];
const weights = ["<1 lb", "1–3 lb", "3–5 lb", "5–10 lb"];
const rates = [
  [99.2, 98.4, 97.6, 95.2],
  [98.8, 97.7, 96.5, 94.3],
  [98.1, 96.8, null, 92.7],
  [96.9, 95.5, 93.4, 90.8],
];
const cells = weights.flatMap((weight, y) =>
  zones.map((zone, x) => ({
    id: `${zone}:${weight}`,
    x,
    y,
    zone,
    weight,
    rate: rates[y][x],
    count: rates[y][x] === null ? null : 180 + x * 35 + y * 60,
  })),
);
export const heatmapExample: ChartProps = {
  title: "Performance by zone and weight",
  description:
    "On-time delivery (%) · Delivered parcels with an estimate · Blank cell is unavailable; sample counts are in the table.",
  option: {
    grid: { left: 64, right: 16, top: 28, bottom: 88 },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params;
        const [x, y, rate, count] = p.value as number[];
        return `${zones[x]} · ${weights[y]}\n${rate}% on time · ${count} parcels`;
      },
    },
    xAxis: { type: "category", data: zones, splitArea: { show: false } },
    yAxis: { type: "category", data: weights, inverse: true },
    visualMap: {
      min: 90,
      max: 100,
      dimension: 2,
      orient: "horizontal",
      left: "center",
      bottom: 8,
      itemWidth: 10,
      itemHeight: 140,
      text: ["100%", "90%"],
      calculable: false,
      inRange: { color: ["#eaf0ff", "#7394ff", blue] },
    },
    series: [
      {
        id: "on-time-matrix",
        type: "heatmap",
        label: {
          show: true,
          formatter: (params) => `${(params.value as number[])[2]}%`,
          fontSize: 11,
        },
        itemStyle: { borderWidth: 3, borderColor: "#ffffff" },
        data: cells
          .filter((cell) => cell.rate !== null)
          .map((cell) => ({
            value: [cell.x, cell.y, cell.rate!, cell.count!],
            // Black retains 4.5:1 contrast through the middle of this scale.
            label: { color: cell.rate! > 97 ? "#ffffff" : "#000000" },
          })),
      },
    ],
  },
  dataTable: {
    columns: ["Zone", "Weight", "On time (%)", "Parcels"],
    rows: cells.map((cell) => ({
      id: cell.id,
      values: [cell.zone, cell.weight, cell.rate, cell.count],
    })),
  },
};

const exceptions = [
  { name: "Address", value: 92 },
  { name: "Weather", value: 68 },
  { name: "Carrier", value: 56 },
  { name: "Other", value: 44 },
];
export const donutExample: ChartProps = {
  title: "Exception reasons",
  description:
    "260 parcels currently in exception · Mutually exclusive primary reasons · Counts are illustrative.",
  option: {
    color: [blue, purple, teal, orange],
    tooltip: { trigger: "item", valueFormatter: (value) => `${value} parcels` },
    legend: {
      orient: "vertical",
      right: 4,
      top: "center",
      itemGap: 18,
      formatter: (name) =>
        `${name}  ${exceptions.find((item) => item.name === name)?.value}`,
    },
    series: [
      {
        id: "exception-reasons",
        type: "pie",
        radius: ["38%", "62%"],
        center: ["32%", "50%"],
        label: { show: false },
        data: exceptions,
      },
    ],
    media: [
      {
        query: { maxWidth: 450 },
        option: {
          legend: {
            orient: "horizontal",
            bottom: 8,
            top: "auto",
            right: "auto",
            left: "center",
            itemGap: 12,
          },
          series: [
            { id: "exception-reasons", type: "pie", center: ["50%", "42%"] },
          ],
        },
      },
    ],
  },
  dataTable: {
    columns: ["Primary reason", "Parcels"],
    rows: exceptions.map((item) => ({
      id: item.name,
      values: [item.name, item.value],
    })),
  },
};

const hierarchy = [
  { name: "West", values: [2600, 1000, 400] },
  { name: "Central", values: [2200, 900, 400] },
  { name: "East", values: [2800, 1200, 500] },
];
export const treemapExample: ChartProps = {
  title: "Volume by origin and service",
  description:
    "12,000 parcels · Nested rectangles group services within origins · Area encodes volume.",
  option: {
    tooltip: {
      trigger: "item",
      valueFormatter: (value) =>
        `${Number(value).toLocaleString("en-US")} parcels`,
    },
    series: [
      {
        id: "origin-service",
        type: "treemap",
        left: 4,
        right: 4,
        top: 20,
        bottom: 12,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: "{b}\n{c}",
          color: "#ffffff",
          fontSize: 11,
        },
        upperLabel: {
          show: true,
          height: 24,
          color: "#172b4d",
          formatter: "{b}",
        },
        levels: [
          {
            itemStyle: { gapWidth: 4, borderWidth: 0 },
            upperLabel: { show: false },
          },
          {
            itemStyle: {
              gapWidth: 2,
              borderWidth: 4,
              borderColor: "#edf1f7",
            },
          },
        ],
        data: hierarchy.map((origin, index) => ({
          name: origin.name,
          itemStyle: { color: colors[index] },
          children: services.map((_name, i) => ({
            name: ["Ground", "2-day", "1-day"][i],
            value: origin.values[i],
            label: { show: origin.values[i] >= 600 },
          })),
        })),
      },
    ],
  },
  dataTable: {
    columns: ["Origin", "Service", "Parcels"],
    rows: hierarchy.flatMap((origin) =>
      services.map((name, index) => ({
        id: `${origin.name}:${name}`,
        values: [origin.name, name, origin.values[index]],
      })),
    ),
  },
};

export const allExamples = [
  sankeyExample,
  timeSeriesExample,
  areaExample,
  barExample,
  scatterExample,
  heatmapExample,
  stackedBarExample,
  donutExample,
  treemapExample,
];
