import AnchorIcon from "@easypost/easy-ui-icons/Anchor";
import CheckIcon from "@easypost/easy-ui-icons/Check";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import WarningIcon from "@easypost/easy-ui-icons/Warning";
import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  InlineStoryDecorator,
  createLabelledOptionsControl,
} from "../utilities/storybook";
import { AlertBadge, AlertBadgeProps } from "./AlertBadge";
import { Tooltip } from "../Tooltip";
import { Button } from "../Button";
import { IconButton } from "../IconButton";

type Story = StoryObj<typeof AlertBadge>;

const Template = (args: AlertBadgeProps) => (
  <AlertBadge {...args}>
    <Button onPress={() => alert("Button Clicked")}>Button</Button>
  </AlertBadge>
);

const meta: Meta<typeof AlertBadge> = {
  title: "Components/AlertBadge",
  component: AlertBadge,
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
    show: {
      control: "boolean",
    },
  },
};

export default meta;

export const Variants: Story = {
  render: (args) => (
    <>
      {Template({ variant: "primary", ...args })}
      {Template({ variant: "secondary", ...args })}
      {Template({ variant: "success", ...args })}
      {Template({ variant: "danger", ...args })}
    </>
  ),
  args: {
    show: true,
  },
  decorators: [InlineStoryDecorator],
  parameters: {
    controls: {
      include: ["show"],
    },
  },
};

export const Placement: Story = {
  render: (args) => (
    <>
      <AlertBadge {...args} placement="top right">
        <IconButton
          onPress={() => alert("Button Clicked")}
          accessibilityLabel="Alert Badge Icon Button: Top Right"
          color="primary"
          icon={AnchorIcon}
        />
      </AlertBadge>
      <AlertBadge {...args} placement="bottom right">
        <IconButton
          onPress={() => alert("Button Clicked")}
          accessibilityLabel="Alert Badge Icon Button: Buttom Right"
          color="primary"
          icon={AnchorIcon}
        />
      </AlertBadge>
    </>
  ),
  args: {
    show: true,
    variant: "danger",
  },
  decorators: [InlineStoryDecorator],
  parameters: {
    controls: {
      include: ["show", "variant"],
    },
  },
};

export const Icon: Story = {
  render: Template.bind({}),
  args: {
    accessibilityLabel: "Text to describe Alert Badge",
    icon: AnchorIcon,
    show: true,
    variant: "danger",
    placement: "top right",
  },
  parameters: {
    controls: {
      include: ["accessibilityLabel", "icon", "show", "variant", "placement"],
    },
  },
};

export const WithTooltip: Story = {
  render: (args) => (
    <Tooltip content="Here is a tooltip">
      <span tabIndex={0} style={{ display: "inline-flex", borderRadius: 8 }}>
        {Template(args)}
      </span>
    </Tooltip>
  ),
  args: {
    accessibilityLabel: "Text to describe Alert Badge",
    icon: AnchorIcon,
    show: true,
    variant: "danger",
    placement: "top right",
  },
  parameters: {
    controls: {
      include: ["accessibilityLabel", "icon", "show", "variant", "placement"],
    },
  },
};
