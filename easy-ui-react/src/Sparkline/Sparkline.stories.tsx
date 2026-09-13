import { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./Sparkline";

const meta: Meta<typeof Sparkline> = {
  title: "Components/Sparkline",
  component: Sparkline,
};
export default meta;
type Story = StoryObj<typeof Sparkline>;

export const Default: Story = {
  args: {
    values: [4, 6, 5, 7, 8],
    accessibilityLabel: "Five daily observations, rising overall from 4 to 8",
  },
};
export const MissingObservations: Story = {
  args: {
    values: [4, 6, null, 7, 8],
    accessibilityLabel: "Five days with the third day missing",
  },
};
export const Constant: Story = {
  args: {
    values: [0, 0, 0],
    accessibilityLabel: "Zero exceptions on all three days",
  },
};
export const SingleObservation: Story = {
  args: { values: [4], accessibilityLabel: "One observation: 4" },
};
export const NoData: Story = {
  args: { values: [], accessibilityLabel: "Daily exceptions" },
};

export const ObservationMarkers: Story = {
  args: { ...Default.args, markers: "all" },
};
export const EndpointMarkers: Story = {
  args: { ...MissingObservations.args, markers: "endpoints" },
};
export const ExtremaMarkers: Story = {
  args: { ...Default.args, markers: "extrema" },
};

export const Unmarked: Story = {
  args: { ...Default.args, markers: "none" },
};
