import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "./Chart";
import {
  logisticsExamples,
  reliabilityExample,
  competitivenessExample,
  priceResponseExample,
  capacityExample,
  shipmentTimelineExample,
  warehouseProgressExample,
} from "./Chart.logistics";
import styles from "./examples.module.scss";

const meta: Meta<typeof Chart> = {
  title: "Components/Chart/Logistics",
  component: Chart,
  excludeStories: ["LogisticsExamples"],
};
export default meta;
type Story = StoryObj<typeof Chart>;
export const TransitReliability: Story = { args: reliabilityExample };
export const RateCompetitiveness: Story = { args: competitivenessExample };
export const PriceVolumeResponse: Story = { args: priceResponseExample };
export const CapacityPlanning: Story = { args: capacityExample };
export const ShipmentTimeline: Story = { args: shipmentTimelineExample };
export const WarehouseParcelProgress: Story = {
  args: warehouseProgressExample,
};

export function LogisticsExamples({
  renderer = "svg",
}: {
  renderer?: "svg" | "canvas";
}) {
  const [scenario, setScenario] = useState<string | null>(null);
  return (
    <div className={styles.gallery}>
      {logisticsExamples.map((example) => (
        <Chart
          key={example.title}
          {...example}
          renderer={renderer}
          {...(example === priceResponseExample
            ? {
                onRowSelect: setScenario,
                notice: scenario
                  ? `Selected scenario: ${scenario}. ${example.notice}`
                  : example.notice,
              }
            : {})}
        />
      ))}
    </div>
  );
}
export const LogisticsIntelligence: Story = {
  render: () => <LogisticsExamples />,
};
