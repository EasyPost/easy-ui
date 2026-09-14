import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { HorizontalGrid } from "../HorizontalGrid";
import { CompactTimeSeries } from "./CompactTimeSeries";

const meta: Meta<typeof CompactTimeSeries> = {
  title: "Components/CompactTimeSeries",
  component: CompactTimeSeries,
};
export default meta;
type Story = StoryObj<typeof CompactTimeSeries>;
const date = (day: number) => Date.UTC(2026, 7, day);
const times = [1, 2, 4, 7, 8, 10, 14].map(date);
const formatTime = (value: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);

export const Default: Story = {
  args: {
    label: "On-time delivery",
    description:
      "Aug 1–14 · UTC · Percent of delivered parcels with an estimate",
    domain: [90, 100],
    formatTime,
    formatValue: (value) => `${value}%`,
    reference: { value: 97, label: "Dotted line · Target" },
    markers: "all",
    series: [
      {
        id: "on-time",
        label: "Observed",
        points: times.map((time, i) => ({
          time,
          value: [94, 95, 94.5, null, 97, 98, 98.5][i],
        })),
      },
    ],
  },
};
export const Comparison: Story = {
  args: {
    ...Default.args,
    label: "Observed and plan",
    markers: "endpoints",
    series: [
      ...Default.args!.series!,
      {
        id: "plan",
        label: "Plan",
        points: times.map((time, i) => ({
          time,
          value: [95, 95.5, 96, 96.5, 97, 97.5, 98][i],
        })),
      },
    ],
  },
};
export const StepChanges: Story = {
  args: {
    label: "Published service price",
    description:
      "Aug 1–14 · UTC · USD per label; changes take effect at observations",
    domain: [4, 8],
    formatTime,
    formatValue: (value) => `$${value}`,
    interpolation: "step-after",
    markers: "all",
    series: [
      {
        id: "price",
        label: "Published price",
        points: [1, 4, 10, 14].map((day, i) => ({
          time: date(day),
          value: [6, 5.5, 6.5, 6.5][i],
        })),
      },
    ],
  },
};
export const SharedScales: Story = {
  render: () => (
    <HorizontalGrid columns={{ xs: 1, sm: 2 }} gap="3">
      {["West", "East"].map((region, i) => (
        <CompactTimeSeries
          key={region}
          {...Default.args}
          label={region}
          description="Aug 1–14 · UTC · Same percentage and time scales"
          domain={[90, 100]}
          timeDomain={[date(1), date(14)]}
          formatTime={formatTime}
          series={[
            {
              id: region,
              label: region,
              points: times.map((time, j) => ({
                time,
                value: [94, 95, 94.5, 96, 97, 98, 98.5][j] - i * 2,
              })),
            },
          ]}
        />
      ))}
    </HorizontalGrid>
  ),
};
export const NoData: Story = { args: { ...Default.args, series: [] } };
