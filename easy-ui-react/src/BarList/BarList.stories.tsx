import { Meta, StoryObj } from "@storybook/react-vite";
import { BarList } from "./BarList";

const meta: Meta<typeof BarList> = {
  title: "Components/BarList",
  component: BarList,
};
export default meta;
type Story = StoryObj<typeof BarList>;

export const Default: Story = {
  args: {
    label: "June parcel volume by service",
    formatValue: (value) => value.toLocaleString("en-US"),
    data: [
      { id: "ground", label: "Ground", value: 14800 },
      { id: "two-day", label: "2-day", value: 6200 },
      { id: "next-day", label: "Next-day", value: 3810 },
    ],
  },
};
export const ZeroAndMissing: Story = {
  args: {
    label: "Delivery exceptions by origin",
    data: [
      { id: "west", label: "West", value: 12 },
      { id: "central", label: "Central", value: 0 },
      { id: "east", label: "East", value: null },
    ],
  },
};
export const NoData: Story = {
  args: { label: "Parcel volume by service", data: [] },
};
