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
};

export default meta;

export const Basic: Story = {
  render: Template.bind({}),
  args: {
    variant: "solid",
  },
};

export const Complex: Story = {
  render: (args: CardProps) => (
    <Card.Container {...args}>
      <HorizontalGrid columns={2}>
        <Card.Area background="primary">
          <Placeholder width="auto" />
        </Card.Area>
        <Card.Area background="subdued">
          <Placeholder width="auto" />
        </Card.Area>
      </HorizontalGrid>
    </Card.Container>
  ),
  args: {
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
