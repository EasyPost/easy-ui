import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Toggle, ToggleProps } from "./Toggle";

type Story = StoryObj<typeof Toggle>;

const Template = (args: ToggleProps) => <Toggle {...args} />;

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
};

export default meta;

export const SimpleText: Story = {
  render: Template.bind({}),
};
