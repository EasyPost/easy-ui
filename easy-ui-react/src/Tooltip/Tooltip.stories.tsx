import { Meta, StoryObj } from "@storybook/react";
import { startCase } from "lodash";
import React from "react";
import { Placement as AriaPlacement } from "react-aria";
import { Button } from "../Button";
import { OverlayLayoutDecorator } from "../utilities/storybook";
import { Tooltip, TooltipProps } from "./Tooltip";

type Story = StoryObj<typeof Tooltip>;

const Template = (args: TooltipProps) => <Tooltip {...args} />;

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    children: <a href="#">Hover or focus me</a>,
    content: "This is a tooltip",
  },
  argTypes: {
    children: {
      control: false,
    },
    onOpenChange: {
      control: false,
    },
    trigger: { control: "select", options: ["focus"] },
  },
  parameters: {
    overlayLayout: {
      triggerSpacingX: 48,
      triggerSpacingY: 48,
      framePaddingX: 24,
      framePaddingY: 96,
    },
  },
  decorators: [OverlayLayoutDecorator],
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    children: <a href="#">I have a tooltip</a>,
    defaultOpen: true,
  },
};

const placements = [
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
  "left top",
  "left bottom",
  "right top",
  "right bottom",
] as AriaPlacement[];

export const Placement: Story = {
  render: (args) => (
    <>
      {placements.map((placement) => (
        <Tooltip {...args} key={placement} placement={placement}>
          <a href="#">{startCase(placement)}</a>
        </Tooltip>
      ))}
    </>
  ),
  argTypes: {
    placement: {
      control: false,
    },
  },
};

export const Immediate: Story = {
  render: Template.bind({}),
  args: {
    isImmediate: true,
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
  },
};

export const FocusOnly: Story = {
  render: Template.bind({}),
  args: {
    children: <a href="#">Focus me</a>,
    trigger: "focus",
  },
};

export const ButtonTrigger: Story = {
  render: Template.bind({}),
  args: {
    children: <Button>Hover or focus me</Button>,
  },
};
