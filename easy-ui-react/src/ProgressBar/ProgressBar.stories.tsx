import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { createColorTokensControl } from "../utilities/storybook";
import { ProgressBar, ProgressBarProps } from "./ProgressBar";

type Story = StoryObj<typeof ProgressBar>;

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  args: {
    label: "Uploading manifest",
    value: 40,
  },
  argTypes: {
    color: {
      ...createColorTokensControl(),
      table: {
        type: { summary: "<See control for values>" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

const Template = (args: ProgressBarProps) => <ProgressBar {...args} />;

export const Simple: Story = {
  render: Template.bind({}),
};

export const WithValueLabel: Story = {
  render: Template.bind({}),
  args: {
    label: "Buying labels",
    value: 127,
    maxValue: 250,
    valueLabel: "127 of 250 labels",
  },
};

export const Colors: Story = {
  render: () => (
    <VerticalStack gap="2">
      <ProgressBar label="Default" value={40} />
      <ProgressBar label="Complete" value={100} color="positive.600" />
      <ProgressBar label="Nearly full" value={85} color="warning.600" />
      <ProgressBar label="Over quota" value={100} color="negative.600" />
    </VerticalStack>
  ),
};

export const NoVisibleLabel: Story = {
  render: Template.bind({}),
  args: {
    label: undefined,
    "aria-label": "Uploading manifest",
  },
};

function AnimatedProgressBar() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (value >= 100) {
      return;
    }
    const timeout = window.setTimeout(
      () => setValue((v) => Math.min(v + 10, 100)),
      600,
    );
    return () => window.clearTimeout(timeout);
  }, [value]);
  return (
    <VerticalStack gap="2" inlineAlign="start">
      <div style={{ alignSelf: "stretch" }}>
        <ProgressBar label="Importing orders" value={value} />
      </div>
      <Button variant="outlined" size="sm" onPress={() => setValue(0)}>
        Restart
      </Button>
    </VerticalStack>
  );
}

export const Animated: Story = {
  render: () => <AnimatedProgressBar />,
  parameters: {
    controls: { disable: true },
  },
};

export const InCard: Story = {
  render: () => (
    <Card>
      <VerticalStack gap="2">
        <HorizontalStack blockAlign="center" align="space-between" gap="1">
          <Text variant="subtitle1">Monthly label quota</Text>
          <Text variant="caption" color="neutral.600">
            Resets Oct 1
          </Text>
        </HorizontalStack>
        <ProgressBar
          aria-label="Monthly label quota"
          value={8420}
          maxValue={10000}
          valueLabel="8,420 of 10,000 labels"
          showValueLabel
          color="warning.600"
        />
      </VerticalStack>
    </Card>
  ),
  parameters: {
    controls: { disable: true },
  },
};
