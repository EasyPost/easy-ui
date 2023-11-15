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
  parameters: {
    controls: {
      exclude: ["size", "isMultiline"],
    },
  },
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
    isLabelEmphasized: true,
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
    "aria-label": "Label",
  },
};

export const Controls: Story = {
  render: Template.bind({}),
  argTypes: {
    isDisabled: {
      control: "boolean",
      description: "Whether the input is disabled.",
    },
    isRequired: {
      control: "boolean",
      description:
        "Whether user input is required on the input before form submission.",
    },
    errorText: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    validationState: {
      options: ["valid", "invalid"],
      control: { type: "radio" },
      description:
        "Whether the input should display its 'valid' or 'invalid' visual styling.",
    },
    autoFocus: {
      control: "boolean",
      description: "Whether the element should receive focus on render.",
    },
    label: {
      control: "text",
      description: "The content to display as the label.",
    },
    placeholder: {
      control: "text",
      description:
        "Temporary text that occupies the text input when it is empty.",
    },
    value: {
      control: "text",
      description: "The current value (controlled).",
    },
  },
  args: {
    size: "md",
    label: "Label",
    isDisabled: false,
    isRequired: false,
    validationState: "valid",
    isLabelEmphasized: false,
    autoFocus: false,
    errorText: "",
    helperText: "Optional helper text",
    placeholder: "Placeholder text",
  },
};
