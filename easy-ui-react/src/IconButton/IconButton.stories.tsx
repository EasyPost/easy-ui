import AddIcon from "@easypost/easy-ui-icons/Add";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import DeleteIcon from "@easypost/easy-ui-icons/Delete";
import EditIcon from "@easypost/easy-ui-icons/Edit";
import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  InlineStoryDecorator,
  InlineStoryOnDarkBackgroundDecorator,
  createLabelledOptionsControl,
  getFilledButtonsColorMapping,
  getGhostButtonsColorMapping,
  getOutlinedButtonsColorMapping,
} from "../utilities/storybook";
import { Text } from "../Text";
import { IconButton, IconButtonProps } from "./IconButton";

type Story = StoryObj<typeof IconButton>;

const sharedIconButtonProps = {
  icon: ArrowBackIcon,
  accessibilityLabel: "Back",
};

const Template = (args: IconButtonProps) => <IconButton {...args} />;

const meta: Meta<typeof IconButton> = {
  title: "Components/Button/IconButton",
  argTypes: {
    icon: createLabelledOptionsControl({
      ArrowBack: ArrowBackIcon,
      Add: AddIcon,
    }),
  },
  component: IconButton,
};

export default meta;

export const Filled: Story = {
  render: Template.bind({}),
  args: {
    color: "primary",
    icon: ArrowBackIcon,
  },
};

Filled.argTypes = {
  color: getFilledButtonsColorMapping(),
};

export const Outlined: Story = {
  render: Template.bind({}),
  args: {
    variant: "outlined",
    color: "primary",
    icon: ArrowBackIcon,
  },
};

Outlined.argTypes = {
  color: getOutlinedButtonsColorMapping(),
};

export const Ghost: Story = {
  render: Template.bind({}),
  args: {
    variant: "ghost",
    color: "primary",
    icon: ArrowBackIcon,
  },
};

Ghost.argTypes = {
  color: getGhostButtonsColorMapping(),
};

export const GhostSizes: Story = {
  render: () => (
    <>
      <IconButton variant="ghost" color="support" {...sharedIconButtonProps} />
      <IconButton
        variant="ghost"
        color="support"
        size="sm"
        {...sharedIconButtonProps}
      />
      <IconButton
        variant="ghost"
        color="support"
        size="xs"
        {...sharedIconButtonProps}
      />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const GhostInline: Story = {
  render: () => (
    <>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <Text>API key disabled</Text>
        <IconButton
          variant="ghost"
          color="support"
          size="xs"
          icon={DeleteIcon}
          accessibilityLabel="Delete API key"
        />
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <Text>jane@example.com</Text>
        <IconButton
          variant="ghost"
          size="xs"
          icon={EditIcon}
          accessibilityLabel="Edit email"
        />
      </span>
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const Inverse: Story = {
  render: () => (
    <IconButton color="inverse" variant="outlined" {...sharedIconButtonProps} />
  ),
  decorators: [InlineStoryOnDarkBackgroundDecorator],
};

export const Small: Story = {
  render: () => <IconButton size="sm" {...sharedIconButtonProps} />,
  decorators: [InlineStoryDecorator],
};

export const Disabled: Story = {
  render: () => (
    <>
      <IconButton {...sharedIconButtonProps} isDisabled />
      <IconButton variant="outlined" {...sharedIconButtonProps} isDisabled />
      <IconButton variant="ghost" {...sharedIconButtonProps} isDisabled />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const ClickEvent: Story = {
  render: () => (
    <IconButton {...sharedIconButtonProps} onPress={action("clicked!")} />
  ),
  decorators: [InlineStoryDecorator],
};

export const Controls: Story = {
  render: Template.bind({}),
  args: {
    ...sharedIconButtonProps,
  },
};
