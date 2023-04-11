import AddIcon from "@easypost/easy-ui-icons/Add";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  InlineStoryDecorator,
  InlineStoryOnDarkBackgroundDecorator,
  createLabelledOptionsControl,
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

export const Controls: Story = {
  render: Template.bind({}),
  args: {
    ...sharedIconButtonProps,
  },
};

export const FilledButtons: Story = {
  render: () => (
    <>
      <IconButton {...sharedIconButtonProps} />
      <IconButton color="secondary" {...sharedIconButtonProps} />
      <IconButton color="success" {...sharedIconButtonProps} />
      <IconButton color="warning" {...sharedIconButtonProps} />
      <IconButton color="neutral" {...sharedIconButtonProps} />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const OutlinedButtons: Story = {
  render: () => (
    <>
      <IconButton variant="outlined" {...sharedIconButtonProps} />
      <IconButton
        color="secondary"
        variant="outlined"
        {...sharedIconButtonProps}
      />
      <IconButton
        color="support"
        variant="outlined"
        {...sharedIconButtonProps}
      />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const InverseButton: Story = {
  render: () => (
    <IconButton color="inverse" variant="outlined" {...sharedIconButtonProps} />
  ),
  decorators: [InlineStoryOnDarkBackgroundDecorator],
};

export const DisabledButtons: Story = {
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
