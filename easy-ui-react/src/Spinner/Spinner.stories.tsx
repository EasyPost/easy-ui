import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { createColorTokensControl } from "../utilities/storybook";
import { Spinner, SpinnerProps } from "./Spinner";

type Story = StoryObj<typeof Spinner>;

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  args: {
    size: "md",
    color: "neutral.500",
  },
  argTypes: {
    color: {
      ...createColorTokensControl(),
      table: {
        type: { summary: null },
      },
    },
  },
};

const Template = (args: SpinnerProps) => {
  return <Spinner {...args} />;
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: { isIndeterminate: true, label: "Loading..." },
};

export const Size: Story = {
  render: Template.bind({}),
  args: {
    size: "xl",
    label: "Loading...",
    isIndeterminate: true,
  },
};

export const Indeterminate: Story = {
  render: Template.bind({}),
  args: { isIndeterminate: true },
};

export const Progress: Story = {
  render: Template.bind({}),
  args: { value: 75 },
};

export const Color: Story = {
  render: Template.bind({}),
  args: { label: "Loading...", color: "positive.500" },
};
