import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { HorizontalStack, HorizontalStackProps } from "../HorizontalStack";
import {
  PlaceholderBox,
  PlaceholderBoxProps,
  getDesignTokensControl,
} from "../utilities/storybook";

type Story = StoryObj<typeof HorizontalStack>;

const Content = (props: PlaceholderBoxProps) => (
  <PlaceholderBox
    width={150}
    height={150}
    style={{ flex: "0 0 auto" }}
    {...props}
  />
);

const Template = (args: HorizontalStackProps) => <HorizontalStack {...args} />;

const meta: Meta<typeof HorizontalStack> = {
  title: "Primitives/HorizontalStack",
  component: HorizontalStack,
  args: {
    gap: "2",
    children: (
      <>
        <Content />
        <Content />
        <Content />
      </>
    ),
  },
  argTypes: {
    gap: getDesignTokensControl("space.{alias}"),
  },
  parameters: {
    controls: {
      exclude: ["as", "children"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const Gap: Story = {
  render: Template.bind({}),
  args: {
    gap: "4",
  },
};

export const Align: Story = {
  render: Template.bind({}),
  args: {
    align: "center",
  },
};

export const BlockAlign: Story = {
  render: Template.bind({}),
  args: {
    blockAlign: "center",
    children: (
      <>
        <Content />
        <Content height={200} />
        <Content />
      </>
    ),
  },
};

export const Inline: Story = {
  render: Template.bind({}),
  args: {
    inline: true,
  },
};

export const Wrap: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <Content width={300} />
        <Content width={300} />
        <Content width={300} />
      </>
    ),
    wrap: true,
  },
};
