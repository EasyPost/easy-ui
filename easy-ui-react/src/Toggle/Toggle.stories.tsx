import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { createLabelledOptionsControl } from "../utilities/storybook";
import { VerticalStack } from "../VerticalStack";
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
    variant: "primary",
  },
  argTypes: {
    children: {
      control: "text",
    },
    variant: createLabelledOptionsControl({
      primary: "primary",
      success: "success",
      danger: "danger",
    }),
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

export const Variants: Story = {
  render: (args) => (
    <VerticalStack gap="2">
      <Toggle {...args} variant="primary">
        Primary variant
      </Toggle>
      <Toggle {...args} variant="success">
        Success variant
      </Toggle>
      <Toggle {...args} variant="danger">
        Danger variant
      </Toggle>
    </VerticalStack>
  ),
  args: {
    isSelected: true,
  },
  parameters: {
    controls: {
      include: ["isSelected", "isDisabled"],
    },
  },
};
