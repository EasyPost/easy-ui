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
    secondaryLabel: {
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
    children: "Primary",
    secondaryLabel: "Secondary",
  },
  parameters: {
    controls: {
      include: ["accessibilityLabel", "children", "secondaryLabel", "variant"],
    },
  },
};

export const ColorVariants: Story = {
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
      <Badge {...args} variant="primary.100" />
      <Badge {...args} variant="primary.500" />
      <Badge {...args} variant="primary.700" />
      <Badge {...args} variant="secondary.100" />
      <Badge {...args} variant="secondary.500" />
      <Badge {...args} variant="secondary.700" />
      <Badge {...args} variant="positive.100" />
      <Badge {...args} variant="positive.600" />
      <Badge {...args} variant="positive.700" />
      <Badge {...args} variant="negative.100" />
      <Badge {...args} variant="negative.400" />
      <Badge {...args} variant="negative.600" />
      <Badge {...args} variant="warning.100" />
      <Badge {...args} variant="warning.500" />
      <Badge {...args} variant="warning.600" />
      <Badge {...args} variant="neutral.050" />
      <Badge {...args} variant="neutral.500" />
      <Badge {...args} variant="neutral.600" />
    </>
  ),
  args: {
    children: "Badge",
    secondaryLabel: "Badge",
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
