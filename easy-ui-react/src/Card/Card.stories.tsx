import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HorizontalGrid } from "../HorizontalGrid";
import { InlineStoryDecorator, PlaceholderBox } from "../utilities/storybook";
import { Card, CardProps } from "./Card";

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

export const Split: Story = {
  render: () => (
    <Card.Container variant="outlined">
      <HorizontalGrid columns={2}>
        <Card.Area background="primary">
          <PlaceholderBox width="auto" />
        </Card.Area>
        <Card.Area background="secondary">
          <PlaceholderBox width="auto" />
        </Card.Area>
      </HorizontalGrid>
    </Card.Container>
  ),
};
