import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { VerticalStack } from "../VerticalStack";
import { Checkbox, CheckboxProps } from "./Checkbox";

type Story = StoryObj<typeof Checkbox>;

const Template = (args: CheckboxProps) => <Checkbox {...args} />;

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    children: "Checkbox item",
    isDisabled: false,
    isReadOnly: false,
    isIndeterminate: false,
  },
  argTypes: {
    children: {
      control: "text",
    },
    errorText: {
      control: "text",
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

export const Indeterminate: Story = {
  render: Template.bind({}),
  args: {
    isIndeterminate: true,
  },
};

export const Error: Story = {
  render: Template.bind({}),
  args: {
    children: "Error item",
    validationState: "invalid",
    errorText: "This field is required",
  },
};

export const Nested: Story = {
  render: (args) => (
    <VerticalStack gap="1">
      <Checkbox {...args} />
      <div style={{ marginLeft: 24 }}>
        <VerticalStack gap="1">
          <Checkbox {...args} isNested />
          <div style={{ marginLeft: 24 }}>
            <VerticalStack gap="1">
              <Checkbox {...args} isNested />
              <Checkbox {...args} isNested />
            </VerticalStack>
          </div>
          <Checkbox {...args} isNested />
        </VerticalStack>
      </div>
    </VerticalStack>
  ),
};

export const Multiline: Story = {
  render: (args) => (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 200,
        gap: 48,
      }}
    >
      <Checkbox {...args} />
      <Checkbox {...args} isNested />
    </span>
  ),
  args: {
    children:
      "Multi line option for mobile use. Note how the box is at the top not centered",
  },
};
