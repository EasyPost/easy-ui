import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Banner, BannerProps } from "./Banner";

type Story = StoryObj<typeof Banner>;

const Template = (args: BannerProps) => <Banner {...args} />;

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  argTypes: {
    emphasis: {
      control: "text",
    },
    children: {
      control: "text",
    },
  },
  component: Banner,
};

export default meta;

export const Controls: Story = {
  render: Template.bind({}),
  args: {
    emphasis: "Banner text: ",
    children: "Banner text",
  },
};

export const Success: Story = {
  render: Template.bind({}),
  args: {
    emphasis: "Success variant: ",
    children: "Banner",
  },
};

export const Primary: Story = {
  render: Template.bind({}),
  args: {
    emphasis: "Primary variant: ",
    children: "Banner",
    variant: "primary",
  },
};

export const Neutral: Story = {
  render: Template.bind({}),
  args: {
    emphasis: "Neutral variant: ",
    children: "Banner",
    variant: "neutral",
  },
};
