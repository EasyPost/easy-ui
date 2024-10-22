import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { SplitToggleCard, SplitToggleCardProps } from "./SplitToggleCard";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";

type Story = StoryObj<typeof SplitToggleCard>;

const meta: Meta<typeof SplitToggleCard> = {
  title: "Components/SplitToggleCard",
  component: SplitToggleCard,
  args: {
    isDisabled: false,
    isReadOnly: false,
  },
  parameters: {
    controls: {
      exclude: ["onChange"],
    },
  },
};

const Template = (args: SplitToggleCardProps) => {
  const status =
    args.isSelected || args.defaultSelected ? "Enabled" : "Disabled";
  return (
    <SplitToggleCard {...args}>
      <VerticalStack gap="1">
        <Text variant="subtitle2" color="primary.800">
          Toggle Label
        </Text>
        <div>
          <Text
            variant="caption"
            color={
              args.isSelected || args.defaultSelected
                ? "positive.600"
                : "negative.600"
            }
          >
            {status}
          </Text>
          <Text variant="caption" color="primary.800">
            : AI-based Delivery Timelines for each Shipping Option at Checkout
            for Shoppers.
          </Text>
        </div>
      </VerticalStack>
    </SplitToggleCard>
  );
};

export default meta;

export const Standard: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);
    const status = selected ? "Enabled" : "Disabled";
    return (
      <SplitToggleCard isSelected={selected} onChange={setSelected}>
        <VerticalStack gap="1">
          <Text variant="subtitle2" color="primary.800">
            Toggle Label
          </Text>
          <div>
            <Text
              variant="caption"
              color={selected ? "positive.600" : "negative.600"}
            >
              {status}
            </Text>
            <Text variant="caption" color="primary.800">
              : AI-based Delivery Timelines for each Shipping Option at Checkout
              for Shoppers.
            </Text>
          </div>
        </VerticalStack>
      </SplitToggleCard>
    );
  },
};

export const DefaultSelected: Story = {
  render: Template.bind({}),
  args: { defaultSelected: true },
};

export const Selected: Story = {
  render: Template.bind({}),
  args: { isSelected: true },
};

export const ReadOnly: Story = {
  render: Template.bind({}),
  args: { isReadOnly: true, isSelected: true },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: { isDisabled: true },
};
