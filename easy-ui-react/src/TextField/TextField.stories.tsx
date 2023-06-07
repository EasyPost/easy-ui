import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import { InputDecorator } from "../utilities/storybook";

import { TextField, TextFieldProps } from "./TextField";

type Story = StoryObj<typeof TextField>;

const Template = (args: TextFieldProps) => <TextField {...args} />;

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
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

export const Password: Story = {
  render: Template.bind({}),
  args: {
    type: "password",
    label: "Password",
    placeholder: "Placeholder text",
    helperText: "Optional helper text",
  },
};

export const Icon: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Optional helper text",
    iconAtStart: SearchIcon,
  },
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
