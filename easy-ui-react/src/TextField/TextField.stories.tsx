import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import {
  createLabelledOptionsControl,
  InputDecorator,
} from "../utilities/storybook";

import { TextField, TextFieldProps } from "./TextField";

type Story = StoryObj<typeof TextField>;

const Template = (args: TextFieldProps) => <TextField {...args} />;

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  parameters: {
    controls: {
      exclude: ["as", "rows"],
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
  decorators: [InputDecorator],
};

export const Password: Story = {
  render: Template.bind({}),
  args: {
    type: "password",
    label: "Password",
    placeholder: "Placeholder text",
    helperText: "Optional helper text",
  },
  decorators: [InputDecorator],
};

export const Icon: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Optional helper text",
    iconAtStart: SearchIcon,
  },
  decorators: [InputDecorator],
};

export const SmallTextFields: Story = {
  render: () => (
    <>
      <TextField
        size="sm"
        label="Label"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextField
        type="password"
        size="sm"
        label="Password"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextField
        size="sm"
        label="Label"
        placeholder="Placeholder text"
        iconAtStart={SearchIcon}
        helperText="Optional helper text"
      />
    </>
  ),
  decorators: [InputDecorator],
};

export const LargeTextFields: Story = {
  render: () => (
    <>
      <TextField
        size="lg"
        label="Label"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextField
        type="password"
        size="lg"
        label="Password"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextField
        size="lg"
        label="Label"
        placeholder="Placeholder text"
        iconAtStart={SearchIcon}
        helperText="Optional helper text"
      />
    </>
  ),
  decorators: [InputDecorator],
};

export const LabelWithEmphasis: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    emphasizedLabel: true,
    helperText: "Optional helper text",
  },
  decorators: [InputDecorator],
};

export const Error: Story = {
  render: Template.bind({}),
  args: {
    validationState: "invalid",
    label: "Label",
    errorText: "Optional error text",
  },
  decorators: [InputDecorator],
};

export const VisuallyHiddenLabel: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    isLabelVisuallyHidden: true,
  },
  decorators: [InputDecorator],
};

export const Controls: Story = {
  render: Template.bind({}),
  argTypes: {
    type: {
      options: ["text", "email", "password", "tel", "search"],
      control: { type: "radio" },
      description:
        "Sets the underlying HTML input type. Setting type to password adds a clickable and focusable right aligned visibility icon.",
    },
    iconAtStart: createLabelledOptionsControl({
      remove: undefined,
      Search: SearchIcon,
    }),
    iconAtEnd: createLabelledOptionsControl({
      remove: undefined,
      SearchIcon: SearchIcon,
    }),
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
    type: "text",
    size: "md",
    label: "Label",
    isLabelVisuallyHidden: false,
    isDisabled: false,
    isRequired: false,
    validationState: "valid",
    emphasizedLabel: false,
    autoFocus: false,
    errorText: "",
    helperText: "Optional helper text",
    placeholder: "Placeholder text",
  },
  decorators: [InputDecorator],
};
