import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Checkbox, CheckboxProps } from "./Checkbox";

type Story = StoryObj<typeof Checkbox>;

const Template = (args: CheckboxProps) => <Checkbox {...args} />;

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    children: <>Checkbox item</>,
  },
};
