import AddIcon from "@easypost/easy-ui-icons/Add";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import React from "react";
import {
  ButtonStoryDecorator,
  ButtonStoryOnDarkBackgroundDecorator,
  createLabelledOptionsControl,
} from "../utilities/storybook";
import { IconButton, IconButtonProps } from "./IconButton";

const sharedIconButtonProps = {
  icon: ArrowBackIcon,
  accessibilityLabel: "Back",
};

const Template = (args: IconButtonProps) => <IconButton {...args} />;

export default {
  title: "Components/Button/IconButton",
  argTypes: {
    icon: createLabelledOptionsControl({
      ArrowBack: ArrowBackIcon,
      Add: AddIcon,
    }),
  },
  component: IconButton,
};

export const Controls = {
  render: Template.bind({}),
  args: {
    ...sharedIconButtonProps,
  },
};

export const FilledButtons = {
  render: () => (
    <>
      <IconButton {...sharedIconButtonProps} />
      <IconButton color="secondary" {...sharedIconButtonProps} />
      <IconButton color="success" {...sharedIconButtonProps} />
      <IconButton color="warning" {...sharedIconButtonProps} />
      <IconButton color="neutral" {...sharedIconButtonProps} />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const OutlinedButtons = {
  render: () => (
    <>
      <IconButton variant="outlined" {...sharedIconButtonProps} />
      <IconButton
        color="secondary"
        variant="outlined"
        {...sharedIconButtonProps}
      />
      <IconButton
        color="support"
        variant="outlined"
        {...sharedIconButtonProps}
      />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const InverseButton = {
  render: () => (
    <IconButton color="inverse" variant="outlined" {...sharedIconButtonProps} />
  ),
  decorators: [ButtonStoryOnDarkBackgroundDecorator],
};

export const DisabledButtons = {
  render: () => (
    <>
      <IconButton {...sharedIconButtonProps} isDisabled />
      <IconButton variant="outlined" {...sharedIconButtonProps} isDisabled />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const ClickEvent = {
  render: () => (
    <IconButton {...sharedIconButtonProps} onPress={() => alert("clicked!")} />
  ),
  decorators: [ButtonStoryDecorator],
};
