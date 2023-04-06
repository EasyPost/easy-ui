import React from "react";
import {
  ButtonStoryDecorator,
  ButtonStoryOnDarkBackgroundDecorator,
} from "../utilities/storybook";
import { DropdownButton, DropdownButtonProps } from "./DropdownButton";

const Template = (args: DropdownButtonProps) => <DropdownButton {...args} />;

export default {
  title: "Components/Button/DropdownButton",
  argTypes: {
    children: {
      control: "text",
    },
  },
  component: DropdownButton,
};

export const Controls = {
  render: Template.bind({}),
  args: {},
};

export const FilledButtons = {
  render: () => (
    <>
      <DropdownButton />
      <DropdownButton color="secondary" />
      <DropdownButton color="success" />
      <DropdownButton color="warning" />
      <DropdownButton color="neutral" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const OutlinedButtons = {
  render: () => (
    <>
      <DropdownButton variant="outlined" />
      <DropdownButton color="secondary" variant="outlined" />
      <DropdownButton color="support" variant="outlined" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const InverseButtons = {
  render: () => <DropdownButton color="inverse" variant="outlined" />,
  decorators: [ButtonStoryOnDarkBackgroundDecorator],
};

export const DisabledButtons = {
  render: () => (
    <>
      <DropdownButton isDisabled />
      <DropdownButton variant="outlined" isDisabled />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const ClickEvent = {
  render: () => <DropdownButton onPress={() => alert("clicked!")} />,
  decorators: [ButtonStoryDecorator],
};
