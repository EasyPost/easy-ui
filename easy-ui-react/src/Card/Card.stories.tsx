import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import AccountBalanceIcon from "@easypost/easy-ui-icons/AccountBalance";
import noop from "lodash/noop";
import React, { useState } from "react";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { InlineStoryDecorator, PlaceholderBox } from "../utilities/storybook";
import { Card, CardProps } from "./Card";
import { Icon } from "../Icon";

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

export const Outlined: Story = {
  render: Template.bind({}),
};

export const Solid: Story = {
  render: Template.bind({}),
  args: {
    variant: "solid",
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
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isSelected, setIsSelected] = useState(false);
    return (
      <Card as="label" variant="outlined" isSelected={isSelected} {...args}>
        <VerticalStack gap="2">
          <HorizontalStack gap="1" blockAlign="center">
            <input
              style={{ width: 24, height: 24 }}
              type="checkbox"
              checked={isSelected}
              disabled={args.isDisabled}
              onChange={(e) => {
                setIsSelected(e.target.checked);
              }}
            />
            <Text variant="subtitle1">I am a checkbox</Text>
          </HorizontalStack>
          <PlaceholderBox />
        </VerticalStack>
      </Card>
    );
  },
  args: {
    isDisabled: false,
  },
  parameters: {
    controls: {
      include: ["isDisabled"],
    },
  },
};

export const ExampleLink: Story = {
  render: () => (
    <Card as="a" href="https://easypost.com" target="_blank">
      <PlaceholderBox />
    </Card>
  ),
};

export const ExampleButton: Story = {
  render: () => (
    <Card as="button" onClick={action("Clicked card!")}>
      <PlaceholderBox />
    </Card>
  ),
};

export const ExampleTile: Story = {
  render: () => (
    <Card>
      <div style={{ padding: "8px 0" }}>
        <VerticalStack gap="1.5" inlineAlign="center">
          <Icon symbol={AccountBalanceIcon} size="xl" />
          <Text variant="subtitle2">Add a Bank Account</Text>
          <Text variant="caption">Free 2-3 Business Days For Transfers</Text>
        </VerticalStack>
      </div>
    </Card>
  ),
};

export const ExampleSlat: Story = {
  render: () => (
    <Card.Container>
      <HorizontalStack blockAlign="center">
        <Card.Area background="secondary">
          <Icon symbol={AccountBalanceIcon} size="lg" />
        </Card.Area>
        <Card.Area>
          <VerticalStack>
            <Text variant="subtitle2">Financial Account</Text>
            <Text variant="caption">
              Primary | Free 2-3 Business Days For Transfers
            </Text>
          </VerticalStack>
        </Card.Area>
      </HorizontalStack>
    </Card.Container>
  ),
};
