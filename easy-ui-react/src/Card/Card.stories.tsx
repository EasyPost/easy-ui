import { Meta, StoryObj } from "@storybook/react";
import noop from "lodash/noop";
import React from "react";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";
import { VerticalStack } from "../VerticalStack";
import { InlineStoryDecorator, PlaceholderBox } from "../utilities/storybook";
import { Card, CardProps } from "./Card";
import { Text } from "../Text";

type Story = StoryObj<typeof Card>;

const Template = (args: CardProps) => (
  <Card {...args}>
    <PlaceholderBox />
  </Card>
);

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  decorators: [InlineStoryDecorator],
  parameters: {
    controls: {
      include: ["background"],
    },
  },
};

export default meta;

export const Solid: Story = {
  render: Template.bind({}),
};

export const Outlined: Story = {
  render: Template.bind({}),
  args: {
    variant: "outlined",
  },
};

export const Flagged: Story = {
  render: Template.bind({}),
  args: {
    status: "danger",
    variant: "flagged",
  },
  parameters: {
    controls: {
      include: ["background", "status"],
    },
  },
};

export const Composition: Story = {
  render: () => (
    <Card.Container variant="outlined">
      <HorizontalGrid columns={2}>
        <Card.Area background="primary">
          <PlaceholderBox width={170} />
        </Card.Area>
        <Card.Area background="secondary">
          <PlaceholderBox width={170} />
        </Card.Area>
      </HorizontalGrid>
    </Card.Container>
  ),
};

export const ExampleCheckbox: Story = {
  render: (args) => (
    <Card as="label" variant="outlined" {...args}>
      <VerticalStack gap="2">
        <HorizontalStack gap="1" blockAlign="center">
          <input
            style={{ width: 24, height: 24 }}
            type="checkbox"
            checked={args.isSelected}
            disabled={args.isDisabled}
            onChange={noop}
          />
          <Text variant="subtitle1">I am a checkbox</Text>
        </HorizontalStack>
        <PlaceholderBox />
      </VerticalStack>
    </Card>
  ),
  args: {
    isSelected: false,
    isDisabled: false,
  },
  parameters: {
    controls: {
      include: ["isSelected", "isDisabled"],
    },
  },
};
