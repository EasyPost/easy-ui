import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Banner, BannerProps } from "./Banner";

type Story = StoryObj<typeof Banner>;

const Template = (args: BannerProps) => <Banner {...args} />;

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  argTypes: {
    emphasisText: {
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
    emphasisText: "Banner text",
    children: "Banner text",
  },
};

export const Success: Story = {
  render: Template.bind({}),
  args: {
    emphasisText: "Success color",
    children: "Banner text",
  },
};

export const Primary: Story = {
  render: Template.bind({}),
  args: {
    emphasisText: "Primary color",
    children: "Banner text",
    color: "primary",
  },
};

export const Neutral: Story = {
  render: Template.bind({}),
  args: {
    emphasisText: "Neutral color",
    children: "Banner text",
    color: "neutral",
  },
};

export const WithoutEmphasisText: Story = {
  render: Template.bind({}),
  args: {
    children: "Banner text",
  },
};

export const OnlyEmphasisText: Story = {
  render: Template.bind({}),
  args: {
    emphasisText: "Banner text",
  },
};
