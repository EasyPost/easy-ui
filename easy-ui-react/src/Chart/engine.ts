import type { EChartsType } from "echarts";

// Optional peer dependency: ordinary Easy UI imports never load this engine.
// A native dynamic import also works from the package's CommonJS entry point.
export function loadChartEngine(): Promise<
  Pick<typeof import("echarts"), "init">
> {
  return import("echarts");
}

export type ChartInstance = EChartsType;
