import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import { createLabelledOptionsControl } from "../utilities/storybook";

import { TextField, TextFieldProps } from "./TextField";

type Story = StoryObj<typeof TextField>;

const Template = (args: TextFieldProps) => <TextField {...args} />;

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  argTypes: {
    iconAtStart: createLabelledOptionsControl({
      remove: undefined,
      Search: SearchIcon,
    }),
    iconAtEnd: createLabelledOptionsControl({
      remove: undefined,
      SearchIcon: SearchIcon,
    }),
  },
};

export default meta;

export const Controls: Story = {
  render: Template.bind({}),
};
