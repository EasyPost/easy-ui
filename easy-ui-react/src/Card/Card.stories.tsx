import tokens from "@easypost/easy-ui-tokens/js/tokens";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HorizontalGrid } from "../HorizontalGrid";
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
    background: {
      options: ["primary", "secondary"],
      control: { type: "radio" },
    },
    status: {
      options: ["danger", "warning", "success"],
      control: { type: "radio" },
    },
    variant: {
      options: ["solid", "outlined", "flagged"],
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
