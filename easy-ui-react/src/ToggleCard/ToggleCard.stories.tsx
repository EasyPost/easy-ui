import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Text } from "../Text";
import { Toggle } from "../Toggle";
import { Icon } from "../Icon";
import { ToggleCard, ToggleCardProps } from "./ToggleCard";
import {
  InlineStoryDecorator,
  PlaceholderBox,
  FedExLogoImg,
  EasyPostLogo,
} from "../utilities/storybook";

type Story = StoryObj<typeof ToggleCard>;

const Template = (args: ToggleCardProps) => {
  const { children } = args;

  return (
    <ToggleCard>
      {children}
      <ToggleCard.Body>
        <PlaceholderBox width={250} height={100} />
      </ToggleCard.Body>
    </ToggleCard>
  );
};

const meta: Meta<typeof ToggleCard> = {
  title: "Components/Cards/ToggleCard",
  component: ToggleCard,
  decorators: [InlineStoryDecorator],
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <ToggleCard.Header>
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
          <Toggle aria-labelledby="some id" />
        </ToggleCard.Header>
      </>
    ),
  },
};

export const DefaultSelected: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <ToggleCard.Header>
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
          <Toggle aria-labelledby="some id" defaultSelected />
        </ToggleCard.Header>
      </>
    ),
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <ToggleCard.Header>
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
          <Toggle aria-labelledby="some id" defaultSelected isDisabled />
        </ToggleCard.Header>
      </>
    ),
  },
};

export const ReadOnly: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <ToggleCard.Header>
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
          <Toggle aria-labelledby="some id" defaultSelected isReadOnly />
        </ToggleCard.Header>
      </>
    ),
  },
};

export const TogglePosition: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <ToggleCard.Header>
          <Toggle aria-labelledby="some id" defaultSelected />
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
        </ToggleCard.Header>
      </>
    ),
  },
};

export const Controlled: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(true);
    return (
      <ToggleCard>
        <ToggleCard.Header>
          <Toggle
            isSelected={isSelected}
            onChange={(isSelected) => setIsSelected(isSelected)}
          >
            <Text
              variant="button"
              color={isSelected ? "primary.500" : "primary.800"}
            >
              {isSelected ? "Enabled" : "Disabled"}
            </Text>
          </Toggle>
          <Icon size="sm" symbol={EasyPostLogo} />
        </ToggleCard.Header>
        <ToggleCard.Body>
          <PlaceholderBox
            width={300}
            height={150}
            style={{ background: "none" }}
          >
            <FedExLogoImg style={{ maxWidth: "150px" }} />
          </PlaceholderBox>
        </ToggleCard.Body>
      </ToggleCard>
    );
  },
};
