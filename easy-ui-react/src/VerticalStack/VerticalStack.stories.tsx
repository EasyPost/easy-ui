import { Meta, StoryObj } from "@storybook/react";
import ezuiTokens from "@easypost/easy-ui-tokens/js/tokens";
import React from "react";
import {
  PlaceholderBox,
  PlaceholderBoxProps,
  getDesignTokensControl,
} from "../utilities/storybook";
import { VerticalStack, VerticalStackProps } from "./VerticalStack";

type Story = StoryObj<typeof VerticalStack>;

const Content = (props: PlaceholderBoxProps) => (
  <PlaceholderBox
    width={200}
    height={100}
    style={{ flex: "0 0 auto" }}
    {...props}
  />
);

const Template = (args: VerticalStackProps) => <VerticalStack {...args} />;

const meta: Meta<typeof VerticalStack> = {
  title: "Primitives/VerticalStack",
  component: VerticalStack,
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
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          height: 460,
          border: `1px solid ${ezuiTokens["color.red.500"]}`,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const InlineAlign: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <Content />
        <Content width={100} height={200} />
        <Content />
      </>
    ),
    inlineAlign: "center",
  },
};

export const Inline: Story = {
  render: Template.bind({}),
  args: {
    inline: true,
  },
};

export const ReverseOrder: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <Content>One</Content>
        <Content>Two</Content>
        <Content>Three</Content>
      </>
    ),
    reverseOrder: true,
  },
};
