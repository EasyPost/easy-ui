import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { createColorTokensControl } from "../utilities/storybook";
import { RadioButtonGroup, RadioButtonGroupProps } from "./RadioButtonGroup";

type Story = StoryObj<typeof RadioButtonGroup>;

const meta: Meta<typeof RadioButtonGroup> = {
  title: "Components/RadioButtonGroup",
  component: RadioButtonGroup,
  args: {
    color: "primary.500",
  },
  argTypes: {
    color: {
      ...createColorTokensControl(),
      table: {
        type: { summary: null },
      },
    },
  },
};

const Template = (args: RadioButtonGroupProps) => {
  const { children, ...restArgs } = args;
  return <RadioButtonGroup {...restArgs}>{children}</RadioButtonGroup>;
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <RadioButtonGroup.Button id="in">in</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="cm">cm</RadioButtonGroup.Button>
      </>
    ),
    defaultSelectedKeys: ["in"],
  },
};

export const SelectionMode: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <RadioButtonGroup.Button id="bold">Bold</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="italic">Italic</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="underline">
          Underline
        </RadioButtonGroup.Button>
      </>
    ),
    selectionMode: "multiple",
  },
};

export const EnabledDisabled: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <RadioButtonGroup.Button id="in">in</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="cm">cm</RadioButtonGroup.Button>
      </>
    ),
    isDisabled: true,
    defaultSelectedKeys: ["in"],
  },
};

export const EnabledDisabledButton: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <RadioButtonGroup.Button id="in">in</RadioButtonGroup.Button>
        <RadioButtonGroup.Button isDisabled id="cm">
          cm
        </RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="ft">ft</RadioButtonGroup.Button>
        <RadioButtonGroup.Button isDisabled id="mi">
          mi
        </RadioButtonGroup.Button>
      </>
    ),
    defaultSelectedKeys: ["in"],
  },
};

export const DisallowEmptySelection: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <RadioButtonGroup.Button id="in">in</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="cm">cm</RadioButtonGroup.Button>
      </>
    ),
    disallowEmptySelection: true,
    defaultSelectedKeys: ["in"],
  },
};
