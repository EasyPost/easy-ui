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
    defaultSelectedKeys: ["in"],
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
        <RadioButtonGroup.Button id="ft">ft</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="mi">mi</RadioButtonGroup.Button>
      </>
    ),
  },
};
