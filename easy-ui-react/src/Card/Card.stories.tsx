import AccountBalanceIcon from "@easypost/easy-ui-icons/AccountBalance";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import {
  createColorTokensControl,
  createShadowTokensControl,
  createBorderRadiusTokensControl,
  InlineStoryDecorator,
  PlaceholderBox,
} from "../utilities/storybook";
import { Card, CardProps } from "./Card";

type Story = StoryObj<typeof Card>;

const Template = (args: CardProps) => (
  <Card {...args}>
    <PlaceholderBox />
  </Card>
);

const meta: Meta<typeof Card> = {
  title: "Components/Cards/Card",
  component: Card,
  decorators: [InlineStoryDecorator],
  argTypes: {
    background: createColorTokensControl(),
    boxShadow: createShadowTokensControl(),
    borderRadius: createBorderRadiusTokensControl(),
  },
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

export const Shadow: Story = {
  render: Template.bind({}),
  args: {
    variant: "solid",
    boxShadow: "1",
  },
  parameters: {
    controls: {
      include: ["variant", "status", "boxShadow"],
    },
  },
};

export const BorderRadius: Story = {
  render: Template.bind({}),
  args: {
    variant: "outlined",
    borderRadius: "md",
  },
  parameters: {
    controls: {
      include: ["variant", "status", "borderRadius"],
    },
  },
};

export const Padding: Story = {
  render: () => (
    <Card.Container variant="outlined">
      <Card.Area
        background="primary.800"
        padding={{ xs: "2", sm: "3", md: "4", lg: "5" }}
      >
        <PlaceholderBox width={250} />
      </Card.Area>
    </Card.Container>
  ),
};

export const PaddingXAndPaddingY: Story = {
  render: () => (
    <Card.Container variant="outlined">
      <Card.Area
        background="primary.800"
        paddingX="1"
        paddingY={{ xs: "2", sm: "3", md: "4", lg: "5" }}
      >
        <PlaceholderBox width={250} />
      </Card.Area>
    </Card.Container>
  ),
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
          <HorizontalStack gap="1.5" blockAlign="center">
            <input
              style={{ margin: 0, width: 24, height: 24 }}
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

export const ExampleRadio: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isSelected, setIsSelected] = useState(false);
    return (
      <div style={{ maxWidth: 400, width: "100%" }}>
        <Card variant="outlined" isSelected={isSelected} {...args}>
          <VerticalStack gap="1.5">
            <HorizontalStack align="space-between" blockAlign="center">
              <HorizontalStack as="label" gap="1" blockAlign="center">
                <input
                  style={{ margin: 0, width: 16, height: 16 }}
                  type="radio"
                  checked={isSelected}
                  disabled={args.isDisabled}
                  onChange={(e) => {
                    setIsSelected(e.target.checked);
                  }}
                />
                <Text variant="subtitle1">Bank Account</Text>
              </HorizontalStack>
              <Text variant="caption" color="primary.500">
                Manage
              </Text>
            </HorizontalStack>
            <VerticalStack>
              <Text variant="caption" color="neutral.600">
                Bank Arc Transfer Primary
                <br />
                Free 2-3 Business Days For Transfers
              </Text>
            </VerticalStack>
          </VerticalStack>
        </Card>
      </div>
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

export const ExampleTileA: Story = {
  render: () => (
    <div style={{ maxWidth: 310, width: "100%" }}>
      <Card>
        <div style={{ padding: "8px 0" }}>
          <VerticalStack gap="1.5" inlineAlign="center">
            <Icon symbol={AccountBalanceIcon} size="3xl" />
            <Text variant="subtitle2">Add a Bank Account</Text>
            <Text variant="caption" color="neutral.600">
              Free 2-3 Business Days For Transfers
            </Text>
          </VerticalStack>
        </div>
      </Card>
    </div>
  ),
};

export const ExampleTileB: Story = {
  render: () => (
    <div style={{ maxWidth: 460, width: "100%" }}>
      <Card>
        <div style={{ padding: "40px 0" }}>
          <VerticalStack gap="2" inlineAlign="center">
            <VerticalStack gap="1">
              <Text variant="subtitle1">No Subscriptions</Text>
              <Text variant="caption" color="neutral.600" alignment="center">
                Sending over 120k packages a year?
                <br />
                Learn how EasyPost can optimize your shipping.
              </Text>
            </VerticalStack>
            <Text variant="small_button" color="primary.500">
              Contact Sales
            </Text>
          </VerticalStack>
        </div>
      </Card>
    </div>
  ),
};

export const ExampleTileC: Story = {
  render: () => (
    <div style={{ maxWidth: 400, width: "100%" }}>
      <Card>
        <div style={{ padding: "12px 0" }}>
          <VerticalStack gap="0.5" inlineAlign="center">
            <Text variant="caption" color="neutral.600" alignment="center">
              No secondary account
            </Text>
            <Text variant="small_button" color="primary.500">
              Add an Account
            </Text>
          </VerticalStack>
        </div>
      </Card>
    </div>
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

export const ExampleCallout: Story = {
  render: () => (
    <div style={{ maxWidth: 458, width: "100%" }}>
      <Card variant="flagged" status="warning" padding="1">
        <Text variant="subtitle1">
          Based on selected auto-fund settings, you requested a minimum wallet
          balance of $400. <Text color="primary.500">Learn More</Text>
        </Text>
      </Card>
    </div>
  ),
};

export const ExampleStretch: Story = {
  render: () => (
    <HorizontalGrid columns={2} gap="2">
      <Card background="secondary">
        <VerticalStack gap="2" align="space-between">
          <div>Short content</div>
          <div>Card footer</div>
        </VerticalStack>
      </Card>
      <Card>
        <VerticalStack gap="2" align="space-between">
          <div>
            Long content that stretches the height of the grid row to show that
            the footer in the first card will stay aligned to the bottom
          </div>
          <div>Card footer</div>
        </VerticalStack>
      </Card>
    </HorizontalGrid>
  ),
};
