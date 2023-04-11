import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  InlineStoryDecorator,
  InlineStoryOnDarkBackgroundDecorator,
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

export const Controls: Story = {
  render: Template.bind({}),
  args: {},
};

export const FilledButtons: Story = {
  render: () => (
    <>
      <DropdownButton />
      <DropdownButton color="secondary" />
      <DropdownButton color="success" />
      <DropdownButton color="warning" />
      <DropdownButton color="neutral" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const OutlinedButtons: Story = {
  render: () => (
    <>
      <DropdownButton variant="outlined" />
      <DropdownButton color="secondary" variant="outlined" />
      <DropdownButton color="support" variant="outlined" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const InverseButtons: Story = {
  render: () => <DropdownButton color="inverse" variant="outlined" />,
  decorators: [InlineStoryOnDarkBackgroundDecorator],
};

export const DisabledButtons: Story = {
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
