import tokens from "@easypost/easy-ui-tokens/js/tokens";
import { Meta, StoryObj } from "@storybook/react";
import noop from "lodash/noop";
import React from "react";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { InlineStoryDecorator } from "../utilities/storybook";
import { Card, CardProps } from "./Card";

type Story = StoryObj<typeof Card>;

const Template = (args: CardProps) => (
  <Card {...args}>
    <Placeholder />
  </Card>
);

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  decorators: [InlineStoryDecorator],
  argTypes: {
    status: {
      options: ["danger", "warning", "success"],
      control: { type: "radio" },
    },
  },
  parameters: {
    controls: {
      include: ["background"],
    },
  },
};

export default meta;

export const Solid: Story = {
  render: Template.bind({}),
  args: {
    variant: "solid",
  },
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

export const Split: Story = {
  render: (args: CardProps) => (
    <Card.Container {...args}>
      <HorizontalGrid columns={2}>
        <Card.Area background="primary">
          <Placeholder width="auto" />
        </Card.Area>
        <Card.Area background="secondary">
          <Placeholder width="auto" />
        </Card.Area>
      </HorizontalGrid>
    </Card.Container>
  ),
  args: {
    status: "danger",
    variant: "outlined",
  },
  parameters: {
    controls: {
      include: ["variant"],
    },
  },
};

export const Checkbox: Story = {
  render: (args: CardProps) => {
    return (
      <Card as="label" {...args} variant="outlined">
        <VerticalStack gap="2">
          <HorizontalStack gap="1" blockAlign="center">
            <input
              type="checkbox"
              style={{ width: 24, height: 24 }}
              checked={args.isSelected}
              disabled={args.isDisabled}
              onChange={noop}
            />
            <Text variant="subtitle1">Here is a checkbox description</Text>
          </HorizontalStack>
          <Placeholder />
        </VerticalStack>
      </Card>
    );
  },
  args: {
    isDisabled: false,
    isSelected: false,
  },
  parameters: {
    controls: {
      include: ["isDisabled", "isSelected"],
    },
  },
};

export const Link: Story = {
  render: (args: CardProps) => {
    return (
      <Card {...args} as="a" href="https://easypost.com" target="_blank">
        <Placeholder />
      </Card>
    );
  },
  args: {
    status: "danger",
    variant: "outlined",
  },
  parameters: {
    controls: {
      include: ["background", "variant"],
    },
  },
};

const Placeholder = ({ width = 378 }: { width?: number | string }) => (
  <div
    style={{
      height: 224,
      width,
      alignItems: "center",
      background: tokens["color.gray.100"],
      borderRadius: 4,
      display: "flex",
      padding: 12,
      justifyContent: "center",
    }}
  >
    Space for Content
  </div>
);
