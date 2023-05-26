import { Meta, StoryObj } from "@storybook/react";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import React from "react";

import { TextField, TextFieldProps } from "./TextField";

type Story = StoryObj<typeof TextField>;

const Template = (args: TextFieldProps) => <TextField {...args} />;

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  argTypes: {},
  component: TextField,
};

export default meta;

export const Controls: Story = {
  render: Template.bind({}),
  args: {
    type: "text",
    label: "label",
    validationState: "valid",
    helperText: "Optional helper text",
    errorText: "Optional error text",
    iconAtEnd: SearchIcon,
  },
};
