import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useId, useState } from "react";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import CancelIcon from "@easypost/easy-ui-icons/Cancel";
import {
  SplitToggleCard,
  SplitToggleCardProps,
  useSplitToggleCardState,
} from "./SplitToggleCard";
import { Card } from "../Card";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
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
      exclude: ["onChange", "children"],
    },
  },
};

export default meta;

const Template = (args: SplitToggleCardProps) => (
  <SplitToggleCard {...args}>
    <SplitToggleCard.ToggleContainer>
      <SplitToggleCard.Toggle />
    </SplitToggleCard.ToggleContainer>
    <SplitToggleCard.ContentContainer>
      <VerticalStack gap="1">
        <SplitToggleCard.Title>Delivery Timelines</SplitToggleCard.Title>
        <Text variant="caption" color="primary.800">
          AI-based Delivery Timelines for each Shipping Option at Checkout for
          Shoppers.
        </Text>
      </VerticalStack>
    </SplitToggleCard.ContentContainer>
  </SplitToggleCard>
);

export const Standard: Story = {
  render: Template.bind({}),
};

export const Status: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false);
    return (
      <SplitToggleCard {...args} isSelected={selected} onChange={setSelected}>
        <SplitToggleCard.ToggleContainer>
          <SplitToggleCard.Toggle />
          <SplitToggleCard.Status on="Enrolled" off="Not enrolled" />
        </SplitToggleCard.ToggleContainer>
        <SplitToggleCard.ContentContainer>
          <VerticalStack gap="1">
            <SplitToggleCard.Title variant="subtitle1">
              Automatic Shipping Insurance
            </SplitToggleCard.Title>
            <Text variant="body2">
              Insure every eligible shipment when you buy the label.
            </Text>
          </VerticalStack>
        </SplitToggleCard.ContentContainer>
      </SplitToggleCard>
    );
  },
};

function EnrollmentStatus() {
  const { isSelected } = useSplitToggleCardState();
  return (
    <HorizontalStack gap="0.5" blockAlign="center" wrap={false}>
      <Icon
        symbol={isSelected ? CheckCircleIcon : CancelIcon}
        size="sm"
        color={isSelected ? "positive.600" : "neutral.500"}
      />
      <Text variant="caption" color={isSelected ? "positive.600" : "subdued"}>
        {isSelected ? "Enrolled" : "Not enrolled"}
      </Text>
    </HorizontalStack>
  );
}

export const CustomStatus: Story = {
  render: (args) => (
    <SplitToggleCard {...args} defaultSelected>
      <SplitToggleCard.ToggleContainer>
        <SplitToggleCard.Toggle variant="success" />
        <SplitToggleCard.Status>
          <EnrollmentStatus />
        </SplitToggleCard.Status>
      </SplitToggleCard.ToggleContainer>
      <SplitToggleCard.ContentContainer>
        <VerticalStack gap="1">
          <SplitToggleCard.Title variant="subtitle1">
            Automatic Shipping Insurance
          </SplitToggleCard.Title>
          <Text variant="body2">
            Insure every eligible shipment when you buy the label.
          </Text>
        </VerticalStack>
      </SplitToggleCard.ContentContainer>
    </SplitToggleCard>
  ),
};

export const Solid: Story = {
  render: (args) => (
    <Card>
      <VerticalStack gap="2">
        <Text variant="subtitle1">Insurance</Text>
        <SplitToggleCard {...args} variant="solid" defaultSelected>
          <SplitToggleCard.ToggleContainer>
            <SplitToggleCard.Toggle />
            <SplitToggleCard.Status on="Enrolled" off="Not enrolled" />
          </SplitToggleCard.ToggleContainer>
          <SplitToggleCard.ContentContainer>
            <VerticalStack gap="1">
              <SplitToggleCard.Title>
                Automatic Shipping Insurance
              </SplitToggleCard.Title>
              <Text variant="caption">
                Insure every eligible shipment when you buy the label.
              </Text>
            </VerticalStack>
          </SplitToggleCard.ContentContainer>
        </SplitToggleCard>
      </VerticalStack>
    </Card>
  ),
};

export const Shorthand: Story = {
  render: (args) => {
    const titleId = useId();
    return (
      <SplitToggleCard {...args} aria-labelledby={titleId}>
        <VerticalStack gap="1">
          <Text id={titleId} variant="subtitle2" color="primary.800">
            Delivery Timelines
          </Text>
          <Text variant="caption" color="primary.800">
            AI-based Delivery Timelines for each Shipping Option at Checkout for
            Shoppers.
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
