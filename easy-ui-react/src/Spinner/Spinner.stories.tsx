import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  createColorTokensControl,
  getDesignTokensControl,
} from "../utilities/storybook";
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
        type: { summary: "<See control for values>" },
      },
    },
    size: {
      ...getDesignTokensControl("size.icon.{alias}"),
      table: {
        type: { summary: "<See control for values>" },
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
  args: { isIndeterminate: true, children: "Loading..." },
};

export const Size: Story = {
  render: Template.bind({}),
  args: {
    size: "xl",
    children: "Loading...",
    isIndeterminate: true,
  },
};

export const Indeterminate: Story = {
  render: Template.bind({}),
  args: { isIndeterminate: true },
};

export const Progress: Story = {
  render: Template.bind({}),
  args: { value: 75, size: "xl" },
};

export const Color: Story = {
  render: Template.bind({}),
  args: { children: "Loading...", color: "positive.500" },
};
