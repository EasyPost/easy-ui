import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { InlineStoryDecorator, FedExLogoImg } from "../utilities/storybook";
import { Pill, PillProps } from "./Pill";

type Story = StoryObj<typeof Pill>;

const Template = (args: PillProps) => <Pill {...args} />;

const meta: Meta<typeof Pill> = {
  title: "Components/Pill",
  component: Pill,
  decorators: [InlineStoryDecorator],
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const DefaultValue: Story = {
  render: () => <Pill icon={FedExLogoImg}>Pill will be here</Pill>,
};
