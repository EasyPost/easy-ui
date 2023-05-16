import AnchorIcon from "@easypost/easy-ui-icons/Anchor";
import CheckIcon from "@easypost/easy-ui-icons/Check";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import WarningIcon from "@easypost/easy-ui-icons/Warning";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  InlineStoryDecorator,
  createLabelledOptionsControl,
} from "../utilities/storybook";
import { Badge, BadgeProps } from "./Badge";
import { Tooltip } from "../Tooltip";

type Story = StoryObj<typeof Badge>;

const Template = (args: BadgeProps) => <Badge {...args} />;

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    children: {
      control: "text",
    },
    icon: createLabelledOptionsControl({
      Anchor: AnchorIcon,
      Check: CheckIcon,
      Info: InfoIcon,
      Warning: WarningIcon,
    }),
    supportText: {
      control: "text",
    },
  },
};

export default meta;

export const SimpleText: Story = {
  render: Template.bind({}),
  args: {
    children: "Badge text",
  },
  parameters: {
    controls: {
      include: ["accessibilityLabel", "children", "variant"],
    },
  },
};

export const SimpleIcon: Story = {
  render: Template.bind({}),
  args: {
    icon: AnchorIcon,
    accessibilityLabel: "Text to describe badge",
  },
  parameters: {
    controls: {
      include: ["accessibilityLabel", "icon", "variant"],
    },
  },
};

export const DetailedIcon: Story = {
  render: Template.bind({}),
  args: {
    children: "Icon Badge",
    icon: AnchorIcon,
  },
  parameters: {
    controls: {
      include: ["accessibilityLabel", "children", "icon", "variant"],
    },
  },
};

export const DetailedText: Story = {
  render: Template.bind({}),
  args: {
    children: "Badge",
    supportText: "Badge",
  },
  parameters: {
    controls: {
      include: ["accessibilityLabel", "children", "supportText", "variant"],
    },
  },
};

export const Variants: Story = {
  render: (args) => (
    <>
      <Badge {...args} variant="primary" />
      <Badge {...args} variant="secondary" />
      <Badge {...args} variant="black" />
      <Badge {...args} variant="inverse" />
      <Badge {...args} variant="gray" />
      <Badge {...args} variant="success" />
      <Badge {...args} variant="warning" />
      <Badge {...args} variant="danger" />
    </>
  ),
  args: {
    children: "Badge",
    supportText: "Badge",
  },
  decorators: [InlineStoryDecorator],
  parameters: {
    controls: {
      exclude: ["variant"],
    },
  },
};

export const WithTooltip: Story = {
  render: (args) => (
    <Tooltip content="Here is a tooltip">
      <span tabIndex={0} style={{ display: "inline-flex", borderRadius: 8 }}>
        <Badge {...args} />
      </span>
    </Tooltip>
  ),
  args: {
    children: "Hover or focus me",
  },
};
