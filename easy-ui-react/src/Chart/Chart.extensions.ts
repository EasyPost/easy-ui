import type { BarSeriesOption, LineSeriesOption } from "echarts";
import type { ChartProps } from "./Chart";
import { barExample, timeSeriesExample } from "./Chart.examples";

// Synthetic examples only. Each plot and its exact table share these records.
const blue = "#113abf",
  purple = "#772bb0",
  teal = "#007f86",
  orange = "#9b5900";
const grid = { left: 52, right: 24, top: 64, bottom: 48 };
const usd = (value: unknown) => `$${Number(value).toLocaleString("en-US")}`;
const day = (n: number) => Date.UTC(2026, 7, n);
const shortDate = (value: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);

export const labeledBarsExample: ChartProps = {
  ...barExample,
  title: "Costs with direct labels",
  description:
    "USD per label · The same comparison with values at each bar end; no hover needed.",
  option: {
    ...barExample.option,
    grid: { left: 72, right: 58, top: 52, bottom: 36 },
    xAxis: {
      type: "value",
      min: 0,
      max: 16,
      axisLabel: { formatter: (value: number) => `$${value}` },
    },
    yAxis: {
      type: "category",
      data: barExample.dataTable.rows.map((row) => String(row.values[0])),
      inverse: true,
    },
    series: (barExample.option.series as BarSeriesOption[]).map(
      (series): BarSeriesOption => ({
        ...series,
        label: {
          show: true,
          position: "right",
          fontSize: 11,
          formatter: (params) => `$${Number(params.value).toFixed(2)}`,
        },
        barMaxWidth: 22,
      }),
    ),
  },
};

export const annotatedTrendExample: ChartProps = {
  ...timeSeriesExample,
  title: "Targets, thresholds, and events",
  description:
    "Aug 1–14 · UTC · 97% target, below-95% warning region, and an Aug 6 service change. Annotations do not establish causation.",
  option: {
    ...timeSeriesExample.option,
    grid: { ...grid, top: 72, bottom: 70 },
    series: (timeSeriesExample.option.series as LineSeriesOption[]).map(
      (series, i) => ({
        ...series,
        ...(i === 0
          ? {
              markArea: {
                silent: true,
                itemStyle: { color: "rgba(189,105,0,0.06)" },
                data: [[{ yAxis: 90 }, { yAxis: 95 }]],
              },
              markLine: {
                silent: true,
                symbol: "none",
                label: {
                  fontSize: 10,
                  position: "insideEndTop",
                  formatter: "{b}",
                },
                data: [
                  {
                    yAxis: 97,
                    name: "Target 97%",
                    lineStyle: { type: "dashed", color: teal },
                  },
                  {
                    yAxis: 95,
                    name: "Warning 95%",
                    lineStyle: { type: "dotted", color: orange },
                  },
                  {
                    xAxis: day(6),
                    name: "Service change",
                    lineStyle: { type: "dotted", color: "#627891" },
                    label: { position: "insideStartTop", rotate: 90 },
                  },
                ],
              },
            }
          : {}),
      }),
    ),
  },
};

const scenarios = Array.from({ length: 9 }, (_, i) => {
  const adjustment = i - 8;
  return {
    adjustment,
    volume: -adjustment * 4,
    receipts: -adjustment * 3 - (adjustment * adjustment) / 2,
  };
});
export const scenarioExample: ChartProps = {
  title: "Scenario response",
  description:
    "Synthetic model · Changes relative to current pricing. Named settings and the shaded trial range are illustrative, not recommendations.",
  option: {
    grid: { ...grid, top: 84 },
    legend: { top: 8 },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "value",
      min: -8,
      max: 0,
      name: "Rate adjustment (%)",
      nameLocation: "middle",
      nameGap: 30,
      interval: 2,
    },
    yAxis: { type: "value", min: -10, max: 40, name: "Change (%)" },
    series: [
      {
        id: "volume",
        name: "Volume change",
        type: "line",
        data: scenarios.map((row) => [row.adjustment, row.volume]),
        itemStyle: { color: blue },
        symbol: "circle",
        symbolSize: 5,
        markLine: {
          silent: true,
          symbol: "none",
          label: {
            fontSize: 10,
            position: "insideStartBottom",
            formatter: "{b}",
          },
          data: [
            {
              yAxis: 0,
              name: "No change",
              lineStyle: { color: "#627891", type: "dotted" },
            },
          ],
        },
        markArea: {
          silent: true,
          itemStyle: { color: "rgba(17,58,191,0.06)" },
          label: { fontSize: 10, color: blue },
          data: [[{ xAxis: -3, name: "Trial range" }, { xAxis: -1 }]],
        },
      },
      {
        id: "receipts",
        name: "Net receipts change",
        type: "line",
        data: scenarios.map((row) => [row.adjustment, row.receipts]),
        itemStyle: { color: purple },
        lineStyle: { type: "dashed" },
        symbol: "circle",
        symbolSize: 5,
        markPoint: {
          symbol: "circle",
          symbolSize: 8,
          label: {
            show: true,
            fontSize: 10,
            formatter: "{b}",
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: [2, 3],
          },
          data: [
            {
              coord: [-3, 4.5],
              name: "Model peak",
              label: { position: "top", distance: 18 },
            },
            {
              coord: [-2, 4],
              name: "Proposed",
              label: { position: "bottom", distance: 16 },
            },
            { coord: [0, 0], name: "Current", label: { position: "left" } },
          ],
        },
      },
    ],
  },
  dataTable: {
    columns: ["Adjustment (%)", "Volume change (%)", "Net receipts change (%)"],
    rows: scenarios.map((row) => ({
      id: String(row.adjustment),
      values: [row.adjustment, row.volume, row.receipts],
    })),
  },
};

const buckets = [1, 2, 3, 4, 5, 6];
const counts = [80, 310, 350, 160, 70, 30];
const total = counts.reduce((a, b) => a + b, 0);
const distributionTable = {
  columns: ["Calendar days", "Delivered parcels", "Cumulative (%)"],
  rows: buckets.map((value, i) => ({
    id: String(value),
    values: [
      value,
      counts[i],
      (counts.slice(0, i + 1).reduce((a, b) => a + b, 0) / total) * 100,
    ],
  })),
};
export const histogramExample: ChartProps = {
  title: "Transit distribution",
  description:
    "1,000 synthetic delivered parcels · Equal one-day buckets. Bar labels show exact counts.",
  option: {
    legend: { show: false },
    grid,
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: buckets.map((value) => `${value}d`),
      name: "Calendar days",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: { type: "value", min: 0, name: "Parcels" },
    series: [
      {
        id: "transit",
        name: "Delivered parcels",
        type: "bar",
        data: counts,
        barCategoryGap: "5%",
        itemStyle: { color: blue },
        label: { show: true, position: "top", fontSize: 11 },
      },
    ],
  },
  dataTable: distributionTable,
};
export const cumulativeExample: ChartProps = {
  title: "Delivered by day",
  description:
    "Same 1,000 parcels · Cumulative observed share. By day 3: 74%; by day 4: 90%. This is not a delivery forecast.",
  option: {
    legend: { show: false },
    grid,
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "value",
      min: 0,
      max: 6,
      interval: 1,
      name: "Calendar days",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: { formatter: "{value}%" },
    },
    series: [
      {
        id: "cumulative",
        name: "Delivered share",
        type: "line",
        step: "end",
        symbolSize: 6,
        data: [
          [0, 0],
          ...distributionTable.rows.map((row) => [
            row.values[0],
            row.values[2],
          ]),
        ],
        itemStyle: { color: blue },
        markLine: {
          silent: true,
          symbol: "none",
          label: {
            formatter: "90%",
            position: "insideEndBottom",
            fontSize: 10,
          },
          lineStyle: { type: "dotted", color: teal },
          data: [{ yAxis: 90 }],
        },
      },
    ],
  },
  dataTable: distributionTable,
};

const summaries = [
  { name: "Ground", count: 400, values: [1, 2, 3, 4, 7] },
  { name: "Two-day", count: 350, values: [1, 1.5, 2, 2.5, 4] },
  { name: "Next-day", count: 250, values: [0.5, 1, 1, 1.5, 3] },
];
export const boxPlotExample: ChartProps = {
  title: "Arrival spread by service",
  description:
    "Supplied synthetic summaries · Whiskers: min/max; box: P25–P75; center: median. Bounds are descriptive, not confidence intervals.",
  option: {
    legend: { show: false },
    grid: { left: 74, right: 24, top: 36, bottom: 48 },
    tooltip: { trigger: "item" },
    xAxis: {
      type: "value",
      min: 0,
      max: 8,
      name: "Calendar days",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "category",
      data: summaries.map((row) => row.name),
      inverse: true,
    },
    series: [
      {
        id: "spread",
        name: "Arrival spread",
        type: "boxplot",
        layout: "horizontal",
        data: summaries.map((row) => row.values),
        itemStyle: { color: "#dce5ff", borderColor: blue },
        boxWidth: [12, 32],
      },
    ],
  },
  dataTable: {
    columns: [
      "Service",
      "Count",
      "Min days",
      "P25 days",
      "Median days",
      "P75 days",
      "Max days",
    ],
    rows: summaries.map((row) => ({
      id: row.name,
      values: [row.name, row.count, ...row.values],
    })),
  },
};

const forecast = Array.from({ length: 10 }, (_, i) => ({
  time: day(i + 1),
  observed: i < 5 ? [95.4, 95.8, 96.2, 95.9, 96.4][i] : null,
  predicted: i >= 4 ? [96.4, 96.7, 97, 97.2, 97.4, 97.5][i - 4] : null,
  lower: i >= 4 ? [96.4, 95.8, 95.8, 95.7, 95.6, 95.5][i - 4] : null,
  upper: i >= 4 ? [96.4, 97.6, 98.2, 98.7, 99.2, 99.5][i - 4] : null,
}));
export const predictionBandExample: ChartProps = {
  title: "Observed and predicted performance",
  description:
    "Aug 1–10 · UTC · Synthetic model output. Shading is a supplied 80% prediction interval; it is not a target or confidence interval.",
  option: {
    useUTC: true,
    grid: { ...grid, top: 72 },
    legend: { top: 8, data: ["Observed", "Predicted"] },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "time",
      axisLabel: { formatter: shortDate, hideOverlap: true },
    },
    yAxis: { type: "value", min: 94, max: 100, name: "On time (%)" },
    series: [
      {
        id: "lower",
        type: "line",
        stack: "interval",
        symbol: "none",
        lineStyle: { opacity: 0 },
        silent: true,
        tooltip: { show: false },
        data: forecast.map((row) => [row.time, row.lower]),
      },
      {
        id: "interval",
        type: "line",
        stack: "interval",
        symbol: "none",
        lineStyle: { opacity: 0 },
        areaStyle: { color: "rgba(17,58,191,0.18)" },
        silent: true,
        tooltip: { show: false },
        data: forecast.map((row) => [
          row.time,
          row.upper === null ? null : row.upper - row.lower!,
        ]),
      },
      {
        id: "observed",
        name: "Observed",
        type: "line",
        symbolSize: 5,
        itemStyle: { color: blue },
        data: forecast.map((row) => [row.time, row.observed]),
      },
      {
        id: "prediction",
        name: "Predicted",
        type: "line",
        symbolSize: 5,
        itemStyle: { color: blue },
        lineStyle: { type: "dashed" },
        data: forecast.map((row) => [row.time, row.predicted]),
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { type: "dotted", color: "#627891" },
          label: {
            formatter: "Forecast starts",
            fontSize: 10,
            position: "insideEndTop",
          },
          data: [{ xAxis: day(5) }],
        },
      },
    ],
  },
  dataTable: {
    columns: [
      "Date (UTC)",
      "Observed (%)",
      "Predicted (%)",
      "Lower 80% bound (%)",
      "Upper 80% bound (%)",
    ],
    rows: forecast.map((row) => ({
      id: String(row.time),
      values: [
        shortDate(row.time),
        row.observed,
        row.predicted,
        row.lower,
        row.upper,
      ],
    })),
  },
};

const bridge = [
  { name: "Receipts", change: 24000 },
  { name: "Delivery", change: -9000 },
  { name: "Fees", change: -1200 },
  { name: "Credits", change: 500 },
].map((row, i, rows) => {
  const before = rows.slice(0, i).reduce((sum, item) => sum + item.change, 0);
  return { ...row, before, after: before + row.change };
});
const balance = bridge[bridge.length - 1].after;
export const waterfallExample: ChartProps = {
  title: "From receipts to contribution",
  description:
    "Synthetic USD ledger · $24,000 − $9,000 − $1,200 + $500 = $14,300. Costs and fees are explicit; bar heights reconcile to the table.",
  option: {
    legend: { show: false },
    grid: { ...grid, top: 44 },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const item = Array.isArray(params)
          ? params.find((entry) => entry.seriesId === "changes")
          : params;
        const row = bridge[item?.dataIndex ?? bridge.length];
        return row
          ? `${row.name}: ${usd(row.change)}<br/>Balance: ${usd(row.after)}`
          : `Net contribution: ${usd(balance)}`;
      },
    },
    xAxis: {
      type: "category",
      data: [...bridge.map((row) => row.name), "Net"],
      axisLabel: { interval: 0, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 28000,
      axisLabel: { formatter: (value: number) => `$${value / 1000}k` },
    },
    series: [
      {
        id: "base",
        type: "bar",
        stack: "bridge",
        silent: true,
        itemStyle: { color: "transparent" },
        tooltip: { show: false },
        emphasis: { disabled: true },
        data: [...bridge.map((row) => Math.min(row.before, row.after)), 0],
      },
      {
        id: "changes",
        name: "USD",
        type: "bar",
        stack: "bridge",
        barMaxWidth: 40,
        label: {
          show: true,
          position: "top",
          fontSize: 10,
          formatter: (params) =>
            params.dataIndex === bridge.length
              ? "$14.3k"
              : `${bridge[params.dataIndex].change < 0 ? "−" : ""}$${Math.abs(bridge[params.dataIndex].change) / 1000}k`,
        },
        tooltip: { valueFormatter: (value) => usd(value) },
        data: [
          ...bridge.map((row) => ({
            value: Math.abs(row.change),
            itemStyle: { color: row.change < 0 ? orange : blue },
          })),
          { value: balance, itemStyle: { color: teal } },
        ],
      },
    ],
  },
  dataTable: {
    columns: ["Step", "Change (USD)", "Running balance (USD)"],
    rows: [
      ...bridge.map((row) => ({
        id: row.name,
        values: [row.name, row.change, row.after],
      })),
      { id: "net", values: ["Net contribution", null, balance] },
    ],
  },
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["00–04", "04–08", "08–12", "12–16", "16–20", "20–24"];
const cells = weekdays.flatMap((weekday, y) =>
  hours.map((hour, x) => {
    const count = y === 6 && x === 0 ? 18 : 300 + ((x * 131 + y * 73) % 700);
    const rate = Number((0.5 + ((x * 3 + y * 2) % 19) / 10).toFixed(1));
    const exceptions = Math.round((count * rate) / 100);
    return {
      id: `${y}-${x}`,
      weekday,
      hour,
      x,
      y,
      count,
      exceptions,
      rate: count < 50 ? null : Number(((exceptions / count) * 100).toFixed(1)),
    };
  }),
);
export const periodicHeatmapExample: ChartProps = {
  title: "Exceptions by weekday and hour",
  description:
    "Synthetic UTC cohorts · Percent of parcels with exceptions. Cells with fewer than 50 parcels are blank; table retains counts. No causal inference.",
  height: 340,
  option: {
    grid: { left: 42, right: 12, top: 24, bottom: 88 },
    tooltip: { trigger: "item" },
    xAxis: {
      type: "category",
      data: hours,
      axisLabel: { interval: 0, fontSize: 9, rotate: 30 },
    },
    yAxis: {
      type: "category",
      data: weekdays,
      inverse: true,
      axisLabel: { fontSize: 10 },
    },
    visualMap: {
      min: 0,
      max: 3,
      orient: "horizontal",
      left: "center",
      bottom: 8,
      itemWidth: 10,
      itemHeight: 110,
      text: ["3%", "0%"],
      calculable: false,
      inRange: { color: ["#eff3ff", "#9eafe8", blue] },
    },
    series: [
      {
        id: "patterns",
        type: "heatmap",
        data: cells
          .filter((cell) => cell.rate !== null)
          .map((cell) => ({
            value: [cell.x, cell.y, cell.rate],
            // Black/white switch keeps small labels above 4.5:1 on this scale.
            label: { color: cell.rate! >= 2.3 ? "#ffffff" : "#000000" },
          })),
        label: {
          show: true,
          fontSize: 10,
          formatter: (params) => `${(params.value as number[])[2]}%`,
        },
        itemStyle: { borderColor: "#ffffff", borderWidth: 2 },
      },
    ],
  },
  dataTable: {
    columns: [
      "Weekday (UTC)",
      "Hour (UTC)",
      "Parcels",
      "Exceptions",
      "Exception rate (%)",
    ],
    rows: cells.map((cell) => ({
      id: cell.id,
      values: [cell.weekday, cell.hour, cell.count, cell.exceptions, cell.rate],
    })),
  },
};

export const extensionExamples = [
  labeledBarsExample,
  annotatedTrendExample,
  scenarioExample,
  histogramExample,
  cumulativeExample,
  boxPlotExample,
  predictionBandExample,
  waterfallExample,
  periodicHeatmapExample,
];
