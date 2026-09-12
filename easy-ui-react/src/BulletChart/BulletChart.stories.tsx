import { Meta, StoryObj } from "@storybook/react-vite";
import { BulletChart } from "./BulletChart";

const meta: Meta<typeof BulletChart> = {
  title: "Components/BulletChart",
  component: BulletChart,
};
export default meta;
type Story = StoryObj<typeof BulletChart>;

export const Default: Story = {
  args: {
    label: "On-time delivery",
    value: 97.8,
    target: 97,
    max: 100,
    formatValue: (value) => `${value}%`,
  },
};
export const CostTarget: Story = {
  args: {
    label: "Average rated cost",
    value: 5.2,
    target: 5.5,
    max: 8,
    formatValue: (value) => `$${value.toFixed(2)}`,
    targetLabel: "Budget per parcel",
  },
};
export const NoData: Story = { args: { ...Default.args, value: null } };
export const Zero: Story = {
  args: { label: "Delivery exceptions", value: 0, target: 10, max: 50 },
};
