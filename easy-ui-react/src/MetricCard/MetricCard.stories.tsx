import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { HorizontalGrid } from "../HorizontalGrid";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { MetricCard } from "./MetricCard";

const meta: Meta<typeof MetricCard> = {
  title: "Components/MetricCard",
  component: MetricCard,
};
export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    label: "Average rated cost",
    value: "$5.20",
    supportingText: "June 1–30 · USD",
    comparison: {
      label: "4.2% lower",
      baseline: "vs previous 30 days",
      sentiment: "positive",
    },
    trend: {
      values: [5.8, 5.6, 5.7, 5.5, 5.4, 5.2],
      accessibilityLabel:
        "Six equal time buckets in June: average rated cost fell from $5.80 to $5.20",
    },
  },
};

export const ShippingOverview: Story = {
  render: () => (
    <VerticalStack gap="3">
      <Text as="h2" variant="heading4">
        Shipping overview
      </Text>
      <Text color="neutral.600">
        Illustrative data · June 1–30 · Comparisons use the previous 30 days
      </Text>
      <HorizontalGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap="2">
        <MetricCard
          label="Labels purchased"
          value="24,810"
          supportingText="June 1–30"
          comparison={{ label: "8.3% higher", baseline: "vs previous 30 days" }}
          trend={{
            values: [680, 750, 720, 810, 790, 900, 950],
            accessibilityLabel:
              "Sample daily label volume generally rose from 680 to 950",
          }}
        />
        <MetricCard
          {...Default.args}
          label="Average rated cost"
          value="$5.20"
        />
        <MetricCard
          label="On-time delivery"
          value="97.8%"
          supportingText="Delivered parcels with an estimate"
          comparison={{
            label: "1.2 pp higher",
            baseline: "vs previous 30 days",
            sentiment: "positive",
          }}
          trend={{
            values: [95.8, 96.2, 96, 96.9, 97.1, 97.6, 97.8],
            accessibilityLabel:
              "Sample daily on-time percentage rose from 95.8% to 97.8%",
          }}
        />
        <MetricCard
          label="Average transit"
          value="2.4 days"
          supportingText="Delivered parcels · calendar days"
          comparison={{
            label: "0.2 days lower",
            baseline: "vs previous 30 days",
            sentiment: "positive",
          }}
          trend={{
            values: [2.8, 2.7, 2.9, 2.6, 2.7, 2.5, 2.4],
            accessibilityLabel:
              "Sample daily average transit time fell from 2.8 to 2.4 days",
          }}
        />
      </HorizontalGrid>
    </VerticalStack>
  ),
};

export const Loading: Story = {
  ...Default,
  args: { ...Default.args, isLoading: true },
};
export const NoData: Story = {
  ...Default,
  args: { ...Default.args, value: null },
};
export const Zero: Story = {
  args: { label: "Delivery exceptions", value: "0" },
};
export const MissingObservations: Story = {
  ...Default,
  args: {
    ...Default.args,
    trend: {
      values: [5.8, 5.6, null, 5.5, 5.4, 5.2],
      accessibilityLabel:
        "Average rated cost declined; the third time bucket is unavailable",
    },
  },
};
