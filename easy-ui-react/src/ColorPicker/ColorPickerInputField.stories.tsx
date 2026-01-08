import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  ColorPickerInputField,
  ColorPickerInputFieldProps,
} from "./ColorPickerInputField";

type Story = StoryObj<typeof ColorPickerInputField>;

const Template = (props: ColorPickerInputFieldProps) => {
  return <ColorPickerInputField {...props} />;
};

const meta: Meta<typeof ColorPickerInputField> = {
  title: "Components/ColorPicker/ColorPickerInputField",
  component: ColorPickerInputField,
  args: {},
  parameters: {
    controls: {
      exclude: ["children"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
    label: <>Primary color</>,
    helperText: "Select a primary color",
  },
};

export const Small: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
    label: <>Primary color</>,
    helperText: "Select a primary color",
    size: "sm",
  },
};

export const Large: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
    label: <>Primary color</>,
    helperText: "Select a primary color",
    size: "lg",
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
    label: <>Primary color</>,
    helperText: "Select a primary color",
    isDisabled: true,
  },
};

export const ReadOnly: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
    label: <>Primary color</>,
    helperText: "Select a primary color",
    isReadOnly: true,
  },
};

export const Error: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
    label: <>Primary color</>,
    validationState: "invalid",
    errorText: "Invalid color",
  },
};

export const EmphasizedLabel: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
    label: <>Primary color</>,
    isLabelEmphasized: true,
  },
};

export const VisuallyHiddenLabel: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
    "aria-label": "Pick a color",
  },
};
