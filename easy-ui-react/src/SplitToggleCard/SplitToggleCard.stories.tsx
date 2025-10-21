import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState, useId } from "react";
import { SplitToggleCard, SplitToggleCardProps } from "./SplitToggleCard";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";

type Story = StoryObj<typeof SplitToggleCard>;

const meta: Meta<typeof SplitToggleCard> = {
  title: "Components/Cards/SplitToggleCard",
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
  const id = useId();
  const status =
    args.isSelected || args.defaultSelected ? "Enabled" : "Disabled";
  return (
    <SplitToggleCard {...args} aria-labelledby={id}>
      <VerticalStack gap="1">
        <Text id={id} variant="subtitle2" color="primary.800">
          Toggle Label
        </Text>
        <Text variant="caption">
          <Text
            color={
              args.isSelected || args.defaultSelected
                ? "positive.600"
                : "negative.600"
            }
          >
            {status}
          </Text>
          <Text color="primary.800">
            : AI-based Delivery Timelines for each Shipping Option at Checkout
            for Shoppers.
          </Text>
        </Text>
      </VerticalStack>
    </SplitToggleCard>
  );
};

export default meta;

export const Standard: Story = {
  render: () => {
    const id = useId();
    const [selected, setSelected] = useState(false);
    const status = selected ? "Enabled" : "Disabled";
    return (
      <SplitToggleCard
        isSelected={selected}
        onChange={setSelected}
        aria-labelledby={id}
      >
        <VerticalStack gap="1">
          <Text id={id} variant="subtitle2" color="primary.800">
            Toggle Label
          </Text>
          <Text variant="caption">
            <Text color={selected ? "positive.600" : "negative.600"}>
              {status}
            </Text>
            <Text color="primary.800">
              : AI-based Delivery Timelines for each Shipping Option at Checkout
              for Shoppers.
            </Text>
          </Text>
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
