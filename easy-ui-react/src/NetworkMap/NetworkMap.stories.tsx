import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NetworkMapExample } from "./NetworkMap.examples";
const meta: Meta<typeof NetworkMapExample> = {
  title: "Components/NetworkMap",
  component: NetworkMapExample,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof NetworkMapExample>;
export const ParcelJourney: Story = {
  render: () => <NetworkMapExample audience="parcel" />,
};
export const ShipperFlow: Story = {
  render: () => <NetworkMapExample audience="shipper" />,
};
export const CarrierOperations: Story = {
  render: () => <NetworkMapExample audience="carrier" />,
};
