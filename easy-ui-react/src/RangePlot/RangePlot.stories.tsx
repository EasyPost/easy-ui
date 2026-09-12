import { Meta, StoryObj } from "@storybook/react-vite";
import { RangePlot } from "./RangePlot";

const meta: Meta<typeof RangePlot> = {
  title: "Components/RangePlot",
  component: RangePlot,
};
export default meta;
type Story = StoryObj<typeof RangePlot>;
export const Default: Story = {
  args: {
    label: "Price position",
    description: "USD per label · Synthetic offers on one shared scale",
    domain: [4, 8],
    formatValue: (value) => `$${value.toFixed(2)}`,
    interval: { from: 5.5, to: 7.4, label: "Allowed" },
    points: [
      { id: "current", label: "Current", value: 6.4 },
      { id: "proposed", label: "Proposed", value: 5.9 },
      { id: "alternative", label: "Alternative", value: 6.1 },
    ],
  },
};
export const TransitWindow: Story = {
  args: {
    label: "Arrival percentiles",
    description:
      "Calendar days · Supplied percentiles, not a confidence interval",
    domain: [0, 7],
    formatValue: (value) => `${value}d`,
    interval: { from: 2, to: 4, label: "P50–P90" },
    points: [
      { id: "p50", label: "P50", value: 2 },
      { id: "p90", label: "P90", value: 4 },
      { id: "p99", label: "P99", value: 6 },
      { id: "promise", label: "Promise", value: 3 },
    ],
  },
};
export const EqualBounds: Story = {
  args: {
    ...Default.args,
    interval: { from: 6.4, to: 6.4, label: "Fixed offer" },
  },
};
export const SignedAndMissing: Story = {
  args: {
    label: "Change from baseline",
    description: "Percentage points · Missing observations stay unavailable",
    domain: [-5, 5],
    formatValue: (value) => `${value > 0 ? "+" : ""}${value} pp`,
    points: [
      { id: "west", label: "West", value: 2 },
      { id: "east", label: "East", value: -1 },
      { id: "central", label: "Central", value: null },
    ],
  },
};
