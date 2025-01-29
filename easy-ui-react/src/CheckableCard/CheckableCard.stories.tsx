import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CheckableCardProps, CheckableCard } from "./CheckableCard";

type Story = StoryObj<typeof CheckableCard>;

const Template = (args: CheckableCardProps) => <CheckableCard {...args} />;

const meta: Meta<typeof CheckableCard> = {
  title: "Components/CheckableCard",
  component: CheckableCard,
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    children: "Content",
  },
};
