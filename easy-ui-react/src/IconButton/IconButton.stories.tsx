import AddIcon from "@easypost/easy-ui-icons/Add";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  InlineStoryDecorator,
  InlineStoryOnDarkBackgroundDecorator,
  createLabelledOptionsControl,
  getFilledButtonsColorMapping,
  getOutlinedButtonsColorMapping,
} from "../utilities/storybook";
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
