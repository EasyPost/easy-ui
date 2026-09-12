import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "./Chart";
import {
  timeSeriesExample,
  areaExample,
  barExample,
  scatterExample,
  sankeyExample,
  heatmapExample,
  stackedBarExample,
  donutExample,
  treemapExample,
  allExamples,
} from "./Chart.examples";
import styles from "./examples.module.scss";

const meta: Meta<typeof Chart> = {
  title: "Components/Chart",
  component: Chart,
  excludeStories: ["AnalyticalExamples"],
};
export default meta;
type Story = StoryObj<typeof Chart>;

export const TimeSeries: Story = { args: timeSeriesExample };
export const Area: Story = { args: areaExample };
export const GroupedBars: Story = { args: barExample };
export const StackedBars: Story = { args: stackedBarExample };
export const ScatterAndBubble: Story = { args: scatterExample };
export const Sankey: Story = { args: sankeyExample };
export const Heatmap: Story = { args: heatmapExample };
export const Donut: Story = { args: donutExample };
export const Treemap: Story = { args: treemapExample };
export const Loading: Story = {
  args: { ...timeSeriesExample, status: "loading" },
};
export const NoData: Story = {
  args: { ...timeSeriesExample, status: "empty" },
};
export const Error: Story = {
  args: { ...timeSeriesExample, status: "error", onRetry: () => undefined },
};
export const PartialData: Story = {
  args: {
    ...timeSeriesExample,
    notice:
      "Partial coverage: Carrier A has no observation on Aug 9. Other observations are available.",
  },
};
export const Canvas: Story = {
  args: { ...scatterExample, renderer: "canvas" },
};

export function AnalyticalExamples({
  renderer = "svg",
}: { renderer?: "svg" | "canvas" } = {}) {
  const [selection, setSelection] = useState<string | null>(null);
  return (
    <div className={styles.gallery}>
      {allExamples.map((example, index) => (
        <div
          key={example.title}
          className={index === 0 ? styles.wide : undefined}
        >
          <Chart
            {...example}
            renderer={renderer}
            {...(example === scatterExample
              ? {
                  onSelect: (selected) => setSelection(selected.name),
                  onRowSelect: setSelection,
                  notice: selection
                    ? `Selected cohort: ${selection}`
                    : "Select a bubble or table row to inspect a cohort.",
                }
              : {})}
          />
        </div>
      ))}
    </div>
  );
}
export const ShippingAnalytics: Story = {
  render: () => <AnalyticalExamples />,
};
