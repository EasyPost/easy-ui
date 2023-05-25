import tokens from "@easypost/easy-ui-tokens/js/tokens";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { InlineStoryDecorator } from "../utilities/storybook";
import { Card, CardProps } from "./Card";

type Story = StoryObj<typeof Card>;

const Template = (args: CardProps<"div">) => (
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
  render: (args: CardProps<"div">) => (
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

export const Checkbox: Story = {
  render: (args: CardProps<"label">) => {
    return (
      <Card as="label" variant="outlined" {...args}>
        <VerticalStack gap="2">
          <HorizontalStack gap="1" blockAlign="center">
            <input
              type="checkbox"
              style={{ width: 24, height: 24 }}
              checked={args.isSelected}
              disabled={args.isDisabled}
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
