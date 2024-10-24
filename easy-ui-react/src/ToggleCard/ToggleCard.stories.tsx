import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { ToggleCard, ToggleCardProps } from "./ToggleCard";
import {
  InlineStoryDecorator,
  PlaceholderBox,
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
        <ToggleCard.Header aria-labelledby="some id">
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
        </ToggleCard.Header>
      </>
    ),
  },
};

export const Selected: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <ToggleCard.Header aria-labelledby="some id" defaultSelected>
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
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
        <ToggleCard.Header aria-labelledby="some id" defaultSelected isDisabled>
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
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
        <ToggleCard.Header aria-labelledby="some id" defaultSelected isReadOnly>
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
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
        <ToggleCard.Header
          aria-labelledby="some id"
          defaultSelected
          togglePosition="start"
        >
          <Text id="some id" variant="subtitle1" color="primary.900">
            Header
          </Text>
        </ToggleCard.Header>
      </>
    ),
  },
};

export const ToggleChildren: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <ToggleCard.Header defaultSelected toggleChildren={<Text>Toggle</Text>}>
          <Icon size="sm" symbol={EasyPostLogo} />
        </ToggleCard.Header>
      </>
    ),
  },
};
