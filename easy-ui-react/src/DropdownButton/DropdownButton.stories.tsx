import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  InlineStoryDecorator,
  InlineStoryOnDarkBackgroundDecorator,
  getFilledButtonsColorMapping,
  getOutlinedButtonsColorMapping,
} from "../utilities/storybook";
import { DropdownButton, DropdownButtonProps } from "./DropdownButton";

type Story = StoryObj<typeof DropdownButton>;

const Template = (args: DropdownButtonProps) => <DropdownButton {...args} />;

const meta: Meta<typeof DropdownButton> = {
  title: "Components/Button/DropdownButton",
  argTypes: {
    children: {
      control: "text",
    },
  },
  component: DropdownButton,
};

export default meta;

export const Filled: Story = {
  render: Template.bind({}),
  args: {
    color: "primary",
  },
};

Filled.argTypes = {
  color: getFilledButtonsColorMapping(),
};

export const Outlined: Story = {
  render: Template.bind({}),
  args: {
    color: "primary",
    variant: "outlined",
  },
};

Outlined.argTypes = {
  color: getOutlinedButtonsColorMapping(),
};

export const Inverse: Story = {
  render: () => <DropdownButton color="inverse" variant="outlined" />,
  decorators: [InlineStoryOnDarkBackgroundDecorator],
};

export const Disabled: Story = {
  render: () => (
    <>
      <DropdownButton isDisabled />
      <DropdownButton variant="outlined" isDisabled />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const ClickEvent: Story = {
  render: () => <DropdownButton onPress={action("clicked!")} />,
  decorators: [InlineStoryDecorator],
};

export const Controls: Story = {
  render: Template.bind({}),
  args: {},
};
