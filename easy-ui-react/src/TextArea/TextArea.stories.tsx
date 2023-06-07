import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { InputDecorator } from "../utilities/storybook";
import { Textarea, TextareaProps } from "./Textarea";

type Story = StoryObj<typeof Textarea>;

const Template = (args: TextareaProps) => <Textarea {...args} />;

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  decorators: [InputDecorator],
};

export default meta;

export const Standard: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Optional helper text",
  },
};

export const CustomRowHeight: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Optional helper text",
    rows: 3,
  },
};

export const LargeTextarea: Story = {
  render: Template.bind({}),
  args: {
    size: "lg",
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Optional helper text",
  },
};

export const LabelWithEmphasis: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    emphasizedLabel: true,
    helperText: "Optional helper text",
  },
};

export const Error: Story = {
  render: Template.bind({}),
  args: {
    validationState: "invalid",
    label: "Label",
    errorText: "Optional error text",
  },
};

export const VisuallyHiddenLabel: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    isLabelVisuallyHidden: true,
  },
};
