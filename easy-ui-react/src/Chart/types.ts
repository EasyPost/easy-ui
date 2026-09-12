import type { EChartsOption, ECElementEvent } from "echarts";

/** Native ECharts options, including Cartesian, flow, hierarchy, and graph series. */
export type ChartOption = EChartsOption;
export type ChartSelection = Pick<
  ECElementEvent,
  | "seriesId"
  | "seriesName"
  | "name"
  | "dataIndex"
  | "dataType"
  | "data"
  | "value"
>;

export type ChartDataRow = {
  /** Stable application identifier used for keyboard-accessible drill-down. */
  id: string;
  /** Formatted values, in the same order as the column labels. null is missing. */
  values: (string | number | null)[];
};

export type ChartDataTable = {
  columns: string[];
  rows: ChartDataRow[];
};
