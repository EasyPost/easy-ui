import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Toggle, ToggleProps } from "./Toggle";

type Story = StoryObj<typeof Toggle>;

const Template = (args: ToggleProps) => <Toggle {...args} />;

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  args: {
    children: "Toggle item",
    isDisabled: false,
    isReadOnly: false,
  },
  argTypes: {
    children: {
      control: "text",
    },
  },
  parameters: {
    controls: {
      exclude: ["onChange"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const Selected: Story = {
  render: Template.bind({}),
  args: {
    isSelected: true,
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
  },
};

export const Standalone: Story = {
  render: Template.bind({}),
  args: {
    children: undefined,
    "aria-label": "Toggle item",
  },
};
