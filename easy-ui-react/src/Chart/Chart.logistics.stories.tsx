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
  excludeStories: ["LogisticsExamples", "OptionalGeography"],
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

export function OptionalGeography({
  renderer = "svg",
}: {
  renderer?: "svg" | "canvas";
}) {
  const [Maps, setMaps] = useState<React.ComponentType<{
    renderer?: "svg" | "canvas";
  }> | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const open = () => {
    setStatus("loading");
    import("./Chart.geography")
      .then((m) => setMaps(() => m.GeographicExamples))
      .catch(() => setStatus("error"));
  };
  return Maps ? (
    <Maps renderer={renderer} />
  ) : (
    <div className={styles.mapPrompt}>
      <p>
        Explore lane performance and parcel scan paths, including parcels from
        multiple warehouses.
      </p>
      <button onClick={open} disabled={status === "loading"}>
        {status === "loading"
          ? "Loading maps…"
          : status === "error"
            ? "Retry maps"
            : "Show logistics maps"}
      </button>
      {status === "error" && (
        <p role="alert">Unable to load maps. Try again.</p>
      )}
    </div>
  );
}
export const LaneAndParcelMaps: Story = { render: () => <OptionalGeography /> };
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
  render: () => (
    <>
      <LogisticsExamples />
      <OptionalGeography />
    </>
  ),
};
